# Orders Service

## Overview

The Orders Service is a core microservice in the e-commerce platform responsible for managing order lifecycle operations. Built using .NET 9.0 and following Clean Architecture principles, it provides both REST and gRPC APIs for comprehensive order management.

## Features

- **Order Management**: Create, read, update, and delete orders
- **Order Items**: Add, remove, and modify items within orders
- **Status Tracking**: Track orders through their complete lifecycle (Pending → Processing → Shipped → Delivered)
- **Dual Protocol Support**: Both REST and gRPC endpoints for maximum flexibility
- **Domain Events**: Event-driven architecture for order state changes
- **Clean Architecture**: Separated concerns with Domain, Application, Infrastructure, and API layers

## Architecture

The service follows Clean Architecture with the following layers:

- **Orders.Api**: Web API and gRPC controllers, entry points
- **Orders.Application**: Business logic, commands, queries, DTOs, and services
- **Orders.Domain**: Core domain entities, value objects, domain events
- **Orders.Infrastructure**: Data persistence, external service integrations
- **Orders.Tests**: Unit and integration tests

## Technologies

- **.NET 9.0**: Core framework
- **ASP.NET Core**: Web API framework
- **gRPC**: High-performance RPC framework
- **Entity Framework Core**: Data access and ORM
- **Protocol Buffers**: gRPC service definitions
- **Clean Architecture**: Architectural pattern
- **CQRS**: Command Query Responsibility Segregation pattern

## API Documentation

### REST API
The service provides a RESTful API for all order operations. The API follows RESTful conventions and returns JSON responses.

### gRPC API
For high-performance scenarios, the service also provides gRPC endpoints. Detailed documentation for all gRPC endpoints is available:

- **[Complete API Documentation](Documentation/Api/ApiDocumentation.md)** - Overview of all gRPC endpoints
- **[Create Order](Documentation/Api/CreateOrder.md)** - Create new orders
- **[Get Order](Documentation/Api/GetOrder.md)** - Retrieve order by ID
- **[Get Orders](Documentation/Api/GetOrders.md)** - List orders with filtering
- **[Add Item to Order](Documentation/Api/AddItemToOrder.md)** - Add items to existing orders
- **[Remove Item from Order](Documentation/Api/RemoveItemFromOrder.md)** - Remove items from orders
- **[Update Item Quantity](Documentation/Api/UpdateOrderItemQuantity.md)** - Modify item quantities
- **[Update Order Status](Documentation/Api/UpdateOrderStatus.md)** - Change order status

### Protocol Buffers Schema
The gRPC service definitions are located in `Orders.Api/Protos/orders.proto`.

## Order Lifecycle

Orders flow through the following states:

1. **Pending** - Order created, awaiting processing
2. **Processing** - Order being prepared
3. **Shipped** - Order dispatched for delivery
4. **Delivered** - Order successfully delivered
5. **Cancelled** - Order cancelled (from Pending or Processing)
6. **Returned** - Order returned (from Delivered)

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- Docker (for containerized deployment)
- SQL Server or compatible database

### Running Locally

1. **Build the solution:**
   ```bash
   dotnet build
   ```

2. **Run database migrations:**
   ```bash
   ./Makemigrations.sh
   ```

3. **Start the service:**
   ```bash
   dotnet run --project Orders.Api
   ```

### Running with Docker

1. **Build and start with Docker Compose:**
   ```bash
   docker compose -f docker-compose.orders.yml up -d --build
   ```

## Configuration

The service can be configured through `appsettings.json` and `appsettings.Development.json`:

- **Database Connection**: Configure Entity Framework connection strings
- **gRPC Settings**: Port and reflection configuration
- **Logging**: Structured logging configuration
- **CORS**: Cross-origin resource sharing settings

## Endpoints

### REST Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}` - Update order
- `POST /api/orders/{id}/items` - Add item to order
- `DELETE /api/orders/{orderId}/items/{itemId}` - Remove item from order
- `PUT /api/orders/{orderId}/items/{itemId}/quantity` - Update item quantity
- `PUT /api/orders/{id}/status` - Update order status

### gRPC Service
- Service: `orders.Orders`
- Proto file: `Orders.Api/Protos/orders.proto`
- Default port: `5001` (HTTP/2)

## Development

### Project Structure
```
Orders/
├── Orders.Api/              # Web API and gRPC controllers
├── Orders.Application/      # Business logic layer
├── Orders.Domain/           # Domain entities and rules
├── Orders.Infrastructure/   # Data access and external services
├── Orders.Tests/           # Test projects
└── Documentation/          # API documentation
    └── Api/               # gRPC endpoint documentation
```

### Adding New Features

1. **Domain Layer**: Add entities, value objects, or domain events
2. **Application Layer**: Add commands, queries, or services
3. **Infrastructure Layer**: Add repositories or external integrations
4. **API Layer**: Add controllers or gRPC services
5. **Tests**: Add unit and integration tests

### Code Quality

The project follows:
- Clean Architecture principles
- SOLID principles
- Domain-driven design patterns
- Comprehensive error handling
- Input validation
- Structured logging

## Testing

Run tests using:
```bash
dotnet test
```

The test suite includes:
- Unit tests for domain logic
- Integration tests for API endpoints
- End-to-end scenario tests

## Monitoring and Logging

The service includes:
- Structured logging with Serilog
- Health checks for dependencies
- Performance monitoring
- Error tracking and alerting

## Contributing

1. Follow Clean Architecture principles
2. Write unit tests for new features
3. Update API documentation
4. Follow C# coding conventions
5. Ensure all tests pass before submitting

## Related Services

This Orders Service integrates with:
- **Customer Service**: Customer data and validation
- **Inventory Service**: Stock management and availability
- **Payment Service**: Payment processing and validation
- **Shipping Service**: Delivery tracking and logistics
- **Notification Service**: Customer communications

## Support

For questions or issues:
- Check the API documentation in `Documentation/Api/`
- Review the existing tests for usage examples
- Consult the Clean Architecture guidelines
- Check the project's issue tracker

---

**Version**: 1.0.0  
**Framework**: .NET 9.0  
**License**: MIT
