# GetOrders Endpoint

## Overview
Retrieves all orders in the system. This endpoint returns a list of all orders with their complete information.

**Method**: `orders.Orders/GetOrders`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message GetOrdersRequest {}
```

### JSON Example
```json
{}
```

### Field Descriptions
This endpoint does not require any parameters. It returns all orders visible to the requesting user.

---

## Response

### Schema
```protobuf
message GetOrdersResponse {
  repeated Order orders = 1;
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

## Business Rules

1. **Access Control**: Users see only orders they have permission to view
2. **Complete Data**: Returns complete order information including all items
3. **Ordering**: Orders are typically returned sorted by creation date (newest first)
4. **Real-time Data**: Returns current order status and information

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `PERMISSION_DENIED` | Access denied | User does not have permission to view orders |
| `INTERNAL` | Database error | Internal error retrieving orders |
| `UNAVAILABLE` | Service unavailable | Orders service is temporarily unavailable |

---

## Usage Examples

### grpcurl
```bash
grpcurl -plaintext -d '{}' localhost:5001 orders.Orders/GetOrders
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new GetOrdersRequest();

try
{
    var response = await client.GetOrdersAsync(request);
    
    Console.WriteLine($"Found {response.Orders.Count} orders");
    
    foreach (var order in response.Orders)
    {
        Console.WriteLine($"Order {order.Id}:");
        Console.WriteLine($"  Customer: {order.CustomerId}");
        Console.WriteLine($"  Status: {order.Status}");
        Console.WriteLine($"  Total: {order.TotalAmount:C}");
        Console.WriteLine($"  Items: {order.Items.Count}");
        Console.WriteLine();
    }
}
catch (RpcException ex)
{
    Console.WriteLine($"Error: {ex.Status}");
}
```

### JavaScript Client
```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('orders.proto');
const ordersProto = grpc.loadPackageDefinition(packageDefinition).orders;

const client = new ordersProto.Orders('localhost:5001', grpc.credentials.createInsecure());

const request = {};

client.GetOrders(request, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${response.orders.length} orders`);
    response.orders.forEach(order => {
      console.log(`Order ${order.id}: ${order.status} - $${order.totalAmount}`);
    });
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

request = orders_pb2.GetOrdersRequest()

try:
    response = stub.GetOrders(request)
    
    print(f"Found {len(response.orders)} orders")
    
    for order in response.orders:
        print(f"Order {order.id}:")
        print(f"  Customer: {order.customerId}")
        print(f"  Status: {order.status}")
        print(f"  Total: ${order.totalAmount:.2f}")
        print(f"  Items: {len(order.items)}")
        print()
        
except grpc.RpcError as e:
    print(f"Error: {e}")
```

---

## Response Field Details

### Orders Array
The response contains an array of Order objects, each with the following structure:

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

---

## Performance Considerations

- **Large Result Sets**: This endpoint may return large amounts of data
- **Pagination**: Consider implementing pagination for better performance
- **Filtering**: Future versions may include filtering options
- **Caching**: Results may be cached for performance
- **Rate Limiting**: API calls may be rate-limited

### Recommended Improvements
For production systems, consider implementing:

```protobuf
message GetOrdersRequest {
  int32 page = 1;           // Page number (1-based)
  int32 pageSize = 2;       // Items per page
  string status = 3;        // Filter by status
  string customerId = 4;    // Filter by customer
  int64 fromDate = 5;       // Filter from date
  int64 toDate = 6;         // Filter to date
}

message GetOrdersResponse {
  repeated Order orders = 1;
  int32 totalCount = 2;     // Total number of orders
  int32 page = 3;           // Current page
  int32 pageSize = 4;       // Items per page
  bool hasNext = 5;         // More pages available
}
```

---

## Security Notes

- Implement proper authorization to prevent unauthorized access
- Consider data masking for sensitive information
- Log access attempts for audit purposes
- Limit result set size to prevent abuse
- Consider implementing customer-specific filtering automatically

---

## Alternative Approaches

For better performance and user experience, consider:

1. **Customer-Specific Endpoint**: `/GetOrdersByCustomer`
2. **Paginated Endpoint**: With page and limit parameters
3. **Streaming Response**: For real-time order updates
4. **Filtered Endpoints**: By status, date range, etc.

Example streaming approach:
```protobuf
rpc GetOrdersStream(GetOrdersRequest) returns (stream Order);
```
