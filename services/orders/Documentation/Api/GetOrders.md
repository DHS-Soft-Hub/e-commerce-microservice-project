# GetOrders Endpoint

## Overview
Retrieves orders in the system with pagination support. This endpoint returns a paginated list of orders with complete information and pagination metadata.

**Method**: `orders.Orders/GetOrders`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message GetOrdersRequest {
  int32 pageNumber = 1;
  int32 pageSize = 2;
}
```

### JSON Example
```json
{
  "pageNumber": 1,
  "pageSize": 10
}
```

### Field Descriptions

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `pageNumber` | `int32` | No | Page number to retrieve (1-based) | 1 |
| `pageSize` | `int32` | No | Number of orders per page | 10 |

---

## Response

### Schema
```protobuf
message PaginatedOrdersResponse {
  repeated Order orders = 1;
  int32 totalCount = 2;
  int32 pageNumber = 3;
  int32 pageSize = 4;
  int32 totalPages = 5;
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
  ],
  "totalCount": 157,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 16
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
# Get first page with default page size
grpcurl -plaintext -d '{
  "pageNumber": 1,
  "pageSize": 10
}' localhost:5001 orders.Orders/GetOrders

# Get specific page with custom page size
grpcurl -plaintext -d '{
  "pageNumber": 2,
  "pageSize": 25
}' localhost:5001 orders.Orders/GetOrders
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new GetOrdersRequest
{
    PageNumber = 1,
    PageSize = 10
};

try
{
    var response = await client.GetOrdersAsync(request);
    
    Console.WriteLine($"Found {response.Orders.Count} orders on page {response.PageNumber}");
    Console.WriteLine($"Total orders: {response.TotalCount}");
    Console.WriteLine($"Total pages: {response.TotalPages}");
    
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

const request = {
  pageNumber: 1,
  pageSize: 10
};

client.GetOrders(request, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${response.orders.length} orders on page ${response.pageNumber}`);
    console.log(`Total orders: ${response.totalCount}`);
    console.log(`Total pages: ${response.totalPages}`);
    
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

request = orders_pb2.GetOrdersRequest(
    pageNumber=1,
    pageSize=10
)

try:
    response = stub.GetOrders(request)
    
    print(f"Found {len(response.orders)} orders on page {response.pageNumber}")
    print(f"Total orders: {response.totalCount}")
    print(f"Total pages: {response.totalPages}")
    
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

### PaginatedOrdersResponse
The response contains pagination metadata along with the orders array:

| Field | Type | Description |
|-------|------|-------------|
| `orders` | `Order[]` | Array of order objects for the current page |
| `totalCount` | `int32` | Total number of orders across all pages |
| `pageNumber` | `int32` | Current page number (1-based) |
| `pageSize` | `int32` | Number of items requested per page |
| `totalPages` | `int32` | Total number of pages available |

### Orders Array
Each order in the response contains the following structure:

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

- **Pagination**: This endpoint now supports pagination to handle large result sets efficiently
- **Page Size Limits**: Consider reasonable limits for page size (typically 1-100 items)
- **Sorting**: Results are typically sorted by creation date (newest first)
- **Caching**: Pagination metadata may be cached for performance
- **Rate Limiting**: API calls may be rate-limited

### Pagination Best Practices

1. **Default Values**: Use reasonable defaults (page 1, size 10-25)
2. **Maximum Page Size**: Enforce maximum page size limits (e.g., 100)
3. **Total Count**: Use `totalCount` to determine available data
4. **Navigation**: Calculate page boundaries using `totalPages`

### Example Pagination Logic
```csharp
// Navigate through all pages
var currentPage = 1;
var pageSize = 25;
PaginatedOrdersResponse response;

do
{
    var request = new GetOrdersRequest 
    { 
        PageNumber = currentPage, 
        PageSize = pageSize 
    };
    
    response = await client.GetOrdersAsync(request);
    
    // Process current page orders
    foreach (var order in response.Orders)
    {
        // Process order
    }
    
    currentPage++;
    
} while (currentPage <= response.TotalPages);
```

---

## Security Notes

- Implement proper authorization to prevent unauthorized access
- Consider data masking for sensitive information
- Log access attempts for audit purposes
- Limit page size to prevent abuse
- Consider implementing customer-specific filtering automatically
- Validate pagination parameters to prevent injection attacks

---

## Related Endpoints

- **GetOrdersByCustomerId**: Get orders for a specific customer with pagination
- **GetOrderById**: Get a single order by its ID
- **CreateOrder**: Create a new order
