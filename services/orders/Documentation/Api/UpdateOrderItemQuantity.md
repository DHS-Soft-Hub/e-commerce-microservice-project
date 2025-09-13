# UpdateOrderItemQuantity Endpoint

## Overview
Updates the quantity of a specific item in an existing order. This endpoint allows fine-grained modification of order items.

**Method**: `orders.Orders/UpdateOrderItemQuantity`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message UpdateOrderItemQuantityRequest {
  string orderId = 1;
  string itemId = 2;
  int32 quantity = 3;
}
```

### JSON Example
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174004",
  "quantity": 3
}
```

### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | `string` | Yes | Unique identifier for the order (GUID format) |
| `itemId` | `string` | Yes | Unique identifier for the order item (GUID format) |
| `quantity` | `int32` | Yes | New quantity for the item (must be > 0) |

---

## Response

### Schema
```protobuf
message UpdateOrderItemQuantityResponse {
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

## Business Rules

1. **Order Existence**: Order must exist and be in a modifiable state
2. **Order Status**: Only orders with status "Pending" or "Processing" can be modified
3. **Item Existence**: Item must exist in the specified order
4. **Positive Quantity**: New quantity must be greater than 0
5. **Stock Validation**: Sufficient stock must be available for increased quantities
6. **Total Recalculation**: Order total is automatically recalculated
7. **Inventory Update**: Inventory levels are adjusted based on quantity changes

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid GUID format | Order ID or Item ID is not a valid GUID |
| `INVALID_ARGUMENT` | Invalid quantity | Quantity must be greater than 0 |
| `INVALID_ARGUMENT` | Empty parameters | Required parameters cannot be empty |
| `NOT_FOUND` | Order not found | Order with specified ID does not exist |
| `NOT_FOUND` | Item not found | Item with specified ID does not exist in the order |
| `FAILED_PRECONDITION` | Order not modifiable | Order status does not allow modifications |
| `FAILED_PRECONDITION` | Insufficient stock | Not enough stock for requested quantity |
| `PERMISSION_DENIED` | Access denied | User does not have permission to modify this order |

---

## Usage Examples

### grpcurl
```bash
grpcurl -plaintext -d '{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174004",
  "quantity": 3
}' localhost:5001 orders.Orders/UpdateOrderItemQuantity
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new UpdateOrderItemQuantityRequest
{
    OrderId = "789e4567-e89b-12d3-a456-426614174003",
    ItemId = "789e4567-e89b-12d3-a456-426614174004",
    Quantity = 3
};

try
{
    var response = await client.UpdateOrderItemQuantityAsync(request);
    
    // Find the updated item
    var updatedItem = response.Order.Items
        .FirstOrDefault(i => i.Id == request.ItemId);
    
    if (updatedItem != null)
    {
        Console.WriteLine($"Updated {updatedItem.ProductName}:");
        Console.WriteLine($"  New quantity: {updatedItem.Quantity}");
        Console.WriteLine($"  Item total: {updatedItem.Quantity * updatedItem.UnitPrice:C}");
    }
    
    Console.WriteLine($"Order total: {response.Order.TotalAmount:C}");
}
catch (RpcException ex) when (ex.StatusCode == StatusCode.FailedPrecondition)
{
    Console.WriteLine("Cannot update quantity - check order status or stock availability");
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
  itemId: "789e4567-e89b-12d3-a456-426614174004",
  quantity: 3
};

