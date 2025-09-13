# CreateOrder Endpoint

## Overview
Creates a new order with the specified items.

**Method**: `orders.Orders/CreateOrder`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message CreateOrderRequest {
  string customerId = 1;
  string currency = 2;
  repeated CreateOrderItem items = 3;
}

message CreateOrderItem {
  string productId = 1;
  string productName = 2;
  int32 quantity = 3;
  double unitPrice = 4;
  string currency = 5;
}
```

### JSON Example
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

### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerId` | `string` | Yes | Unique identifier for the customer (GUID format) |
| `currency` | `string` | Yes | Currency code (e.g., "USD", "EUR") |
| `items` | `CreateOrderItem[]` | Yes | Array of items to include in the order |

#### CreateOrderItem Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | `string` | Yes | Unique identifier for the product (GUID format) |
| `productName` | `string` | Yes | Human-readable product name |
| `quantity` | `int32` | Yes | Number of units to order (must be > 0) |
| `unitPrice` | `double` | Yes | Price per unit (must be > 0) |
| `currency` | `string` | Yes | Currency code for the price |

---

## Response

### Schema
```protobuf
message CreateOrderResponse {
  Order order = 1;
}

message Order {
  string id = 1;
  string customerId = 2;
  repeated OrderItem items = 3;
  string currency = 4;
  string status = 5;
  int64 createdAt = 6;
  int64 updatedAt = 7;
  double totalAmount = 8;
}
```

### JSON Example
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

## Business Rules

1. **Customer Validation**: Customer ID must exist in the system
2. **Currency Consistency**: All items in an order should use the same currency as the order
3. **Product Validation**: All product IDs must exist and be available
4. **Quantity Limits**: Quantity must be positive and within stock limits
5. **Initial Status**: New orders are created with "Pending" status
6. **Total Calculation**: Total amount is automatically calculated from items

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid GUID format | Customer ID or Product ID is not a valid GUID |
| `INVALID_ARGUMENT` | Empty items array | Order must contain at least one item |
| `INVALID_ARGUMENT` | Invalid quantity | Quantity must be greater than 0 |
| `INVALID_ARGUMENT` | Invalid price | Unit price must be greater than 0 |
| `NOT_FOUND` | Customer not found | Customer ID does not exist |
| `NOT_FOUND` | Product not found | One or more product IDs do not exist |
| `FAILED_PRECONDITION` | Insufficient stock | Not enough stock for requested quantity |
| `FAILED_PRECONDITION` | Product unavailable | Product is discontinued or not available |

---

## Usage Examples

### grpcurl
```bash
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
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new CreateOrderRequest
{
    CustomerId = "123e4567-e89b-12d3-a456-426614174000",
    Currency = "USD"
};

request.Items.Add(new CreateOrderItem
{
    ProductId = "550e8400-e29b-41d4-a716-446655440001",
    ProductName = "iPhone 15 Pro",
    Quantity = 1,
    UnitPrice = 999.99,
    Currency = "USD"
});

var response = await client.CreateOrderAsync(request);
Console.WriteLine($"Created order: {response.Order.Id}");
```

### JavaScript Client
```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('orders.proto');
const ordersProto = grpc.loadPackageDefinition(packageDefinition).orders;

const client = new ordersProto.Orders('localhost:5001', grpc.credentials.createInsecure());

const request = {
  customerId: "123e4567-e89b-12d3-a456-426614174000",
  currency: "USD",
  items: [
    {
      productId: "550e8400-e29b-41d4-a716-446655440001",
      productName: "iPhone 15 Pro",
      quantity: 1,
      unitPrice: 999.99,
      currency: "USD"
    }
  ]
};

client.CreateOrder(request, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Created order:', response.order.id);
  }
});
```

---

## Notes

- The order is created with an automatically generated unique ID
- Initial order status is always "Pending"
- Total amount is calculated server-side from item quantities and prices
- All timestamps are in .NET ticks format
- Currency validation follows ISO 4217 standards
