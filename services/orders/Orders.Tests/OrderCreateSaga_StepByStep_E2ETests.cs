using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using MassTransit;
using Xunit;
using Xunit.Abstractions;
using Orders.Infrastructure.Persistence;
using Orders.Application.Sagas;
using Orders.Infrastructure;
using Orders.Application;
using Shared.Infrastructure.Persistence.Interceptors;
using Shared.Contracts.Orders.Events;
using Shared.Contracts.Inventory.Events;
using Shared.Contracts.Payments.Events;
using Shared.Contracts.Shipment.Events;
using System.Collections.Immutable;
using Shared.Contracts.Orders.Commands;

namespace Orders.Tests;

public class OrderCreateSaga_StepByStep_E2ETests
{
    private readonly ITestOutputHelper _output;
    
    public OrderCreateSaga_StepByStep_E2ETests(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public async Task OrderSaga_Step1_InitialOrderCreated_TransitionsToReservingInventory()
    {
        // Arrange
        var (provider, busControl, logger) = await SetupTestEnvironment();
        
        try
        {
            // Act
            var customerId = NewId.NextGuid();
            var orderId = NewId.NextGuid();
            
            logger.LogInformation("Testing Step 1: OrderCreated -> ReservingInventory for Order {OrderId}", orderId);

            await Task.Delay(2000); // Wait for bus to be ready
            
            // Start the saga by publishing OrderCreatedIntegrationEvent
            var items = new[]
            {
                new OrderItemResponseDto
                (
                    NewId.NextGuid(),
                    NewId.NextGuid(),
                    "Test Product 1",
                    1,
                    100.00m,
                    "USD"
                )
            }.ToList();

            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId,
                customerId,
                100.00m,
                "USD",
                items
            ));

            await Task.Delay(3000); // Wait for processing
            
            // Assert
            var sagaState = await GetSagaState(provider, orderId);
            Assert.NotNull(sagaState);
            Assert.Equal("ReservingInventory", sagaState.CurrentState);
            
            logger.LogInformation("Step 1 completed: Saga state is {State}", sagaState.CurrentState);
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }

    [Fact]
    public async Task OrderSaga_Step2_OrderCreatedToInventoryReserved_TransitionsToProcessingPayment()
    {
        // Arrange
        var (provider, busControl, logger) = await SetupTestEnvironment();
        
        try
        {
            // Act
            var customerId = NewId.NextGuid();
            var orderId = NewId.NextGuid();
            
            logger.LogInformation("Testing Step 2: ReservingInventory -> ProcessingPayment for Order {OrderId}", orderId);

            await Task.Delay(2000);
            
            // Step 1: Create order
            var items = new[]
            {
                new OrderItemResponseDto
                (
                    NewId.NextGuid(),
                    NewId.NextGuid(),
                    "Test Product 1",
                    1,
                    100.00m,
                    "USD"
                )
            }.ToList();

            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId, customerId, 100.00m, "USD", items
            ));

            await Task.Delay(2000);
            
            // Step 2: Reserve inventory
            await busControl.Publish(new InventoryReservedIntegrationEvent(
                orderId,
                $"RSV-{orderId:N}",
                "InventoryReserved",
                DateTime.UtcNow
            ));

            await Task.Delay(3000);
            
            // Assert
            var sagaState = await GetSagaState(provider, orderId);
            Assert.NotNull(sagaState);
            Assert.Equal("ProcessingPayment", sagaState.CurrentState);
            Assert.Equal("InventoryReserved", sagaState.InventoryStatus);
            