client.UpdateOrderItemQuantity(request, (error, response) => {
  if (error) {
    if (error.code === grpc.status.FAILED_PRECONDITION) {
      console.log('Cannot update quantity - check constraints');
    } else {
      console.error('Error:', error.details);
    }
  } else {
    console.log('Quantity updated successfully');
    console.log('New order total:', response.order.totalAmount);
    
    // Show updated item
    const updatedItem = response.order.items.find(item => item.id === request.itemId);
    if (updatedItem) {
      console.log(`${updatedItem.productName}: ${updatedItem.quantity} units`);
    }
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

request = orders_pb2.UpdateOrderItemQuantityRequest(
    orderId="789e4567-e89b-12d3-a456-426614174003",
    itemId="789e4567-e89b-12d3-a456-426614174004",
    quantity=3
)

try:
    response = stub.UpdateOrderItemQuantity(request)
    
    # Find updated item
    updated_item = next(
        (item for item in response.order.items if item.id == request.itemId), 
        None
    )
    
    if updated_item:
        print(f"Updated {updated_item.productName}:")
        print(f"  New quantity: {updated_item.quantity}")
        print(f"  Item total: ${updated_item.quantity * updated_item.unitPrice:.2f}")
    
    print(f"Order total: ${response.order.totalAmount:.2f}")
    
except grpc.RpcError as e:
    if e.code() == grpc.StatusCode.FAILED_PRECONDITION:
        print("Cannot update quantity - check constraints")
    elif e.code() == grpc.StatusCode.NOT_FOUND:
        print("Order or item not found")
    else:
        print(f"Error: {e}")
```

---

## Behavior Details

### Quantity Change Processing
1. **Validation**: Verify order and item exist
2. **Permission Check**: Ensure user can modify order
3. **Status Check**: Verify order is in modifiable state
4. **Stock Check**: Verify availability for increased quantities
5. **Update**: Change item quantity
6. **Inventory Adjustment**: Update reserved/available inventory
7. **Recalculation**: Update order total
8. **Timestamp Update**: Update order's `updatedAt` timestamp

### Stock Management
- **Increase**: Check available inventory before allowing increase
- **Decrease**: Released inventory back to available stock
- **Real-time**: Stock checks are performed in real-time

### Total Calculation
Order total is recalculated automatically:
```
newTotal = sum(item.quantity * item.unitPrice for item in order.items)
```

---

## Quantity Change Scenarios

### Increasing Quantity
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174004",
  "quantity": 5  // Increased from 3 to 5
}
```
- Requires additional inventory
- Increases order total
- May trigger inventory reservation

### Decreasing Quantity
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174004",
  "quantity": 1  // Decreased from 3 to 1
}
```
- Releases inventory back to stock
- Decreases order total
- May trigger inventory release events

---

## State Changes

### Order Fields Updated
- `updatedAt`: Set to current timestamp
- `totalAmount`: Recalculated from all items

### Item Fields Updated
- `quantity`: Updated to new value
- Item-level timestamp (if tracked)

### Inventory Impact
- Stock levels adjusted based on quantity change
- Reservations updated accordingly

---

## Alternative Approaches

### Relative Quantity Updates
```protobuf
message AdjustOrderItemQuantityRequest {
  string orderId = 1;
  string itemId = 2;
  int32 quantityChange = 3;  // +2 or -1, etc.
}
```

### Batch Quantity Updates
```protobuf
message UpdateMultipleItemQuantitiesRequest {
  string orderId = 1;
  repeated ItemQuantityUpdate updates = 2;
}

message ItemQuantityUpdate {
  string itemId = 1;
  int32 quantity = 2;
}
```

---

## Integration Considerations

### Event Publishing
Consider publishing events when quantities change:
```json
{
  "eventType": "OrderItemQuantityUpdated",
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "itemId": "789e4567-e89b-12d3-a456-426614174004",
  "oldQuantity": 2,
  "newQuantity": 3,
  "productId": "550e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Workflow Integration
- Inventory management system updates
- Shipping cost recalculation
- Customer notifications
- Pricing/discount recalculation

### Concurrency Handling
- Implement optimistic locking for concurrent updates
- Consider eventual consistency for inventory updates
- Handle race conditions in stock checking

---

## Performance Considerations

- **Stock Checks**: Real-time inventory validation may impact performance
- **Caching**: Consider caching inventory levels with appropriate TTL
- **Batching**: For multiple updates, consider batch operations
- **Events**: Asynchronous event publishing for better performance

---

## Related Endpoints

- `AddItemToOrder`: Add new items to order
- `RemoveItemFromOrder`: Remove items from order
- `GetOrder`: View current order details
- `UpdateOrderStatus`: Change order status
