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
using Shared.Logging;
using Microsoft.Extensions.Logging;

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
        // This test runs against the real RabbitMQ infrastructure
        // It requires docker-compose to be running with RabbitMQ and PostgreSQL
        
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RabbitMQ"] = "amqp://guest:guest@localhost:5672/",
                ["ConnectionStrings:postgresdb"] = "Host=localhost;Port=5433;Database=ordersdb;Username=postgres;Password=order@123"
            })
            .Build();

        // Create service collection with real RabbitMQ configuration
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

        // Create a completion source to wait for the final order status
        var completionSource = new TaskCompletionSource<bool>();
        var cancellationToken = new CancellationTokenSource(TimeSpan.FromSeconds(30)).Token;
        var orderId = NewId.NextGuid();
        var customerId = NewId.NextGuid();

        // Add a status listener consumer
        services.AddSingleton(completionSource);
        services.AddSingleton<OrderStatusListener>();

        // Add MassTransit with RabbitMQ and external service stubs
        services.AddMassTransit(x =>
        {
            // Add stub consumers for external services
            // These will listen on the E2E stub queues that the Orders.Api routes to
            // when USE_E2E_STUBS=true
            
            x.AddConsumer<InventoryE2EStubConsumer>();
            x.AddConsumer<PaymentE2EStubConsumer>();
            x.AddConsumer<ShippingE2EStubConsumer>();
            x.AddConsumer<OrderStatusListener>();

            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(configuration.GetConnectionString("RabbitMQ"));

                // Configure specific endpoints for the E2E stubs to match the naming from Orders.Api
                cfg.ReceiveEndpoint("inventory-e2e-stub", e =>
                {
                    e.ConfigureConsumer<InventoryE2EStubConsumer>(context);
                });

                cfg.ReceiveEndpoint("payment-e2e-stub", e =>
                {
                    e.ConfigureConsumer<PaymentE2EStubConsumer>(context);
                });

                cfg.ReceiveEndpoint("shipping-e2e-stub", e =>
                {
                    e.ConfigureConsumer<ShippingE2EStubConsumer>(context);
                });

                // Configure endpoint for status listener
                cfg.ReceiveEndpoint($"test-status-listener-{orderId:N}", e =>
                {
                    e.ConfigureConsumer<OrderStatusListener>(context);
                });

                cfg.Send<ReserveInventoryCommand>(x => x.UseRoutingKeyFormatter(context => "inventory-e2e-stub"));
                cfg.Send<ReleaseInventoryCommand>(x => x.UseRoutingKeyFormatter(context => "inventory-e2e-stub"));

            });
        });

        await using var provider = services.BuildServiceProvider();
        
        // Configure the order status listener with the specific order ID we're testing
        var statusListener = provider.GetRequiredService<OrderStatusListener>();
        statusListener.SetExpectedOrderId(orderId, completionSource);
        
        var busControl = provider.GetRequiredService<IBusControl>();
        await busControl.StartAsync(TimeSpan.FromSeconds(30));
        
        try
        {
            _logger.LogInformation("Starting E2E test for Order {OrderId}", orderId);

            // Wait a moment for the endpoints to be ready
            await Task.Delay(2000);

            // Kick off the saga by publishing OrderCreated event
            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId,
                customerId,
                149.99m,
                "USD",
                new()
            ));

            // Wait for completion or timeout
            cancellationToken.Register(() =>
            {
                if (!completionSource.Task.IsCompleted)
                    completionSource.TrySetException(new TimeoutException("Test timed out waiting for order completion"));
            });

            await completionSource.Task;
            
            _logger.LogInformation("E2E test completed successfully for Order {OrderId}", orderId);
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }  
}

// Stub consumers for external services in E2E test
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

    public void SetExpectedOrderId(Guid orderId, TaskCompletionSource<bool> completionSource)
    {
        _expectedOrderId = orderId;
        _completionSource = completionSource;
    }

    public async Task Consume(ConsumeContext<OrderStatusChangedIntegrationEvent> context)
    {
        _logger.LogInformation("E2E Test: Received OrderStatusChanged: {OrderId} -> {Status}", 
            context.Message.OrderId, context.Message.Status);
        
        if (_expectedOrderId.HasValue && 
            context.Message.OrderId == _expectedOrderId && 
            context.Message.Status == "Completed" &&
            _completionSource != null)
        {
            _logger.LogInformation("E2E Test: Order completed successfully!");
            _completionSource.TrySetResult(true);
        }
        
        await Task.CompletedTask;
    }
}