            logger.LogInformation("Step 2 completed: Saga state is {State}, Inventory: {Inventory}", 
                sagaState.CurrentState, sagaState.InventoryStatus);
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }

    [Fact]
    public async Task OrderSaga_Step3_PaymentProcessed_TransitionsToCreatingShipment()
    {
        // Arrange
        var (provider, busControl, logger) = await SetupTestEnvironment();
        
        try
        {
            // Act
            var customerId = NewId.NextGuid();
            var orderId = NewId.NextGuid();
            
            logger.LogInformation("Testing Step 3: ProcessingPayment -> CreatingShipment for Order {OrderId}", orderId);

            await Task.Delay(2000);
            
            // Steps 1-2: Create order and reserve inventory
            var items = new[]
            {
                new OrderItemResponseDto
                (
                    NewId.NextGuid(),
                    NewId.NextGuid(),
                    "Test Product 1",
                    1,
                    100.00m,
                    "USD"
                )
            }.ToList();

            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId, customerId, 100.00m, "USD", items
            ));
            await Task.Delay(2000);
            
            await busControl.Publish(new InventoryReservedIntegrationEvent(
                orderId, $"RSV-{orderId:N}", "InventoryReserved", DateTime.UtcNow));
            await Task.Delay(2000);
            
            // Step 3: Process payment
            await busControl.Publish(new PaymentProcessedIntegrationEvent(
                orderId,
                NewId.NextGuid(),
                100.00m,
                "USD",
                "CreditCard",
                "Paid",
                DateTime.UtcNow
            ));

            await Task.Delay(3000);
            
            // Assert
            var sagaState = await GetSagaState(provider, orderId);
            Assert.NotNull(sagaState);
            Assert.Equal("CreatingShipment", sagaState.CurrentState);
            Assert.Equal("Paid", sagaState.PaymentStatus);
            
            logger.LogInformation("Step 3 completed: Saga state is {State}, Payment: {Payment}", 
                sagaState.CurrentState, sagaState.PaymentStatus);
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }

    [Fact]
    public async Task OrderSaga_Step4_ShipmentCreated_TransitionsToShipped()
    {
        // Arrange
        var (provider, busControl, logger) = await SetupTestEnvironment();
        
        try
        {
            // Act
            var customerId = NewId.NextGuid();
            var orderId = NewId.NextGuid();
            
            logger.LogInformation("Testing Step 4: CreatingShipment -> Shipped for Order {OrderId}", orderId);

            await Task.Delay(2000);
            
            // Steps 1-3: Create order, reserve inventory, process payment
            var items = new[]
            {
                new OrderItemResponseDto
                (
                    NewId.NextGuid(),
                    NewId.NextGuid(),
                    "Test Product 1",
                    1,
                    100.00m,
                    "USD"
                )
            }.ToList();

            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId, customerId, 100.00m, "USD", items
            ));
            await Task.Delay(2000);
            
            await busControl.Publish(new InventoryReservedIntegrationEvent(
                orderId, $"RSV-{orderId:N}", "InventoryReserved", DateTime.UtcNow));
            await Task.Delay(2000);
            
            await busControl.Publish(new PaymentProcessedIntegrationEvent(
                orderId, NewId.NextGuid(), 100.00m, "USD", "CreditCard", "Paid", DateTime.UtcNow));
            await Task.Delay(2000);
            
            // Step 4: Create shipment
            await busControl.Publish(new ShipmentCreatedIntegrationEvent(
                orderId,
                $"SHP-{orderId:N}",
                "ShipmentCreated",
                DateTime.UtcNow
            ));

            await Task.Delay(3000);
            
            // Assert
            var sagaState = await GetSagaState(provider, orderId);
            Assert.NotNull(sagaState);
            Assert.Equal("Shipped", sagaState.CurrentState);
            Assert.Equal("ShipmentCreated", sagaState.ShippingStatus);
            
            logger.LogInformation("Step 4 completed: Saga state is {State}, Shipping: {Shipping}", 
                sagaState.CurrentState, sagaState.ShippingStatus);
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }

    [Fact]
    public async Task OrderSaga_Step5_OrderDelivered_TransitionsToCompleted()
    {
        // Arrange
        var (provider, busControl, logger) = await SetupTestEnvironment();
        
        try
        {
            // Act
            var customerId = NewId.NextGuid();
            var orderId = NewId.NextGuid();
            
            logger.LogInformation("Testing Step 5: Shipped -> Completed for Order {OrderId}", orderId);

            await Task.Delay(2000);
            
            // Steps 1-4: Complete workflow up to shipped
            var items = new[]
            {
                new OrderItemResponseDto
                (
                    NewId.NextGuid(),
                    NewId.NextGuid(),
                    "Test Product 1",
                    1,
                    100.00m,
                    "USD"
                )
            }.ToList();

            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId, customerId, 100.00m, "USD", items
            ));
            await Task.Delay(2000);
            
            await busControl.Publish(new InventoryReservedIntegrationEvent(
                orderId, $"RSV-{orderId:N}", "InventoryReserved", DateTime.UtcNow));
            await Task.Delay(2000);
            
            await busControl.Publish(new PaymentProcessedIntegrationEvent(
                orderId, NewId.NextGuid(), 100.00m, "USD", "CreditCard", "Paid", DateTime.UtcNow));
            await Task.Delay(2000);
            
            await busControl.Publish(new ShipmentCreatedIntegrationEvent(
                orderId, $"SHP-{orderId:N}", "ShipmentCreated", DateTime.UtcNow));
            await Task.Delay(2000);
            
            // Step 5: Deliver order
            await busControl.Publish(new OrderDeliveredIntegrationEvent(
                orderId,
                $"SHP-{orderId:N}",
                DateTime.UtcNow
            ));

            await Task.Delay(3000);
            
            // Assert - Saga should be finalized and removed from database after completion
            var sagaState = await GetSagaState(provider, orderId);
            Assert.Null(sagaState); // Saga is finalized and removed when completed
            
            logger.LogInformation("Step 5 completed: Saga successfully finalized and removed from database (completed workflow)");
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }

    [Fact]
    public async Task OrderSaga_CompleteWorkflow_AllStepsInSequence()
    {
        // Arrange
        var (provider, busControl, logger) = await SetupTestEnvironment();
        
        try
        {
            // Act
            var customerId = NewId.NextGuid();
            var orderId = NewId.NextGuid();
            
            logger.LogInformation("Testing Complete Workflow - All Steps in Sequence for Order {OrderId}", orderId);

            await Task.Delay(2000);
            
            // Complete workflow with validation at each step
            var items = new[]
            {
                new OrderItemResponseDto
                (
                    NewId.NextGuid(),
                    NewId.NextGuid(),
                    "Test Product 1",
                    2,
                    65.00m,
                    "USD"
                )
            }.ToList();

            // Step 1: Order Created
            await busControl.Publish(new OrderCreatedIntegrationEvent(
                orderId, customerId, 130.00m, "USD", items
            ));
            await Task.Delay(2000);
            
            var state1 = await GetSagaState(provider, orderId);
            Assert.Equal("ReservingInventory", state1?.CurrentState);
            logger.LogInformation("✅ Step 1 passed: {State}", state1?.CurrentState);
            
            // Step 2: Inventory Reserved
            await busControl.Publish(new InventoryReservedIntegrationEvent(
                orderId, $"RSV-{orderId:N}", "InventoryReserved", DateTime.UtcNow));
            await Task.Delay(2000);
            
            var state2 = await GetSagaState(provider, orderId);
            Assert.Equal("ProcessingPayment", state2?.CurrentState);
            Assert.Equal("InventoryReserved", state2?.InventoryStatus);
            logger.LogInformation("✅ Step 2 passed: {State}, Inventory: {Inventory}", 
                state2?.CurrentState, state2?.InventoryStatus);
            
            // Step 3: Payment Processed
            await busControl.Publish(new PaymentProcessedIntegrationEvent(
                orderId, NewId.NextGuid(), 130.00m, "USD", "CreditCard", "Paid", DateTime.UtcNow));
            await Task.Delay(2000);
            
            var state3 = await GetSagaState(provider, orderId);
            Assert.Equal("CreatingShipment", state3?.CurrentState);
            Assert.Equal("Paid", state3?.PaymentStatus);
            logger.LogInformation("✅ Step 3 passed: {State}, Payment: {Payment}", 
                state3?.CurrentState, state3?.PaymentStatus);
            
            // Step 4: Shipment Created
            await busControl.Publish(new ShipmentCreatedIntegrationEvent(
                orderId, $"SHP-{orderId:N}", "ShipmentCreated", DateTime.UtcNow));
            await Task.Delay(2000);
            
            var state4 = await GetSagaState(provider, orderId);
            Assert.Equal("Shipped", state4?.CurrentState);
            Assert.Equal("ShipmentCreated", state4?.ShippingStatus);
            logger.LogInformation("✅ Step 4 passed: {State}, Shipping: {Shipping}", 
                state4?.CurrentState, state4?.ShippingStatus);
            
            // Step 5: Order Delivered
            await busControl.Publish(new OrderDeliveredIntegrationEvent(
                orderId, $"SHP-{orderId:N}", DateTime.UtcNow));
            await Task.Delay(3000);
            
            // Final Assert - Saga should be finalized and removed from database after completion
            var finalState = await GetSagaState(provider, orderId);
            Assert.Null(finalState); // Saga is finalized and removed when completed
            
            logger.LogInformation("🎉 Complete workflow test completed successfully!");
            logger.LogInformation("Final result: Saga successfully finalized and removed from database (workflow completed)");
        }
        finally
        {
            await busControl.StopAsync(TimeSpan.FromSeconds(30));
        }
    }

    private async Task<(ServiceProvider provider, IBusControl busControl, ILogger<OrderCreateSaga_StepByStep_E2ETests> logger)> SetupTestEnvironment()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RabbitMQ"] = "amqp://guest:guest@localhost:5672/",
                ["ConnectionStrings:postgresdb"] = "Host=localhost;Port=5433;Database=ordersdb;Username=postgres;Password=order@123",
                ["USE_E2E_STUBS"] = "true" // Enable E2E stub routing
            })
            .Build();

        var services = new ServiceCollection();
        
        // Add logging with XUnit output
        services.AddLogging(builder =>
        {
            builder.AddXUnit(_output);
            builder.SetMinimumLevel(LogLevel.Information);
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

        var provider = services.BuildServiceProvider();
        
        // Initialize database
        using var scope = provider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
        await dbContext.Database.EnsureCreatedAsync();
        
        var busControl = provider.GetRequiredService<IBusControl>();
        var logger = provider.GetRequiredService<ILogger<OrderCreateSaga_StepByStep_E2ETests>>();

        await busControl.StartAsync(TimeSpan.FromSeconds(30));
        
        return (provider, busControl, logger);
    }

    private async Task<SagaStateInfo?> GetSagaState(ServiceProvider provider, Guid orderId)
    {
        using var scope = provider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
        using var connection = dbContext.Database.GetDbConnection();
        await connection.OpenAsync();
        
        using var command = connection.CreateCommand();
        command.CommandText = $"SELECT \"CurrentState\", \"InventoryStatus\", \"PaymentStatus\", \"ShippingStatus\" FROM \"OrderCreateSagaStates\" WHERE \"OrderId\" = '{orderId}'";
        using var reader = await command.ExecuteReaderAsync();
        
        if (await reader.ReadAsync())
        {
            return new SagaStateInfo
            {
                CurrentState = reader[0]?.ToString(),
                InventoryStatus = reader[1]?.ToString(),
                PaymentStatus = reader[2]?.ToString(),
                ShippingStatus = reader[3]?.ToString()
            };
        }
        
        return null;
    }

    private async Task<List<SagaStateInfoWithOrderId>> GetAllSagaStates(ServiceProvider provider)
    {
        using var scope = provider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
        using var connection = dbContext.Database.GetDbConnection();
        await connection.OpenAsync();
        
        using var command = connection.CreateCommand();
        command.CommandText = "SELECT \"OrderId\", \"CurrentState\", \"InventoryStatus\", \"PaymentStatus\", \"ShippingStatus\" FROM \"OrderCreateSagaStates\"";
        using var reader = await command.ExecuteReaderAsync();
        
        var sagas = new List<SagaStateInfoWithOrderId>();
        while (await reader.ReadAsync())
        {
            sagas.Add(new SagaStateInfoWithOrderId
            {
                OrderId = reader[0] != DBNull.Value ? (Guid)reader[0] : Guid.Empty,
                CurrentState = reader[1]?.ToString(),
                InventoryStatus = reader[2]?.ToString(),
                PaymentStatus = reader[3]?.ToString(),
                ShippingStatus = reader[4]?.ToString()
            });
        }
        
        return sagas;
    }

    private class SagaStateInfo
    {
        public string? CurrentState { get; set; }
        public string? InventoryStatus { get; set; }
        public string? PaymentStatus { get; set; }
        public string? ShippingStatus { get; set; }
    }

    private class SagaStateInfoWithOrderId
    {
        public Guid OrderId { get; set; }
        public string? CurrentState { get; set; }
        public string? InventoryStatus { get; set; }
        public string? PaymentStatus { get; set; }
        public string? ShippingStatus { get; set; }
    }
}
