# GetOrdersByCustomerId Endpoint

## Overview
Retrieves all orders for a specific customer with pagination support. This endpoint returns a paginated list of orders belonging to the specified customer with complete information and pagination metadata.

**Method**: `orders.Orders/GetOrdersByCustomerId`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message GetOrdersByCustomerIdRequest {
  string customerId = 1;
  int32 pageNumber = 2;
  int32 pageSize = 3;
}
```

### JSON Example
```json
{
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "pageNumber": 1,
  "pageSize": 10
}
```

### Field Descriptions

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `customerId` | `string` | Yes | Unique identifier for the customer (GUID format) | - |
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
      "id": "789e4567-e89b-12d3-a456-426614174009",
      "customerId": "123e4567-e89b-12d3-a456-426614174000",
      "currency": "USD",
      "status": "Shipped",
      "createdAt": "638379875200000000",
      "updatedAt": "638380100000000000",
      "totalAmount": 49.99,
      "items": [
        {
          "id": "789e4567-e89b-12d3-a456-426614174010",
          "productId": "550e8400-e29b-41d4-a716-446655440005",
          "productName": "USB Cable",
          "quantity": 1,
          "unitPrice": 49.99,
          "currency": "USD"
        }
      ]
    }
  ],
  "totalCount": 12,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 2
}
```

---

## Business Rules

1. **Customer Filtering**: Only returns orders belonging to the specified customer
2. **Access Control**: Users should only access orders for customers they have permission to view
3. **Complete Data**: Returns complete order information including all items
4. **Ordering**: Orders are typically returned sorted by creation date (newest first)
5. **Real-time Data**: Returns current order status and information

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid customer ID | Customer ID is not in valid GUID format |
| `INVALID_ARGUMENT` | Invalid pagination | Page number or page size is invalid |
| `NOT_FOUND` | Customer not found | Customer with specified ID does not exist |
| `PERMISSION_DENIED` | Access denied | User does not have permission to view orders for this customer |
| `INTERNAL` | Database error | Internal error retrieving orders |
| `UNAVAILABLE` | Service unavailable | Orders service is temporarily unavailable |

---

## Usage Examples

### grpcurl
```bash
# Get first page with default page size
grpcurl -plaintext -d '{
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "pageNumber": 1,
  "pageSize": 10
}' localhost:5001 orders.Orders/GetOrdersByCustomerId

# Get specific page with custom page size
grpcurl -plaintext -d '{
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "pageNumber": 2,
  "pageSize": 5
}' localhost:5001 orders.Orders/GetOrdersByCustomerId
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new GetOrdersByCustomerIdRequest
{
    CustomerId = "123e4567-e89b-12d3-a456-426614174000",
    PageNumber = 1,
    PageSize = 10
};

try
{
    var response = await client.GetOrdersByCustomerIdAsync(request);
    
    Console.WriteLine($"Found {response.Orders.Count} orders on page {response.PageNumber} for customer {request.CustomerId}");
    Console.WriteLine($"Total orders for customer: {response.TotalCount}");
    Console.WriteLine($"Total pages: {response.TotalPages}");
    
    foreach (var order in response.Orders)
    {
        Console.WriteLine($"Order {order.Id}:");
        Console.WriteLine($"  Status: {order.Status}");
        Console.WriteLine($"  Total: {order.TotalAmount:C}");
        Console.WriteLine($"  Items: {order.Items.Count}");
        Console.WriteLine($"  Created: {new DateTime(order.CreatedAt)}");
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
  customerId: "123e4567-e89b-12d3-a456-426614174000",
  pageNumber: 1,
  pageSize: 10
};

client.GetOrdersByCustomerId(request, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${response.orders.length} orders on page ${response.pageNumber} for customer ${request.customerId}`);
    console.log(`Total orders for customer: ${response.totalCount}`);
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

request = orders_pb2.GetOrdersByCustomerIdRequest(
    customerId="123e4567-e89b-12d3-a456-426614174000",
    pageNumber=1,
    pageSize=10
)

