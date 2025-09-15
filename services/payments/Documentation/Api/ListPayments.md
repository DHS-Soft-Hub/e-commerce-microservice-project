# List Payments

Retrieves a paginated list of all payments in the system using server streaming.

## Endpoint Details

- **Method**: `ListPayments`
- **Type**: Server Streaming RPC
- **Service**: PaymentService

## Request Schema

### PaymentListRequest

```json
{
  "page_number": "number",
  "page_size": "number"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page_number` | number | No | Page number to retrieve (defaults to 1 if not provided or <= 0) |
| `page_size` | number | No | Number of items per page (defaults to 10 if not provided or <= 0) |

## Response Schema

### PaymentListResponse (Streamed)

```json
{
  "payments": [
    {
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
  ]
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `payments` | array | Array of payment objects |
| `payments[].id` | string | UUID of the payment |
| `payments[].order_id` | string | UUID of the associated order |
| `payments[].transaction_id` | string | External transaction identifier |
| `payments[].payment_method` | string | Payment method used |
| `payments[].amount` | number | Payment amount |
| `payments[].currency` | string | Currency code |
| `payments[].status` | string | Current payment status |
| `payments[].created_at` | string | ISO 8601 timestamp of creation |
| `payments[].updated_at` | string | ISO 8601 timestamp of last update (empty if never updated) |

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
  "page_number": 1,
  "page_size": 10
}
```

## Example Response

```json
{
  "payments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "order_id": "550e8400-e29b-41d4-a716-446655440000",
      "transaction_id": "TXN_12345",
      "payment_method": "CreditCard",
      "amount": 99.99,
      "currency": "USD",
      "status": "Completed",
      "created_at": "2025-09-14T10:30:00.000Z",
      "updated_at": "2025-09-14T10:35:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "order_id": "550e8400-e29b-41d4-a716-446655440003",
      "transaction_id": "TXN_12346",
      "payment_method": "PayPal",
      "amount": 149.99,
      "currency": "USD",
      "status": "Pending",
      "created_at": "2025-09-14T11:00:00.000Z",
      "updated_at": ""
    }
  ]
}
```

## gRPC Proto Definition

```proto
message PaymentListRequest {
    int32 page_number = 1;
    int32 page_size = 2;
}

message PaymentListResponse {
    repeated Payment payments = 1;
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
    rpc ListPayments (PaymentListRequest) returns (stream PaymentListResponse);
}
```

## Notes

- This is a **server streaming RPC**, meaning the server can send multiple response messages
- The response is streamed, allowing for efficient handling of large datasets
- Pagination is handled internally, but the entire result set for the requested page is returned in the stream
- Default pagination values are applied if not specified in the request
