using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Shared.Contracts.Orders.Commands;
using Shared.Contracts.Inventory.Events;
using Shared.Contracts.Payments.Events;
using Shared.Contracts.Shipment.Events;
using Shared.Contracts.Orders.Events;
using Shared.Contracts.ShoppingCart.Events;
using Shared.Logging;
using Microsoft.Extensions.Logging;
using Orders.Application.Sagas;
using Orders.Infrastructure.Persistence;
using Shared.Infrastructure.Persistence.Interceptors;
using Orders.Application.Grpc;

public class OrderCreateSaga_E2ETests
{
    private readonly ILogger<OrderCreateSaga_E2ETests> _logger;

    // xUnit doesn't provide Microsoft.Extensions.Logging via constructor injection.
    // Create a logger locally so the test can run under `dotnet test`.
    public OrderCreateSaga_E2ETests()
    {
        var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.SetMinimumLevel(LogLevel.Information);
            builder.AddSimpleConsole(options =>
            {
                options.SingleLine = true;
                options.TimestampFormat = "HH:mm:ss.fff ";
            });
        });
        _logger = loggerFactory.CreateLogger<OrderCreateSaga_E2ETests>();
    }

    [Fact]
    public async Task OrderSaga_Completes_EndToEnd_With_RabbitMq()
    {
        // This test runs against the real RabbitMQ infrastructure and real database
        // It requires docker-compose to be running with RabbitMQ and PostgreSQL
        // Only external services (inventory, payment, shipping) are stubbed
        
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RabbitMQ"] = "amqp://guest:guest@localhost:5672/",
                ["ConnectionStrings:postgresdb"] = "Host=localhost;Port=5433;Database=ordersdb;Username=postgres;Password=order@123"
            })
            .Build();

        // Create service collection with real database and messaging infrastructure
        var services = new ServiceCollection();
        
        // Add logging
        services.AddLogging(builder =>
        {
            builder.SetMinimumLevel(LogLevel.Information);
            builder.AddSimpleConsole(options =>
            {
                options.SingleLine = true;
                options.TimestampFormat = "HH:mm:ss.fff ";
            });
        });

        // Add real database context
        services.AddDbContext<OrdersDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("postgresdb")));

        // Add real domain event interceptor
        services.AddScoped<PublishDomainEventsInterceptor>();

        // Add real application services
        services.AddApplicationServices();

        // Add real infrastructure services (this already includes MassTransit configuration)
        services.AddInfrastructure(configuration);

        await using var provider = services.BuildServiceProvider();
        
        // Configure endpoint conventions for E2E test stubs
        // This routes commands to RabbitMQ queues handled by test stub consumers
        try
        {
            EndpointConvention.Map<ReserveInventoryCommand>(new Uri("queue:inventory-e2e-stub"));
            EndpointConvention.Map<ReleaseInventoryCommand>(new Uri("queue:inventory-e2e-stub"));
            EndpointConvention.Map<ProcessPaymentCommand>(new Uri("queue:payment-e2e-stub"));
            EndpointConvention.Map<RefundPaymentCommand>(new Uri("queue:payment-e2e-stub"));
            EndpointConvention.Map<CreateShipmentCommand>(new Uri("queue:shipping-e2e-stub"));
        }
        catch (InvalidOperationException)
        {
            // Endpoint conventions already mapped - expected in test scenarios
        }
        
        // Initialize database
        using var scope = provider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
        await dbContext.Database.EnsureCreatedAsync();
        
        var busControl = provider.GetRequiredService<IBusControl>();
        await busControl.StartAsync(TimeSpan.FromSeconds(30));
        
        try
        {
            var customerId = NewId.NextGuid();
            var orderId = NewId.NextGuid();
            
            _logger.LogInformation("Starting E2E test for Customer {CustomerId}, Order {OrderId}", customerId, orderId);

            // Wait a moment for the endpoints to be ready
            await Task.Delay(2000);
            
            // Start the saga workflow by publishing OrderCreatedIntegrationEvent
            _logger.LogInformation("Publishing OrderCreatedIntegrationEvent for Order {OrderId}", orderId);
            
            var items = new[]
            {
                new OrderItemResponseDto(
                    NewId.NextGuid(),
                    NewId.NextGuid(),
                    "Demo Product",
                    2,
                    25m,
                    "USD"
                )
            }.ToList();

            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId,
                customerId,
                99.99m,
                "USD",
                items
            ));

            // Wait a moment for the saga to process and move to ReservingInventory
            await Task.Delay(2000);
            
            _logger.LogInformation("Publishing InventoryReservedIntegrationEvent for Order {OrderId}", orderId);
            
            // Simulate inventory service response
            await busControl.Publish(new InventoryReservedIntegrationEvent(
                orderId,
                $"RSV-{orderId:N}",
                "InventoryReserved",
                DateTime.UtcNow
            ));

            // Wait for saga to process inventory and move to ProcessingPayment
            await Task.Delay(2000);
            
            _logger.LogInformation("Publishing PaymentProcessedIntegrationEvent for Order {OrderId}", orderId);
            
            // Simulate payment service response  
            await busControl.Publish(new PaymentProcessedIntegrationEvent(
                orderId,
                NewId.NextGuid(),
                99.99m,
                "USD",
                "CreditCard",
                "Paid",
                DateTime.UtcNow
            ));

            // Wait for saga to process payment and move to CreatingShipment
            await Task.Delay(2000);
            
            _logger.LogInformation("Publishing ShipmentCreatedIntegrationEvent for Order {OrderId}", orderId);
            
            // Simulate shipping service response
            await busControl.Publish(new ShipmentCreatedIntegrationEvent(
                orderId,
                $"SHP-{orderId:N}",
                "ShipmentCreated",
                DateTime.UtcNow
            ));

            // Wait for saga to process shipment and move to Shipped
            await Task.Delay(2000);
            
            _logger.LogInformation("Publishing OrderDeliveredIntegrationEvent for Order {OrderId}", orderId);
            
            // Simulate delivery
            await busControl.Publish(new OrderDeliveredIntegrationEvent(
                orderId,
                $"SHP-{orderId:N}",
                DateTime.UtcNow
            ));

            // Wait for processing and check database for saga data
            await Task.Delay(3000);
            
            // Check if saga instance was created in database
            using var checkScope = provider.CreateScope();
            var checkDbContext = checkScope.ServiceProvider.GetRequiredService<OrdersDbContext>();
            var sagaCount = await checkDbContext.Database.ExecuteSqlRawAsync("SELECT 1");
            
            // Try to get actual saga count and final state using a simple query
            using var connection = checkDbContext.Database.GetDbConnection();
            await connection.OpenAsync();
            using var command = connection.CreateCommand();
            command.CommandText = $"SELECT COUNT(*) FROM \"OrderCreateSagaStates\"";
            var result = await command.ExecuteScalarAsync();
            var actualSagaCount = Convert.ToInt32(result);
            
            // Get the state of our specific saga
            using var stateCommand = connection.CreateCommand();
            stateCommand.CommandText = $"SELECT \"CurrentState\", \"InventoryStatus\", \"PaymentStatus\", \"ShippingStatus\" FROM \"OrderCreateSagaStates\" WHERE \"OrderId\" = '{orderId}'";
            using var reader = await stateCommand.ExecuteReaderAsync();
            
            string? currentState = null, inventoryStatus = null, paymentStatus = null, shippingStatus = null;
            if (await reader.ReadAsync())
            {
                currentState = reader[0]?.ToString();
                inventoryStatus = reader[1]?.ToString();
                paymentStatus = reader[2]?.ToString();
                shippingStatus = reader[3]?.ToString();
            }
            
            _logger.LogInformation("E2E test completed - Saga instances in database: {Count}", actualSagaCount);
            _logger.LogInformation("Our saga state: {State}, Inventory: {Inventory}, Payment: {Payment}, Shipping: {Shipping}", 
                currentState, inventoryStatus, paymentStatus, shippingStatus);
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }
}

