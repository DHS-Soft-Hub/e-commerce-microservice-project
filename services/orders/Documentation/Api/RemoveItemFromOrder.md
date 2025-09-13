# RemoveItemFromOrder Endpoint

## Overview
Removes a specific item from an existing order. This endpoint allows modification of orders by removing unwanted products.

**Method**: `orders.Orders/RemoveItemFromOrder`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message RemoveItemFromOrderRequest {
  string orderId = 1;
  string itemId = 2;
}
```

### JSON Example
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174005"
}
```

### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | `string` | Yes | Unique identifier for the order (GUID format) |
| `itemId` | `string` | Yes | Unique identifier for the order item to remove (GUID format) |

---

## Response

### Schema
```protobuf
message RemoveItemFromOrderResponse {
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

## Business Rules

1. **Order Existence**: Order must exist and be in a modifiable state
2. **Order Status**: Only orders with status "Pending" or "Processing" can be modified
3. **Item Existence**: Item must exist in the specified order
4. **Minimum Items**: Order must have at least one item remaining after removal
5. **Total Recalculation**: Order total is automatically recalculated
6. **Inventory Update**: Removed items may be returned to available inventory

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid GUID format | Order ID or Item ID is not a valid GUID |
| `INVALID_ARGUMENT` | Empty parameters | Order ID or Item ID cannot be empty |
| `NOT_FOUND` | Order not found | Order with specified ID does not exist |
| `NOT_FOUND` | Item not found | Item with specified ID does not exist in the order |
| `FAILED_PRECONDITION` | Order not modifiable | Order status does not allow modifications |
| `FAILED_PRECONDITION` | Last item removal | Cannot remove the last item from an order |
| `PERMISSION_DENIED` | Access denied | User does not have permission to modify this order |

---

## Usage Examples

### grpcurl
```bash
grpcurl -plaintext -d '{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174005"
}' localhost:5001 orders.Orders/RemoveItemFromOrder
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new RemoveItemFromOrderRequest
{
    OrderId = "789e4567-e89b-12d3-a456-426614174003",
    ItemId = "789e4567-e89b-12d3-a456-426614174005"
};

try
{
    var response = await client.RemoveItemFromOrderAsync(request);
    Console.WriteLine($"Item removed. New total: {response.Order.TotalAmount:C}");
    Console.WriteLine($"Order now has {response.Order.Items.Count} items");
    
    // Display remaining items
    foreach (var item in response.Order.Items)
    {
        Console.WriteLine($"- {item.ProductName} (Qty: {item.Quantity})");
    }
}
catch (RpcException ex) when (ex.StatusCode == StatusCode.FailedPrecondition)
{
    Console.WriteLine("Cannot modify order or remove last item");
}
catch (RpcException ex) when (ex.StatusCode == StatusCode.NotFound)
{
    Console.WriteLine("Order or item not found");
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
  orderId: "789e4567-e89b-12d3-a456-426614174003",
  itemId: "789e4567-e89b-12d3-a456-426614174005"
};

client.RemoveItemFromOrder(request, (error, response) => {
  if (error) {
    if (error.code === grpc.status.FAILED_PRECONDITION) {
      console.log('Cannot remove item - check order status or item count');
    } else {
      console.error('Error:', error.details);
    }
  } else {
    console.log('Item removed successfully');
    console.log('New total:', response.order.totalAmount);
    console.log('Remaining items:', response.order.items.length);
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

request = orders_pb2.RemoveItemFromOrderRequest(
    orderId="789e4567-e89b-12d3-a456-426614174003",
    itemId="789e4567-e89b-12d3-a456-426614174005"
)

try:
    response = stub.RemoveItemFromOrder(request)
    print(f"Item removed. New total: ${response.order.totalAmount:.2f}")
    print(f"Order now has {len(response.order.items)} items")
    
    for item in response.order.items:
        print(f"- {item.productName} (Qty: {item.quantity})")
        
except grpc.RpcError as e:
    if e.code() == grpc.StatusCode.FAILED_PRECONDITION:
        print("Cannot remove item - check order status or item count")
    elif e.code() == grpc.StatusCode.NOT_FOUND:
        print("Order or item not found")
    else:
        print(f"Error: {e}")
```

---

## Behavior Details

### Item Removal Process
1. **Validation**: Verify order and item exist
2. **Permission Check**: Ensure user can modify order
3. **Status Check**: Verify order is in modifiable state
4. **Item Count Check**: Ensure order won't be empty after removal
5. **Removal**: Remove item from order
6. **Recalculation**: Update order total
7. **Inventory Update**: Return item to available stock (if applicable)
8. **Timestamp Update**: Update order's `updatedAt` timestamp

### Minimum Item Requirement
Orders must always contain at least one item:
- Attempting to remove the last item results in `FAILED_PRECONDITION` error
- Consider using order cancellation instead for empty orders

### Inventory Implications
When an item is removed:
- Reserved inventory may be released back to available stock
- Inventory management system should be notified
- Consider implementing compensation patterns for complex scenarios

---

## State Changes

### Order Fields Updated
- `updatedAt`: Set to current timestamp
- `totalAmount`: Recalculated from remaining items
- `items`: Specified item removed from collection

### Related System Updates
- Inventory levels may be updated
- Order audit log entries created
- Customer notifications may be triggered

---

## Alternative Approaches

### Quantity-Based Removal
Instead of removing entire items, consider:
```protobuf
message ReduceItemQuantityRequest {
  string orderId = 1;
  string itemId = 2;
  int32 quantityToRemove = 3;
}
```

### Soft Delete Pattern
For audit purposes, consider soft deletion:
```protobuf
message OrderItem {
  string id = 1;
  string productId = 2;
  string productName = 3;
  int32 quantity = 4;
  double unitPrice = 5;
  string currency = 6;
  bool isDeleted = 7;        // Soft delete flag
  int64 deletedAt = 8;       // Deletion timestamp
}
```

---

## Integration Considerations

### Event Publishing
Consider publishing events when items are removed:
```json
{
  "eventType": "OrderItemRemoved",
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174005",
  "productId": "550e8400-e29b-41d4-a716-446655440002",
  "quantity": 2,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Workflow Integration
- May trigger inventory management workflows
- Could affect shipping calculations
- May require customer notifications
- Could impact pricing/discount calculations

---

## Security Notes

- Validate user permissions before allowing modifications
- Log all removal operations for audit purposes
- Consider rate limiting to prevent abuse
- Implement proper authorization checks

---

## Related Endpoints

- `AddItemToOrder`: Add new items to order
- `UpdateOrderItemQuantity`: Modify item quantities
- `GetOrder`: View current order details
- `UpdateOrderStatus`: Change order status
