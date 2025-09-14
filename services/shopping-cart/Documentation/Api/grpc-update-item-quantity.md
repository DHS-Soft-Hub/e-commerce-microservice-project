# Update Item Quantity - gRPC Endpoint

## Method
`UpdateItemQuantity`

## Description
Updates the quantity of an item in the shopping cart for a specific user and session.

## Request Schema
```proto
message UpdateItemQuantityRequest {
  string user_id = 1;
  string session_id = 2;
  string item_id = 3;
  int32 quantity = 4;
}
```

## Request (JSON Equivalent)
```json
{
  "userId": "string",
  "sessionId": "string",
  "itemId": "string",
  "quantity": 0
}
```

## Response Schema
```proto
message UpdateItemQuantityResponse {
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
