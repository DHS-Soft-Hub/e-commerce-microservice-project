# Shopping Cart gRPC Service Definition

## Service Overview
The Shopping Cart gRPC service provides remote procedure calls for managing shopping cart operations.

## Service Definition
```proto
service ShoppingCart {
  rpc GetCart (GetCartRequest) returns (GetCartResponse);
  rpc AddToCart (AddToCartRequest) returns (AddToCartResponse);
  rpc RemoveFromCart (RemoveFromCartRequest) returns (RemoveFromCartResponse);
  rpc UpdateItemQuantity (UpdateItemQuantityRequest) returns (UpdateItemQuantityResponse);
  rpc Checkout (CheckoutRequest) returns (CheckoutResponse);
}
```

## Proto Package
```proto
syntax = "proto3";
option csharp_namespace = "ShoppingCart.Api.Protos";
package shoppingcart;
```

## Common Message Types

### Cart Message
```proto
message Cart {
  string user_id = 1;
  string session_id = 2;
  repeated CartItem items = 3;
  float total_price = 4;
  string currency = 5;
}
```

### CartItem Message
```proto
message CartItem {
  string product_id = 1;
  string product_name = 2;
  int32 quantity = 3;
  float price = 4;
  string currency = 5;
}
```