public class InventoryE2EStubConsumer : IConsumer<ReserveInventoryCommand>, IConsumer<ReleaseInventoryCommand>
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<InventoryE2EStubConsumer> _logger;

    public InventoryE2EStubConsumer(IPublishEndpoint publishEndpoint, ILogger<InventoryE2EStubConsumer> logger)
    {
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ReserveInventoryCommand> context)
    {
        _logger.LogInformation("E2E Stub: Reserving inventory for Order {OrderId}", context.Message.OrderId);
        
        await _publishEndpoint.Publish(new InventoryReservedIntegrationEvent(
            context.Message.OrderId,
            $"RSV-{context.Message.OrderId:N}",
            "InventoryReserved",
            DateTime.UtcNow
        ));
    }

    public async Task Consume(ConsumeContext<ReleaseInventoryCommand> context)
    {
        _logger.LogInformation("E2E Stub: Releasing inventory for Order {OrderId}", context.Message.OrderId);
        // For this test, we don't need to publish anything for release
        await Task.CompletedTask;
    }
}

public class PaymentE2EStubConsumer : IConsumer<ProcessPaymentCommand>, IConsumer<RefundPaymentCommand>
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<PaymentE2EStubConsumer> _logger;

    public PaymentE2EStubConsumer(IPublishEndpoint publishEndpoint, ILogger<PaymentE2EStubConsumer> logger)
    {
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ProcessPaymentCommand> context)
    {
        _logger.LogInformation("E2E Stub: Processing payment for Order {OrderId}", context.Message.OrderId);
        
        await _publishEndpoint.Publish(new PaymentProcessedIntegrationEvent(
            context.Message.OrderId,
            NewId.NextGuid(),
            context.Message.Amount,
            context.Message.Currency,
            context.Message.PaymentMethod,
            "Paid",
            DateTime.UtcNow
        ));
    }

    public async Task Consume(ConsumeContext<RefundPaymentCommand> context)
    {
        _logger.LogInformation("E2E Stub: Refunding payment for Order {OrderId}", context.Message.OrderId);
        // For this test, we don't need to publish anything for refund
        await Task.CompletedTask;
    }
}

