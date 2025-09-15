# UpdateOrderStatus Endpoint

## Overview
Updates the status of an existing order. This endpoint allows order status transitions through the order lifecycle.

**Method**: `orders.Orders/UpdateOrderStatus`  
**Type**: Unary RPC  
**Service**: Orders Service

---

## Request

### Schema
```protobuf
message UpdateOrderStatusRequest {
  string orderId = 1;
  string status = 2;
}
```

### JSON Example
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Shipped"
}
```

### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | `string` | Yes | Unique identifier for the order (GUID format) |
| `status` | `string` | Yes | New status for the order (see valid values below) |

### Valid Status Values
| Status | Description | Transitions From |
|--------|-------------|------------------|
| `Pending` | Order created, awaiting processing | Initial state |
| `Processing` | Order being prepared/processed | Pending |
| `Shipped` | Order has been shipped | Processing |
| `Delivered` | Order has been delivered | Shipped |
| `Cancelled` | Order has been cancelled | Pending, Processing |
| `Returned` | Order has been returned | Delivered |

---

## Response

### Schema
```protobuf
message UpdateOrderStatusResponse {
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
    "status": "Shipped",
    "createdAt": "638380512000000000",
    "updatedAt": "638380567200000000",
    "totalAmount": 1249.98,
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174004",
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "productName": "iPhone 15 Pro",
        "quantity": 1,
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

1. **Order Existence**: Order must exist in the system
2. **Valid Transitions**: Status changes must follow valid transition paths
3. **Permission Check**: User must have authority to change order status
4. **Status Constraints**: Some statuses cannot be changed once set (e.g., Delivered → Processing)
5. **Inventory Impact**: Status changes may affect inventory (cancellation releases stock)
6. **Payment Status**: Financial implications of status changes
7. **Audit Trail**: All status changes are logged for tracking

---

## Status Transition Rules

### Valid Transitions
```
Pending → Processing
Pending → Cancelled
Processing → Shipped
Processing → Cancelled
Shipped → Delivered
Delivered → Returned
```

### Invalid Transitions
- Cannot go backwards in the normal flow (Shipped → Processing)
- Cannot change status from terminal states (Delivered, Cancelled, Returned)
- Cannot skip intermediate states (Pending → Delivered)

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid GUID format | Order ID is not a valid GUID |
| `INVALID_ARGUMENT` | Invalid status | Status value is not recognized |
| `INVALID_ARGUMENT` | Empty parameters | Required parameters cannot be empty |
| `NOT_FOUND` | Order not found | Order with specified ID does not exist |
| `FAILED_PRECONDITION` | Invalid transition | Status transition is not allowed |
| `FAILED_PRECONDITION` | Terminal status | Order is in a terminal status |
| `PERMISSION_DENIED` | Access denied | User does not have permission to update order status |
| `FAILED_PRECONDITION` | Business constraint | Business rules prevent status change |

---

## Usage Examples

### grpcurl
```bash
grpcurl -plaintext -d '{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Shipped"
}' localhost:5001 orders.Orders/UpdateOrderStatus
```

### .NET Client
```csharp
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Orders.OrdersClient(channel);

var request = new UpdateOrderStatusRequest
{
    OrderId = "789e4567-e89b-12d3-a456-426614174003",
    Status = "Shipped"
};

try
{
    var response = await client.UpdateOrderStatusAsync(request);
    
    Console.WriteLine($"Order {response.Order.Id} status updated:");
    Console.WriteLine($"  Previous status: Processing");
    Console.WriteLine($"  New status: {response.Order.Status}");
    Console.WriteLine($"  Updated at: {DateTimeOffset.FromUnixTimeNanos(response.Order.UpdatedAt)}");
}
catch (RpcException ex) when (ex.StatusCode == StatusCode.FailedPrecondition)
{
    Console.WriteLine("Cannot update status - invalid transition or business constraint");
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
  orderId: "789e4567-e89b-12d3-a456-426614174003",
  status: "Shipped"
};

client.UpdateOrderStatus(request, (error, response) => {
  if (error) {
    if (error.code === grpc.status.FAILED_PRECONDITION) {
      console.log('Cannot update status - invalid transition');
    } else {
      console.error('Error:', error.details);
    }
  } else {
    console.log('Status updated successfully');
    console.log(`Order ${response.order.id} is now ${response.order.status}`);
    
    // Check if this is a shipping update
    if (response.order.status === 'Shipped') {
      console.log('Order has been shipped! Customer will be notified.');
    }
  }
});
```

### Python Client
```python
import grpc
import orders_pb2
import orders_pb2_grpc
from datetime import datetime

channel = grpc.insecure_channel('localhost:5001')
stub = orders_pb2_grpc.OrdersStub(channel)

request = orders_pb2.UpdateOrderStatusRequest(
    orderId="789e4567-e89b-12d3-a456-426614174003",
    status="Shipped"
)

try:
    response = stub.UpdateOrderStatus(request)
    
    print(f"Status updated successfully!")
    print(f"Order ID: {response.order.id}")
    print(f"New status: {response.order.status}")
    
    # Convert nanoseconds to datetime
    updated_time = datetime.fromtimestamp(response.order.updatedAt / 1_000_000_000)
    print(f"Updated at: {updated_time}")
    
    # Status-specific actions
    if response.order.status == "Shipped":
        print("🚚 Order is now in transit!")
    elif response.order.status == "Delivered":
        print("📦 Order has been delivered!")
    elif response.order.status == "Cancelled":
        print("❌ Order has been cancelled.")
    
except grpc.RpcError as e:
    if e.code() == grpc.StatusCode.FAILED_PRECONDITION:
        print("Cannot update status - invalid transition")
    elif e.code() == grpc.StatusCode.NOT_FOUND:
        print("Order not found")
    else:
        print(f"Error: {e}")
```

---

## Status Workflow Examples

### Normal Order Flow
```json
// Step 1: Create Order
{ "status": "Pending" }

// Step 2: Begin Processing
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Processing"
}

// Step 3: Ship Order
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Shipped"
}

// Step 4: Mark Delivered
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Delivered"
}
```

### Cancellation Flow
```json
// From Pending
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Cancelled"
}

// From Processing
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Cancelled"
}
```

### Return Flow
```json
// After Delivery
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "status": "Returned"
}
```

---

## Behavior Details

### Status Update Processing
1. **Validation**: Verify order exists and status is valid
2. **Permission Check**: Ensure user can modify order
3. **Transition Check**: Verify status transition is allowed
4. **Business Rules**: Check business constraints
5. **Update**: Change order status
6. **Side Effects**: Execute status-related actions
7. **Timestamp Update**: Update order's `updatedAt` timestamp
8. **Event Publishing**: Publish status change events

### Side Effects by Status

#### Processing
- Reserve inventory for all items
- Initiate payment processing
- Send processing confirmation

#### Shipped
- Generate tracking number
- Send shipping notification
- Update inventory to "shipped"

#### Delivered
- Mark order as complete
- Trigger review request
- Update customer statistics

#### Cancelled
- Release reserved inventory
- Process refunds
- Send cancellation notification

#### Returned
- Initiate return process
- Process refunds
- Update inventory levels

---

## Error Scenarios

| Error Code | Scenario | Description |
|------------|----------|-------------|
| `INVALID_ARGUMENT` | Invalid GUID format | Order ID is not a valid GUID |
| `INVALID_ARGUMENT` | Invalid status | Status value is not recognized |
| `INVALID_ARGUMENT` | Empty parameters | Required parameters cannot be empty |
| `NOT_FOUND` | Order not found | Order with specified ID does not exist |
| `FAILED_PRECONDITION` | Invalid transition | Status transition is not allowed from current status |
| `FAILED_PRECONDITION` | Terminal status | Order is in a terminal status and cannot be changed |
| `FAILED_PRECONDITION` | Inventory constraint | Insufficient inventory for status change |
| `FAILED_PRECONDITION` | Payment constraint | Payment status prevents status change |
| `PERMISSION_DENIED` | Access denied | User does not have permission to update order status |
| `UNAVAILABLE` | External service | External service required for status change is unavailable |

---

## State Changes

### Order Fields Updated
- `status`: Updated to new status value
- `updatedAt`: Set to current timestamp

### Status-Specific Updates
- **Shipped**: May add tracking information
- **Delivered**: May add delivery confirmation
- **Cancelled**: May add cancellation reason
- **Returned**: May add return tracking

### Related Entity Updates
- **Inventory**: Stock levels may change
- **Payments**: Refund/payment status updates
- **Notifications**: Customer alerts triggered

---

## Integration Considerations

### Event Publishing
Status changes trigger domain events:
```json
{
  "eventType": "OrderStatusChanged",
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "oldStatus": "Processing",
  "newStatus": "Shipped",
  "timestamp": "2024-01-15T10:30:00Z",
  "triggeredBy": "user@example.com"
}
```

### External Service Integration
- **Shipping**: Generate tracking numbers
- **Payment**: Process refunds/charges
- **Notification**: Send customer updates
- **Inventory**: Update stock levels
- **Analytics**: Track status metrics

### Workflow Orchestration
Status changes may trigger:
- Email/SMS notifications
- Inventory adjustments
- Payment processing
- Shipping label generation
- Customer service workflows

---

## Performance Considerations

- **Atomic Updates**: Status changes should be atomic with side effects
- **Event Publishing**: Consider asynchronous event publishing
- **External Calls**: Handle timeout and retry for external services
- **Validation Caching**: Cache validation rules for performance

---

## Monitoring and Analytics

### Key Metrics
- Status transition frequency
- Time in each status
- Invalid transition attempts
- Status change errors
- Business rule violations

### Alerting
- High cancellation rates
- Stuck orders in processing
- Failed status transitions
- External service failures

---

## Related Endpoints

- `GetOrder`: View current order details and status
- `GetOrders`: List orders with status filtering
- `CreateOrder`: Initial order creation (sets to Pending)
- `UpdateOrder`: General order updates

---

## Status Management Best Practices

### State Machine Implementation
```csharp
public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Returned
}

public static class OrderStatusTransitions
{
    private static readonly Dictionary<OrderStatus, OrderStatus[]> ValidTransitions = new()
    {
        [OrderStatus.Pending] = new[] { OrderStatus.Processing, OrderStatus.Cancelled },
        [OrderStatus.Processing] = new[] { OrderStatus.Shipped, OrderStatus.Cancelled },
        [OrderStatus.Shipped] = new[] { OrderStatus.Delivered },
        [OrderStatus.Delivered] = new[] { OrderStatus.Returned },
        [OrderStatus.Cancelled] = new OrderStatus[0],
        [OrderStatus.Returned] = new OrderStatus[0]
    };
    
    public static bool IsValidTransition(OrderStatus from, OrderStatus to)
    {
        return ValidTransitions.TryGetValue(from, out var allowed) && 
               allowed.Contains(to);
    }
}
```

### Audit Trail
Maintain complete audit trail of status changes:
```json
{
  "orderId": "789e4567-e89b-12d3-a456-426614174003",
  "statusHistory": [
    {
      "status": "Pending",
      "timestamp": "2024-01-15T09:00:00Z",
      "triggeredBy": "system",
      "reason": "Order created"
    },
    {
      "status": "Processing",
      "timestamp": "2024-01-15T09:30:00Z",
      "triggeredBy": "admin@store.com",
      "reason": "Manual processing started"
    },
    {
      "status": "Shipped",
      "timestamp": "2024-01-15T14:00:00Z",
      "triggeredBy": "shipping-service",
      "reason": "Package dispatched",
      "metadata": {
        "trackingNumber": "1Z999AA1234567890",
        "carrier": "UPS"
      }
    }
  ]
}
```
