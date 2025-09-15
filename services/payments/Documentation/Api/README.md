# Payment Service API Documentation

This document provides comprehensive documentation for all endpoints in the Payment Service gRPC API.

## Service Overview

The Payment Service provides functionality to manage payment transactions in the e-commerce system. It supports creating, retrieving, updating, and deleting payment records, as well as listing payments with pagination support.

## Available Endpoints

| Endpoint | Type | Description | Documentation |
|----------|------|-------------|---------------|
| `CreatePayment` | Unary RPC | Creates a new payment record | [CreatePayment.md](./CreatePayment.md) |
| `GetPaymentById` | Unary RPC | Retrieves a specific payment by ID | [GetPaymentById.md](./GetPaymentById.md) |
| `UpdatePayment` | Unary RPC | Updates an existing payment record | [UpdatePayment.md](./UpdatePayment.md) |
| `DeletePayment` | Unary RPC | Deletes a payment record | [DeletePayment.md](./DeletePayment.md) |
| `ListPayments` | Server Streaming RPC | Retrieves paginated list of all payments | [ListPayments.md](./ListPayments.md) |
| `ListCustomerPayments` | Server Streaming RPC | Retrieves paginated list of customer payments | [ListCustomerPayments.md](./ListCustomerPayments.md) |

## Common Data Types

### Payment Object

The core payment object used across all endpoints:

```json
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
```

### Enumerations

#### Payment Methods
- `CreditCard`
- `PayPal`
- `BankTransfer`
- `CashOnDelivery`
- `ApplePay`
- `GooglePay`

#### Payment Status
- `Pending`
- `Processing`
- `Completed`
- `Failed`
- `Refunded`
- `Canceled`

## Service Definition

```proto
service PaymentService {
    rpc CreatePayment (PaymentCreateRequest) returns (PaymentCreateResponse);
    rpc GetPaymentById (PaymentGetRequest) returns (PaymentGetResponse);
    rpc UpdatePayment (PaymentUpdateRequest) returns (PaymentUpdateResponse);
    rpc DeletePayment (PaymentDeleteRequest) returns (PaymentDeleteResponse);
    rpc ListPayments (PaymentListRequest) returns (stream PaymentListResponse);
    rpc ListCustomerPayments (PaymentListCustomerRequest) returns (stream PaymentListResponse);
}
```

## Connection Information

- **Service Namespace**: `Payment.Api.Protos`
- **Package**: `payment`
- **Protocol**: gRPC
- **Syntax**: proto3

## Notes

- All UUIDs should be in standard UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- Timestamps are in ISO 8601 format (e.g., `2025-09-14T10:30:00.000Z`)
- Currency codes should follow standard currency code formats (e.g., `USD`, `EUR`)
- Decimal amounts are converted to double precision for gRPC transmission
- Server streaming endpoints (`ListPayments` and `ListCustomerPayments`) support pagination and return results as streams for efficient handling of large datasets
