# AddItemToOrder Endpoint

## Overview
Adds a new item to an existing order. This endpoint allows modification of orders by adding additional products.

**Method**: `orders.Orders/AddItemToOrder`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message AddItemToOrderRequest {
  string orderId = 1;
  CreateOrderItem item = 2;
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

### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | `string` | Yes | Unique identifier for the order (GUID format) |
| `item` | `CreateOrderItem` | Yes | Item to add to the order |

#### CreateOrderItem Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | `string` | Yes | Unique identifier for the product (GUID format) |
| `productName` | `string` | Yes | Human-readable product name |
| `quantity` | `int32` | Yes | Number of units to add (must be > 0) |
| `unitPrice` | `double` | Yes | Price per unit (must be > 0) |
| `currency` | `string` | Yes | Currency code for the price |

---

## Response

### Schema
```protobuf
message AddItemToOrderResponse {
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

## Business Rules

1. **Order Existence**: Order must exist and be in a modifiable state
2. **Order Status**: Only orders with status "Pending" or "Processing" can be modified
3. **Product Validation**: Product must exist and be available
4. **Currency Consistency**: Item currency must match order currency
5. **Duplicate Prevention**: Adding existing product will increase quantity instead of creating duplicate
6. **Stock Validation**: Sufficient stock must be available
7. **Total Recalculation**: Order total is automatically recalculated

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid GUID format | Order ID or Product ID is not a valid GUID |
| `INVALID_ARGUMENT` | Invalid quantity | Quantity must be greater than 0 |
| `INVALID_ARGUMENT` | Invalid price | Unit price must be greater than 0 |
| `INVALID_ARGUMENT` | Currency mismatch | Item currency does not match order currency |
| `NOT_FOUND` | Order not found | Order with specified ID does not exist |
| `NOT_FOUND` | Product not found | Product ID does not exist |
| `FAILED_PRECONDITION` | Order not modifiable | Order status does not allow modifications |
| `FAILED_PRECONDITION` | Insufficient stock | Not enough stock for requested quantity |
| `PERMISSION_DENIED` | Access denied | User does not have permission to modify this order |

---

## Usage Examples

### grpcurl
```bash
grpcurl -plaintext -d '{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "item": {
    "productId": "550e8400-e29b-41d4-a716-446655440004",
    "productName": "AirPods Pro",
    "quantity": 1,
    "unitPrice": 249.99,
    "currency": "USD"
  }
}' localhost:5001 orders.Orders/AddItemToOrder
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new AddItemToOrderRequest
{
    OrderId = "789e4567-e89b-12d3-a456-426614174003",
    Item = new CreateOrderItem
    {
        ProductId = "550e8400-e29b-41d4-a716-446655440004",
        ProductName = "AirPods Pro",
        Quantity = 1,
        UnitPrice = 249.99,
        Currency = "USD"
    }
};

try
{
    var response = await client.AddItemToOrderAsync(request);
    Console.WriteLine($"Item added. New total: {response.Order.TotalAmount:C}");
    Console.WriteLine($"Order now has {response.Order.Items.Count} items");
}
catch (RpcException ex) when (ex.StatusCode == StatusCode.FailedPrecondition)
{
    Console.WriteLine("Cannot modify order in current status");
}
catch (RpcException ex) when (ex.StatusCode == StatusCode.NotFound)
{
    Console.WriteLine("Order or product not found");
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
  item: {
    productId: "550e8400-e29b-41d4-a716-446655440004",
    productName: "AirPods Pro",
    quantity: 1,
    unitPrice: 249.99,
    currency: "USD"
  }
};

client.AddItemToOrder(request, (error, response) => {
  if (error) {
    console.error('Error:', error.details);
  } else {
    console.log('Item added successfully');
    console.log('New total:', response.order.totalAmount);
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

item = orders_pb2.CreateOrderItem(
    productId="550e8400-e29b-41d4-a716-446655440004",
    productName="AirPods Pro",
    quantity=1,
    unitPrice=249.99,
    currency="USD"
)

request = orders_pb2.AddItemToOrderRequest(
    orderId="789e4567-e89b-12d3-a456-426614174003",
    item=item
)

try:
    response = stub.AddItemToOrder(request)
    print(f"Item added. New total: ${response.order.totalAmount:.2f}")
    print(f"Order now has {len(response.order.items)} items")
except grpc.RpcError as e:
    if e.code() == grpc.StatusCode.FAILED_PRECONDITION:
        print("Cannot modify order in current status")
    elif e.code() == grpc.StatusCode.NOT_FOUND:
        print("Order or product not found")
    else:
        print(f"Error: {e}")
```

---

## Behavior Details

### Duplicate Product Handling
When adding an item that already exists in the order (same productId):
- **Option 1**: Increase quantity of existing item
- **Option 2**: Create separate line item
- **Current Implementation**: Creates separate line item with new ID

### Currency Validation
- Item currency must match order currency
- System validates currency codes against ISO 4217 standards
- Mismatched currencies result in `INVALID_ARGUMENT` error

### Stock Management
- System checks product availability before adding
- Quantity validation includes current stock levels
- Out-of-stock products cannot be added

### Order Total Calculation
Order total is recalculated automatically:
```
newTotal = sum(item.quantity * item.unitPrice for item in order.items)
```

---

## State Changes

### Order Fields Updated
- `updatedAt`: Set to current timestamp
- `totalAmount`: Recalculated from all items
- `items`: New item added to collection

### Timestamps
- `createdAt`: Remains unchanged
- `updatedAt`: Updated to current timestamp
- Item `createdAt`: Set for new item

---

## Integration Notes

- This endpoint is commonly used in shopping cart scenarios
- Consider implementing inventory reservations for pending items
- May trigger inventory management events
- Could affect pricing calculations if discounts are applied
- May require notification to customer about order changes

---

## Related Endpoints

- `RemoveItemFromOrder`: Remove items from order
- `UpdateOrderItemQuantity`: Modify item quantities
- `GetOrder`: View updated order details
- `UpdateOrderStatus`: Change order status
