# Checkout - gRPC Endpoint

## Method
`Checkout`

## Description
Processes the checkout for a shopping cart, preparing it for order creation.

## Request Schema
```proto
message CheckoutRequest {
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
message CheckoutResponse {
  string order_id = 1;
  bool success = 2;
  string message = 3;
}
```

## Response (JSON Equivalent)
```json
{
  "orderId": "string",
  "success": true,
  "message": "string"
}
```
