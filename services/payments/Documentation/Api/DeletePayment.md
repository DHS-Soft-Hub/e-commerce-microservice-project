# Delete Payment

Deletes a payment record from the system.

## Endpoint Details

- **Method**: `DeletePayment`
- **Type**: Unary RPC
- **Service**: PaymentService

## Request Schema

### PaymentDeleteRequest

```json
{
  "id": "string"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | UUID of the payment to delete |

## Response Schema

### PaymentDeleteResponse

```json
{
  "id": "string"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | UUID of the deleted payment (confirmation) |

## Example Request

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001"
}
```

## Example Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001"
}
```

## gRPC Proto Definition

```proto
message PaymentDeleteRequest {
    string id = 1;
}

message PaymentDeleteResponse {
    string id = 1;
}

service PaymentService {
    rpc DeletePayment (PaymentDeleteRequest) returns (PaymentDeleteResponse);
}
```

## Notes

- This operation permanently removes the payment record from the system
- The response confirms successful deletion by returning the ID of the deleted payment
- If the payment ID does not exist, an appropriate error will be returned
