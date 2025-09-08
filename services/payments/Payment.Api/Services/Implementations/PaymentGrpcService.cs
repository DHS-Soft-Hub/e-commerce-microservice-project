using Grpc.Core;
using Payment.Api.DTOs.Requests;
using Payment.Api.Enums;
using Payment.Api.Protos;
using Payment.Api.Services.Interfaces;

namespace Payment.Api.Services.Implementations;

public class PaymentGrpcService : Protos.PaymentService.PaymentServiceBase
{
    private readonly IPaymentService _paymentService;

    public PaymentGrpcService(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    public override async Task<PaymentResponse> CreatePayment(PaymentRequest request, ServerCallContext context)
    {
        await _paymentService.AddPaymentAsync(
            new PaymentCreateRequest
            (
                OrderId: Guid.Parse(request.OrderId),
                TransactionId: request.TransactionId,
                Price: (decimal)request.Amount,
                Currency: request.Currency,
                PaymentMethod: request.PaymentMethod
            ));

        return new PaymentResponse
        {
            OrderId = request.OrderId,
            Status = PaymentStatus.Pending.ToString(),
            TransactionId = request.TransactionId,
            Amount = request.Amount,
            Currency = request.Currency,
        };
    }
}