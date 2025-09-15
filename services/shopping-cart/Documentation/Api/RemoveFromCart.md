# Remove from Cart - gRPC Endpoint

## Method
`RemoveFromCart`

## Description
Removes an item from the shopping cart for a specific user and session.

## Request Schema
```proto
message RemoveFromCartRequest {
  string user_id = 1;
  string session_id = 2;
  string item_id = 3;
}
```

## Request (JSON Equivalent)
```json
{
  "userId": "string",
  "sessionId": "string",
  "itemId": "string"
}
```

## Response Schema
```proto
message RemoveFromCartResponse {
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
