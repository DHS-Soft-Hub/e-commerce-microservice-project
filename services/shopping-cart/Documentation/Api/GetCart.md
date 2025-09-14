# Get Cart - gRPC Endpoint

## Method
`GetCart`

## Description
Retrieves the shopping cart for a specific user and session.

## Request Schema
```proto
message GetCartRequest {
  string user_id = 1;
  string session_id = 2;
}
```

## Request (JSON Equivalent)
```json
{
  "userId": "string",
  "sessionId": "string"
}
```

## Response Schema
```proto
message GetCartResponse {
  Cart cart = 1;
}
```

## Response (JSON Equivalent)
```json
{
  "cart": {
    "userId": "string",
    "sessionId": "string",
    "items": [
      {
        "productId": "string",
        "productName": "string",
        "quantity": 0,
        "price": 0.0,
        "currency": "string"
      }
    ],
    "totalPrice": 0.0,
    "currency": "string"
  }
}
```