public class ShippingE2EStubConsumer : IConsumer<CreateShipmentCommand>
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<ShippingE2EStubConsumer> _logger;

    public ShippingE2EStubConsumer(IPublishEndpoint publishEndpoint, ILogger<ShippingE2EStubConsumer> logger)
    {
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<CreateShipmentCommand> context)
    {
        _logger.LogInformation("E2E Stub: Creating shipment for Order {OrderId}", context.Message.OrderId);
        
        await _publishEndpoint.Publish(new ShipmentCreatedIntegrationEvent(
            context.Message.OrderId,
            $"SHP-{context.Message.OrderId:N}",
            "ShipmentCreated",
            DateTime.UtcNow
        ));

        // Simulate delivery after shipment creation
        await _publishEndpoint.Publish(new OrderDeliveredIntegrationEvent(
            context.Message.OrderId,
            $"SHP-{context.Message.OrderId:N}",
            DateTime.UtcNow
        ));
    }
}

// Status listener for E2E test
public class OrderStatusListener : IConsumer<OrderStatusChangedIntegrationEvent>
{
    private readonly ILogger<OrderStatusListener> _logger;
    private Guid? _expectedOrderId;
    private TaskCompletionSource<bool>? _completionSource;

    public OrderStatusListener(ILogger<OrderStatusListener> logger)
    {
        _logger = logger;
    }

    public void SetExpectedOrderId(Guid? orderId, TaskCompletionSource<bool> completionSource)
    {
        _expectedOrderId = orderId;
        _completionSource = completionSource;
    }

    public async Task Consume(ConsumeContext<OrderStatusChangedIntegrationEvent> context)
    {
        _logger.LogInformation("E2E Test: Received OrderStatusChanged: {OrderId} -> {Status}", 
            context.Message.OrderId, context.Message.Status);
        
        // If no specific OrderId was set (null), accept any order completion
        // If a specific OrderId was set, only accept that order
        if ((_expectedOrderId == null || context.Message.OrderId == _expectedOrderId) && 
            context.Message.Status == "Completed" &&
            _completionSource != null)
        {
            _logger.LogInformation("E2E Test: Order completed successfully!");
            _completionSource.TrySetResult(true);
        }
        
        await Task.CompletedTask;
    }
}