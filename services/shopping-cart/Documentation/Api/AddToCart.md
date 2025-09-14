# Add to Cart - gRPC Endpoint

## Method
`AddToCart`

## Description
Adds an item to the shopping cart for a specific user and session.

## Request Schema
```proto
message AddToCartRequest {
  string user_id = 1;
  string session_id = 2;
  CartItem item = 3;
}
```

## Request (JSON Equivalent)
```json
{
  "userId": "string",
  "sessionId": "string",
  "item": {
    "productId": "string",
    "productName": "string",
    "quantity": 0,
    "price": 0.0,
    "currency": "string"
  }
}
```

## Response Schema
```proto
message AddToCartResponse {
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
