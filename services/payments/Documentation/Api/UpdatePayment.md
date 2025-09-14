# Update Payment

Updates an existing payment record in the system.

## Endpoint Details

- **Method**: `UpdatePayment`
- **Type**: Unary RPC
- **Service**: PaymentService

## Request Schema

### PaymentUpdateRequest

```json
{
  "payment": {
    "id": "string",
    "order_id": "string",
    "transaction_id": "string",
    "payment_method": "string",
    "amount": "number",
    "currency": "string",
    "status": "string"
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payment.id` | string | Yes | UUID of the payment to update |
| `payment.order_id` | string | Yes | UUID of the associated order |
| `payment.transaction_id` | string | Yes | External transaction identifier |
| `payment.payment_method` | string | Yes | Payment method used (see enum values below) |
| `payment.amount` | number | Yes | Payment amount (decimal converted to double) |
| `payment.currency` | string | Yes | Currency code (e.g., "USD", "EUR") |
| `payment.status` | string | Yes | Payment status (see enum values below) |

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

## Response Schema

### PaymentUpdateResponse

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
| `payment.id` | string | UUID of the updated payment |
| `payment.order_id` | string | UUID of the associated order |
| `payment.transaction_id` | string | External transaction identifier |
| `payment.payment_method` | string | Payment method used |
| `payment.amount` | number | Payment amount |
| `payment.currency` | string | Currency code |
| `payment.status` | string | Current payment status |
| `payment.created_at` | string | ISO 8601 timestamp of creation |
| `payment.updated_at` | string | ISO 8601 timestamp of last update |

## Example Request

```json
{
  "payment": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "transaction_id": "TXN_12345",
    "payment_method": "CreditCard",
    "amount": 99.99,
    "currency": "USD",
    "status": "Completed"
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
    "status": "Completed",
    "created_at": "2025-09-14T10:30:00.000Z",
    "updated_at": "2025-09-14T10:35:00.000Z"
  }
}
```

## gRPC Proto Definition

```proto
message PaymentUpdate {
    string id = 1;
    string order_id = 2;
    string transaction_id = 3;
    string payment_method = 4;
    double amount = 5;
    string currency = 6;
    string status = 7;
}

message PaymentUpdateRequest {
    PaymentUpdate payment = 1;
}

message PaymentUpdateResponse {
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
    rpc UpdatePayment (PaymentUpdateRequest) returns (PaymentUpdateResponse);
}
```
