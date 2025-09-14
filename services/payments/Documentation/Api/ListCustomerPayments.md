# List Customer Payments

Retrieves a paginated list of payments for a specific customer using server streaming.

## Endpoint Details

- **Method**: `ListCustomerPayments`
- **Type**: Server Streaming RPC
- **Service**: PaymentService

## Request Schema

### PaymentListCustomerRequest

```json
{
  "customer_id": "string",
  "page_number": "number",
  "page_size": "number"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer_id` | string | Yes | UUID of the customer whose payments to retrieve |
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
| `payments` | array | Array of payment objects for the specified customer |
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
  "customer_id": "550e8400-e29b-41d4-a716-446655440999",
  "page_number": 1,
  "page_size": 5
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
message PaymentListCustomerRequest {
    string customer_id = 1;
    int32 page_number = 2;
    int32 page_size = 3;
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
    rpc ListCustomerPayments (PaymentListCustomerRequest) returns (stream PaymentListResponse);
}
```

## Notes

- This is a **server streaming RPC**, meaning the server can send multiple response messages
- The response is streamed, allowing for efficient handling of large datasets
- Only payments associated with the specified customer ID will be returned
- Pagination is handled internally, but the entire result set for the requested page is returned in the stream
- Default pagination values are applied if not specified in the request
- The customer association is determined through the order relationship (customer owns orders, payments belong to orders)
