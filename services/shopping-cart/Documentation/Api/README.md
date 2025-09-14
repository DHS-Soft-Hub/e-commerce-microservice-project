# Shopping Cart gRPC API Documentation Index

## Overview
This directory contains the complete documentation for the Shopping Cart gRPC service endpoints.

## Files Structure

### Service Definition
- [`grpc-service-definition.md`](./grpc-service-definition.md) - Complete service definition and common message types

### Individual Endpoints
- [`grpc-get-cart.md`](./grpc-get-cart.md) - Get Cart endpoint documentation
- [`grpc-add-to-cart.md`](./grpc-add-to-cart.md) - Add to Cart endpoint documentation
- [`grpc-remove-from-cart.md`](./grpc-remove-from-cart.md) - Remove from Cart endpoint documentation
- [`grpc-update-item-quantity.md`](./grpc-update-item-quantity.md) - Update Item Quantity endpoint documentation
- [`grpc-checkout.md`](./grpc-checkout.md) - Checkout endpoint documentation

## Service Methods Summary

| Method | Description |
|--------|-------------|
| `GetCart` | Retrieves the shopping cart for a user and session |
| `AddToCart` | Adds an item to the shopping cart |
| `RemoveFromCart` | Removes an item from the shopping cart |
| `UpdateItemQuantity` | Updates the quantity of an item in the cart |
| `Checkout` | Processes checkout for the shopping cart |

## Data Types
All endpoints work with the common `Cart` and `CartItem` message types defined in the service definition file.

## Notes
- All price values are represented as `float` in gRPC proto messages
- Product IDs, User IDs, and Item IDs are represented as strings
- All endpoints require explicit user ID and session ID parameters
- JSON equivalents are provided for easier understanding and testing
