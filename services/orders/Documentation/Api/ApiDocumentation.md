# Orders Service - gRPC API Documentation

## Overview
The Orders Service provides gRPC endpoints for managing orders in the e-commerce microservice architecture. This service handles order creation, retrieval, item management, and status updates.

**Service**: `orders.Orders`  
**Package**: `orders`  
**Namespace**: `Orders.Api.Grpc`

---

## Table of Contents
1. [CreateOrder](#1-createorder)
2. [GetOrder](#2-getorder)
3. [GetOrders](#3-getorders)
4. [AddItemToOrder](#4-additemtoorder)
5. [RemoveItemFromOrder](#5-removeitemfromorder)
6. [UpdateOrderItemQuantity](#6-updateorderitemquantity)
7. [UpdateOrderStatus](#7-updateorderstatus)
8. [UpdateOrder](#8-updateorder)
9. [Data Types](#data-types)
10. [Error Handling](#error-handling)
11. [Usage Examples](#usage-examples)

---

### 1. CreateOrder

Creates a new order with the specified items.

**Method**: `orders.Orders/CreateOrder`

#### Request
```json
{
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "currency": "USD",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "productName": "iPhone 15 Pro",
      "quantity": 2,
      "unitPrice": 999.99,
      "currency": "USD"
    },
    {
      "productId": "550e8400-e29b-41d4-a716-446655440002",
      "productName": "iPhone Case",
      "quantity": 2,
      "unitPrice": 49.99,
      "currency": "USD"
    }
  ]
}
```

#### Response
```json
{
  "order": {
    "id": "789e4567-e89b-12d3-a456-426614174003",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "currency": "USD",
    "status": "Pending",
    "createdAt": "638380512000000000",
    "updatedAt": "638380512000000000",
    "totalAmount": 2099.96,
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro",
        "quantity": 2,
        "unitPrice": 999.99,
        "currency": "USD"
      },
      {
        "id": "789e4567-e89b-12d3-a456-426614174005",
        "productId": "550e8400-e29b-41d4-a716-446655440002",
        "productName": "iPhone Case",
        "quantity": 2,
        "unitPrice": 49.99,
        "currency": "USD"
      }
    ]
  }
}
```

---

### 2. GetOrder

Retrieves a specific order by its ID.

**Method**: `orders.Orders/GetOrder`

#### Request
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003"
}
```

#### Response
```json
{
  "order": {
    "id": "789e4567-e89b-12d3-a456-426614174003",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "currency": "USD",
    "status": "Processing",
    "createdAt": "638380512000000000",
    "updatedAt": "638380515200000000",
    "totalAmount": 2099.96,
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro",
        "quantity": 2,
        "unitPrice": 999.99,
        "currency": "USD"
      },
      {
        "id": "789e4567-e89b-12d3-a456-426614174005",
        "productId": "550e8400-e29b-41d4-a716-446655440002",
        "productName": "iPhone Case",
        "quantity": 2,
        "unitPrice": 49.99,
        "currency": "USD"
      }
    ]
  }
}
```

---

### 3. GetOrders

Retrieves all orders.

**Method**: `orders.Orders/GetOrders`

#### Request
```json
{}
```

#### Response
```json
{
  "orders": [
    {
      "id": "789e4567-e89b-12d3-a456-426614174003",
      "customerId": "123e4567-e89b-12d3-a456-426614174000",
      "currency": "USD",
      "status": "Processing",
      "createdAt": "638380512000000000",
      "updatedAt": "638380515200000000",
      "totalAmount": 2099.96,
      "items": [
        {
          "id": "789e4567-e89b-12d3-a456-426614174004",
          "productId": "550e8400-e29b-41d4-a716-446655440001",
          "productName": "iPhone 15 Pro",
          "quantity": 2,
          "unitPrice": 999.99,
          "currency": "USD"
        }
      ]
    },
    {
      "id": "789e4567-e89b-12d3-a456-426614174006",
      "customerId": "123e4567-e89b-12d3-a456-426614174001",
      "currency": "EUR",
      "status": "Completed",
      "createdAt": "638380256000000000",
      "updatedAt": "638380819200000000",
      "totalAmount": 1499.99,
      "items": [
        {
          "id": "789e4567-e89b-12d3-a456-426614174007",
          "productId": "550e8400-e29b-41d4-a716-446655440003",
          "productName": "MacBook Pro",
          "quantity": 1,
          "unitPrice": 1499.99,
          "currency": "EUR"
        }
      ]
    }
  ]
}
```

---

### 4. AddItemToOrder

Adds a new item to an existing order.

**Method**: `orders.Orders/AddItemToOrder`

#### Request
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "item": {
    "productId": "550e8400-e29b-41d4-a716-446655440004",
    "productName": "AirPods Pro",
    "quantity": 1,
    "unitPrice": 249.99,
    "currency": "USD"
  }
}
```

#### Response
```json
{
  "order": {
    "id": "789e4567-e89b-12d3-a456-426614174003",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "currency": "USD",
    "status": "Processing",
    "createdAt": "638380512000000000",
    "updatedAt": "638380518400000000",
    "totalAmount": 2349.95,
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro",
        "quantity": 2,
        "unitPrice": 999.99,
        "currency": "USD"
      },
      {
        "id": "789e4567-e89b-12d3-a456-426614174005",
        "productId": "550e8400-e29b-41d4-a716-446655440002",
        "productName": "iPhone Case",
        "quantity": 2,
        "unitPrice": 49.99,
        "currency": "USD"
      },
      {
        "id": "789e4567-e89b-12d3-a456-426614174008",
        "productId": "550e8400-e29b-41d4-a716-446655440004",
        "productName": "AirPods Pro",
        "quantity": 1,
        "unitPrice": 249.99,
        "currency": "USD"
      }
    ]
  }
}
```

---

### 5. RemoveItemFromOrder

Removes an item from an existing order.

**Method**: `orders.Orders/RemoveItemFromOrder`

#### Request
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174005"
}
```

#### Response
```json
{
  "order": {
    "id": "789e4567-e89b-12d3-a456-426614174003",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "currency": "USD",
    "status": "Processing",
    "createdAt": "638380512000000000",
    "updatedAt": "638380521600000000",
    "totalAmount": 2249.97,
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro",
        "quantity": 2,
        "unitPrice": 999.99,
        "currency": "USD"
      },
      {
        "id": "789e4567-e89b-12d3-a456-426614174008",
        "productId": "550e8400-e29b-41d4-a716-446655440004",
        "productName": "AirPods Pro",
        "quantity": 1,
        "unitPrice": 249.99,
        "currency": "USD"
      }
    ]
  }
}
```

---

### 6. UpdateOrderItemQuantity

Updates the quantity of a specific item in an order.

**Method**: `orders.Orders/UpdateOrderItemQuantity`

#### Request
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174004",
  "quantity": 3
}
```

#### Response
```json
{
  "order": {
    "id": "789e4567-e89b-12d3-a456-426614174003",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "currency": "USD",
    "status": "Processing",
    "createdAt": "638380512000000000",
    "updatedAt": "638380524800000000",
    "totalAmount": 3249.96,
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro",
        "quantity": 3,
        "unitPrice": 999.99,
        "currency": "USD"
      },
      {
        "id": "789e4567-e89b-12d3-a456-426614174008",
        "productId": "550e8400-e29b-41d4-a716-446655440004",
        "productName": "AirPods Pro",
        "quantity": 1,
        "unitPrice": 249.99,
        "currency": "USD"
      }
    ]
  }
}
```

---

### 7. UpdateOrderStatus

Updates the status of an order.

**Method**: `orders.Orders/UpdateOrderStatus`

#### Request
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Shipped"
}
```

#### Response
```json
{
  "success": true
}
```

---

### 8. UpdateOrder

Updates an entire order with new information.

**Method**: `orders.Orders/UpdateOrder`

#### Request
```json
{
  "update": {
    "id": "789e4567-e89b-12d3-a456-426614174003",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "currency": "USD",
    "status": "Processing",
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro Max",
        "quantity": 1,
        "unitPrice": 1199.99,
        "currency": "USD"
      }
    ]
  }
}
```

#### Response
```json
{
  "order": {
    "id": "789e4567-e89b-12d3-a456-426614174003",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "currency": "USD",
    "status": "Processing",
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro Max",
        "quantity": 1,
        "unitPrice": 1199.99,
        "currency": "USD"
      }
    ]
  }
}
```

---

## Data Types

### Order
Represents a complete order with all its details.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the order (GUID format) |
| `customerId` | `string` | Unique identifier for the customer (GUID format) |
| `currency` | `string` | Currency code (e.g., "USD", "EUR") |
| `status` | `string` | Current order status ("Pending", "Processing", "Shipped", "Completed", "Cancelled") |
| `createdAt` | `int64` | Creation timestamp in .NET ticks |
| `updatedAt` | `int64` | Last update timestamp in .NET ticks |
| `totalAmount` | `double` | Total order amount calculated from items |
| `items` | `OrderItem[]` | Array of order items |

### OrderItem
Represents an individual item within an order.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the order item (GUID format) |
| `productId` | `string` | Unique identifier for the product (GUID format) |
| `productName` | `string` | Human-readable product name |
| `quantity` | `int32` | Number of units ordered |
| `unitPrice` | `double` | Price per unit |
| `currency` | `string` | Currency code for the price |

### CreateOrderItem
Represents an item to be added when creating an order.

| Field | Type | Description |
|-------|------|-------------|
| `productId` | `string` | Unique identifier for the product (GUID format) |
| `productName` | `string` | Human-readable product name |
| `quantity` | `int32` | Number of units to order |
| `unitPrice` | `double` | Price per unit |
| `currency` | `string` | Currency code for the price |

### OrderUpdate
Represents order data for update operations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the order (GUID format) |
| `customerId` | `string` | Unique identifier for the customer (GUID format) |
| `currency` | `string` | Currency code |
| `status` | `string` | Order status |
| `items` | `OrderItem[]` | Array of order items |

---

## Error Handling

gRPC errors are returned with appropriate status codes:

- `INVALID_ARGUMENT` (3): Invalid request parameters (e.g., invalid GUID format)
- `NOT_FOUND` (5): Order or item not found
- `ALREADY_EXISTS` (6): Attempting to create duplicate resources
- `FAILED_PRECONDITION` (9): Business rule violations (e.g., modifying completed order)
- `INTERNAL` (13): Internal server errors
- `UNAVAILABLE` (14): Service temporarily unavailable

Example error response:
```json
{
  "error": {
    "code": 5,
    "message": "Order with ID '789e4567-e89b-12d3-a456-426614174999' not found"
  }
}
```

---

## Usage Examples

### Using grpcurl

```bash
# Create Order
grpcurl -plaintext -d '{
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "currency": "USD",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "productName": "iPhone 15 Pro",
      "quantity": 1,
      "unitPrice": 999.99,
      "currency": "USD"
    }
  ]
}' localhost:5001 orders.Orders/CreateOrder

# Get Order
grpcurl -plaintext -d '{
  "orderId": "789e4567-e89b-12d3-a456-426614174003"
}' localhost:5001 orders.Orders/GetOrder

# Update Order Status
grpcurl -plaintext -d '{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Shipped"
}' localhost:5001 orders.Orders/UpdateOrderStatus
```

### Using .NET Client

```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

// Create order
var createRequest = new CreateOrderRequest
{
    CustomerId = "123e4567-e89b-12d3-a456-426614174000",
    Currency = "USD"
};
createRequest.Items.Add(new CreateOrderItem
{
    ProductId = "550e8400-e29b-41d4-a716-446655440001",
    ProductName = "iPhone 15 Pro",
    Quantity = 1,
    UnitPrice = 999.99,
    Currency = "USD"
});

var response = await client.CreateOrderAsync(createRequest);
```

---

## Notes

- All timestamps are represented as .NET ticks (100-nanosecond intervals since January 1, 0001 UTC)
- GUIDs are represented as strings in standard format (e.g., "123e4567-e89b-12d3-a456-426614174000")
- Currency codes should follow ISO 4217 standard
- Total amounts are calculated automatically based on item quantities and unit prices
- Order status transitions should follow business rules (implementation-dependent)