try:
    response = stub.GetOrdersByCustomerId(request)
    
    print(f"Found {len(response.orders)} orders on page {response.pageNumber} for customer {request.customerId}")
    print(f"Total orders for customer: {response.totalCount}")
    print(f"Total pages: {response.totalPages}")
    
    for order in response.orders:
        print(f"Order {order.id}:")
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
| `orders` | `Order[]` | Array of order objects for the current page belonging to the specified customer |
| `totalCount` | `int32` | Total number of orders for this customer across all pages |
| `pageNumber` | `int32` | Current page number (1-based) |
| `pageSize` | `int32` | Number of items requested per page |
| `totalPages` | `int32` | Total number of pages available for this customer |

### Orders Array
Each order in the response contains the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique order identifier (GUID) |
| `customerId` | `string` | Customer who placed the order (matches request parameter) |
| `currency` | `string` | Order currency (ISO 4217) |
| `status` | `string` | Current order status |
| `createdAt` | `int64` | Order creation timestamp (.NET ticks) |
| `updatedAt` | `int64` | Last update timestamp (.NET ticks) |
| `totalAmount` | `double` | Total order value |
| `items` | `OrderItem[]` | List of order items |

---

## Performance Considerations

- **Customer Filtering**: Efficient querying by customer ID with proper indexing
- **Pagination**: Handles large customer order histories efficiently
- **Page Size Limits**: Consider reasonable limits for page size (typically 1-100 items)
- **Sorting**: Results are typically sorted by creation date (newest first)
- **Caching**: Customer-specific pagination metadata may be cached
- **Rate Limiting**: API calls may be rate-limited per customer

### Pagination Best Practices

1. **Default Values**: Use reasonable defaults (page 1, size 10-25)
2. **Maximum Page Size**: Enforce maximum page size limits (e.g., 100)
3. **Customer Context**: Total count reflects only orders for the specified customer
4. **Index Optimization**: Ensure database indexes on customer_id and created_at

### Example Customer Order History Navigation
```csharp
// Get complete order history for a customer
var customerId = "123e4567-e89b-12d3-a456-426614174000";
var currentPage = 1;
var pageSize = 20;
var allOrders = new List<Order>();

PaginatedOrdersResponse response;

do
{
    var request = new GetOrdersByCustomerIdRequest 
    { 
        CustomerId = customerId,
        PageNumber = currentPage, 
        PageSize = pageSize 
    };
    
    response = await client.GetOrdersByCustomerIdAsync(request);
    allOrders.AddRange(response.Orders);
    
    currentPage++;
    
} while (currentPage <= response.TotalPages);

Console.WriteLine($"Customer {customerId} has {allOrders.Count} total orders");
```

---

## Security Notes

- **Customer Authorization**: Verify user has permission to access the specified customer's orders
- **Input Validation**: Validate customer ID format (GUID) and pagination parameters
- **Data Masking**: Consider masking sensitive information based on user permissions
- **Audit Logging**: Log customer data access for compliance purposes
- **Rate Limiting**: Implement per-customer rate limiting to prevent abuse
- **SQL Injection**: Use parameterized queries to prevent injection attacks

---

## Common Use Cases

1. **Customer Portal**: Display order history to logged-in customers
2. **Customer Service**: Support agents viewing customer order history
3. **Analytics**: Analyzing customer purchasing patterns
4. **Reporting**: Generating customer-specific order reports
5. **Mobile Apps**: Showing recent orders with pagination for performance

---

## Related Endpoints

- **GetOrders**: Get all orders (system-wide) with pagination
- **GetOrderById**: Get a single order by its ID
- **CreateOrder**: Create a new order for a customer
- **UpdateOrderStatus**: Update the status of a specific order

---

## Optimization Recommendations

### Database Indexing
```sql
-- Recommended indexes for optimal performance
CREATE INDEX IX_Orders_CustomerId_CreatedAt ON Orders (CustomerId, CreatedAt DESC);
CREATE INDEX IX_Orders_CustomerId_Status ON Orders (CustomerId, Status);
```

### Caching Strategy
```csharp
// Example caching key structure
var cacheKey = $"customer_orders:{customerId}:page:{pageNumber}:size:{pageSize}";
var cachedResult = await cache.GetAsync<PaginatedOrdersResponse>(cacheKey);

if (cachedResult == null)
{
    cachedResult = await orderService.GetOrdersByCustomerIdAsync(customerId, pageNumber, pageSize);
    await cache.SetAsync(cacheKey, cachedResult, TimeSpan.FromMinutes(5));
}
```
