# Get Payment By ID

Retrieves a specific payment by its unique identifier.

## Endpoint Details

- **Method**: `GetPaymentById`
- **Type**: Unary RPC
- **Service**: PaymentService

## Request Schema

### PaymentGetRequest

```json
{
  "id": "string"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | UUID of the payment to retrieve |

## Response Schema

### PaymentGetResponse

```json
{
  "payment": {
    "id": "string",
    "order_id": "string",
    "transaction_id": "string",
    "payment_method": "string",
    "amount": "number",
    "currency": "string",
    "status": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `payment.id` | string | UUID of the payment |
| `payment.order_id` | string | UUID of the associated order |
| `payment.transaction_id` | string | External transaction identifier |
| `payment.payment_method` | string | Payment method used |
| `payment.amount` | number | Payment amount |
| `payment.currency` | string | Currency code |
| `payment.status` | string | Current payment status |
| `payment.created_at` | string | ISO 8601 timestamp of creation |
| `payment.updated_at` | string | ISO 8601 timestamp of last update (empty if never updated) |

### Payment Method Values

- `CreditCard`
- `PayPal`
- `BankTransfer`
- `CashOnDelivery`
- `ApplePay`
- `GooglePay`

### Payment Status Values

- `Pending`
- `Processing`
- `Completed`
- `Failed`
- `Refunded`
- `Canceled`

## Example Request

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001"
}
```

## Example Response

```json
{
  "payment": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "transaction_id": "TXN_12345",
    "payment_method": "CreditCard",
    "amount": 99.99,
    "currency": "USD",
    "status": "Completed",
    "created_at": "2025-09-14T10:30:00.000Z",
    "updated_at": "2025-09-14T10:35:00.000Z"
  }
}
```

## gRPC Proto Definition

```proto
message PaymentGetRequest {
    string id = 1;
}

message PaymentGetResponse {
    Payment payment = 1;
}

message Payment {
    string id = 1;
    string order_id = 2;
    string transaction_id = 3;
    string payment_method = 4;
    double amount = 5;
    string currency = 6;
    string status = 7;
    string created_at = 8;
    string updated_at = 9;
}

service PaymentService {
    rpc GetPaymentById (PaymentGetRequest) returns (PaymentGetResponse);
}
```
