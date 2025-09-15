# Create Payment

Creates a new payment record in the system.

## Endpoint Details

- **Method**: `CreatePayment`
- **Type**: Unary RPC
- **Service**: PaymentService

## Request Schema

### PaymentCreateRequest

```json
{
  "payment": {
    "order_id": "string",
    "transaction_id": "string", 
    "payment_method": "string",
    "amount": "number",
    "currency": "string"
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payment.order_id` | string | Yes | UUID of the associated order |
| `payment.transaction_id` | string | Yes | External transaction identifier |
| `payment.payment_method` | string | Yes | Payment method used (see enum values below) |
| `payment.amount` | number | Yes | Payment amount (decimal converted to double) |
| `payment.currency` | string | Yes | Currency code (e.g., "USD", "EUR") |

### Payment Method Values

- `CreditCard`
- `PayPal`
- `BankTransfer`
- `CashOnDelivery`
- `ApplePay`
- `GooglePay`

## Response Schema

### PaymentCreateResponse

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
| `payment.id` | string | UUID of the created payment |
| `payment.order_id` | string | UUID of the associated order |
| `payment.transaction_id` | string | External transaction identifier |
| `payment.payment_method` | string | Payment method used |
| `payment.amount` | number | Payment amount |
| `payment.currency` | string | Currency code |
| `payment.status` | string | Current payment status (see enum values below) |
| `payment.created_at` | string | ISO 8601 timestamp of creation |
| `payment.updated_at` | string | ISO 8601 timestamp of last update (empty if never updated) |

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
  "payment": {
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "transaction_id": "TXN_12345",
    "payment_method": "CreditCard",
    "amount": 99.99,
    "currency": "USD"
  }
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
    "status": "Pending",
    "created_at": "2025-09-14T10:30:00.000Z",
    "updated_at": ""
  }
}
```

## gRPC Proto Definition

```proto
message PaymentCreate {
    string order_id = 1;
    string transaction_id = 2;
    string payment_method = 3;
    double amount = 4;
    string currency = 5;
}

message PaymentCreateRequest {
    PaymentCreate payment = 1;
}

message PaymentCreateResponse {
    Payment payment = 1;
}

service PaymentService {
    rpc CreatePayment (PaymentCreateRequest) returns (PaymentCreateResponse);
}
```
