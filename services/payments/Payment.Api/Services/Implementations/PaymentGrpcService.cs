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

    public override async Task<PaymentCreateResponse> CreatePayment(PaymentCreateRequest request, ServerCallContext context)
    {
        var response = await _paymentService.AddPaymentAsync(
            new PaymentCreateRequestDto
            (
                OrderId: Guid.Parse(request.Payment.OrderId),
                TransactionId: request.Payment.TransactionId,
                Price: (decimal)request.Payment.Amount,
                Currency: request.Payment.Currency,
                PaymentMethod: request.Payment.PaymentMethod
            ));

        return new PaymentCreateResponse
        {
            Payment = MapToPaymentDto(response)
        };
    }

    private Protos.Payment MapToPaymentDto(DTOs.Responses.PaymentResponseDto payment) => new()
    {
        Id = payment.Id,
        OrderId = payment.OrderId,
        TransactionId = payment.TransactionId,
        Amount = (double)payment.Amount,
        Currency = payment.Currency,
        PaymentMethod = payment.PaymentMethod,
        Status = payment.Status
    };
}