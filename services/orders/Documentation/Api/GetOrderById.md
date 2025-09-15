# GetOrder Endpoint

## Overview
Retrieves a specific order by its unique identifier.

**Method**: `orders.Orders/GetOrderById`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message GetOrderRequest {
  string orderId = 1;
}
```

### JSON Example
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003"
}
```

### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | `string` | Yes | Unique identifier for the order (GUID format) |

---

## Response

### Schema
```protobuf
message GetOrderResponse {
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

## Business Rules

1. **Order Existence**: Order must exist in the system
2. **Access Control**: Users can only access orders they have permission to view
3. **Complete Data**: Returns complete order information including all items
4. **Real-time Data**: Returns current order status and information

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid GUID format | Order ID is not a valid GUID |
| `INVALID_ARGUMENT` | Empty order ID | Order ID cannot be empty or null |
| `NOT_FOUND` | Order not found | Order with specified ID does not exist |
| `PERMISSION_DENIED` | Access denied | User does not have permission to view this order |

---

## Usage Examples

### grpcurl
```bash
grpcurl -plaintext -d '{
  "orderId": "789e4567-e89b-12d3-a456-426614174003"
}' localhost:5001 orders.Orders/GetOrder
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new GetOrderRequest
{
    OrderId = "789e4567-e89b-12d3-a456-426614174003"
};

try
{
    var response = await client.GetOrderAsync(request);
    Console.WriteLine($"Order ID: {response.Order.Id}");
    Console.WriteLine($"Status: {response.Order.Status}");
    Console.WriteLine($"Total: {response.Order.TotalAmount:C}");
    Console.WriteLine($"Items: {response.Order.Items.Count}");
}
catch (RpcException ex) when (ex.StatusCode == StatusCode.NotFound)
{
    Console.WriteLine("Order not found");
}
```

### JavaScript Client
```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('orders.proto');
const ordersProto = grpc.loadPackageDefinition(packageDefinition).orders;

const client = new ordersProto.Orders('localhost:5001', grpc.credentials.createInsecure());

const request = {
  orderId: "789e4567-e89b-12d3-a456-426614174003"
};

client.GetOrder(request, (error, response) => {
  if (error) {
    if (error.code === grpc.status.NOT_FOUND) {
      console.log('Order not found');
    } else {
      console.error('Error:', error);
    }
  } else {
    console.log('Order:', response.order);
  }
});
```

### Python Client
```python
import grpc
import orders_pb2
import orders_pb2_grpc

channel = grpc.insecure_channel('localhost:5001')
stub = orders_pb2_grpc.OrdersStub(channel)

request = orders_pb2.GetOrderRequest(
    orderId="789e4567-e89b-12d3-a456-426614174003"
)

try:
    response = stub.GetOrder(request)
    print(f"Order ID: {response.order.id}")
    print(f"Status: {response.order.status}")
    print(f"Total: {response.order.totalAmount}")
except grpc.RpcError as e:
    if e.code() == grpc.StatusCode.NOT_FOUND:
        print("Order not found")
    else:
        print(f"Error: {e}")
```

---

## Response Field Details

### Order Fields
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique order identifier (GUID) |
| `customerId` | `string` | Customer who placed the order |
| `currency` | `string` | Order currency (ISO 4217) |
| `status` | `string` | Current order status |
| `createdAt` | `int64` | Order creation timestamp (.NET ticks) |
| `updatedAt` | `int64` | Last update timestamp (.NET ticks) |
| `totalAmount` | `double` | Total order value |
| `items` | `OrderItem[]` | List of order items |

### Order Status Values
- `Pending` - Order created, awaiting processing
- `Processing` - Order is being prepared
- `Shipped` - Order has been shipped
- `Delivered` - Order has been delivered
- `Completed` - Order is complete
- `Cancelled` - Order has been cancelled
- `Refunded` - Order has been refunded

---

## Performance Considerations

- **Caching**: Order data may be cached for performance
- **Response Size**: Large orders with many items may have significant response sizes
- **Real-time Updates**: Consider using streaming for real-time order updates
- **Rate Limiting**: API calls may be rate-limited per customer

---

## Security Notes

- Order IDs should not be sequential or predictable
- Implement proper authorization to prevent unauthorized access
- Consider data masking for sensitive information
- Log access attempts for audit purposes
