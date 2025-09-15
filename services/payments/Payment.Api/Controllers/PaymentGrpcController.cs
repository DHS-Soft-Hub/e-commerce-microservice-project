using Grpc.Core;
using Payment.Api.DTOs.Requests;
using Payment.Api.Enums;
using Payment.Api.Protos;
using Payment.Api.Services.Interfaces;
using Shared.Domain.Common;

namespace Payment.Api.Services.Implementations;

public class PaymentGrpcController : Protos.PaymentService.PaymentServiceBase
{
    private readonly IPaymentService _paymentService;

    public PaymentGrpcController(IPaymentService paymentService)
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

    public override async Task<PaymentGetResponse> GetPaymentById(PaymentGetRequest request, ServerCallContext context)
    {
        var payment = await _paymentService.GetPaymentByIdAsync(Guid.Parse(request.Id));
        
        return new PaymentGetResponse
        {
            Payment = MapToPaymentDto(payment)
        };
    }

    public override async Task<PaymentGetResponse> GetPaymentByOrderId(PaymentGetRequest request, ServerCallContext context)
    {
        var payment = await _paymentService.GetPaymentByOrderIdAsync(Guid.Parse(request.Id));
        
        return new PaymentGetResponse
        {
            Payment = MapToPaymentDto(payment)
        };
    }

    public override async Task<PaymentUpdateResponse> UpdatePayment(PaymentUpdateRequest request, ServerCallContext context)
    {
        await _paymentService.UpdatePaymentAsync(new PaymentUpdateRequestDto
        (
            Id: Guid.Parse(request.Payment.Id),
            OrderId: Guid.Parse(request.Payment.OrderId),
            TransactionId: request.Payment.TransactionId,
            Price: (decimal)request.Payment.Amount,
            Currency: request.Payment.Currency,
            PaymentMethod: request.Payment.PaymentMethod,
            Status: request.Payment.Status
        ));

        var updatedPayment = await _paymentService.GetPaymentByIdAsync(Guid.Parse(request.Payment.Id));
        
        return new PaymentUpdateResponse
        {
            Payment = MapToPaymentDto(updatedPayment)
        };
    }

    public override async Task<PaymentDeleteResponse> DeletePayment(PaymentDeleteRequest request, ServerCallContext context)
    {
        await _paymentService.DeletePaymentAsync(Guid.Parse(request.Id));
        
        return new PaymentDeleteResponse
        {
            Id = request.Id
        };
    }

    public override async Task ListPayments(PaymentListRequest request, IServerStreamWriter<PaymentListResponse> responseStream, ServerCallContext context)
    {
        var paginationQuery = new PaginationQuery
        {
            PageNumber = request.PageNumber > 0 ? request.PageNumber : 1,
            PageSize = request.PageSize > 0 ? request.PageSize : 10
        };

        var paginatedPayments = await _paymentService.GetPaymentsWithPaginationAsync(paginationQuery);

        var response = new PaymentListResponse();
        response.Payments.AddRange(paginatedPayments.Items.Select(MapToPaymentDto));

        await responseStream.WriteAsync(response);
    }

    public override async Task ListCustomerPayments(PaymentListCustomerRequest request, IServerStreamWriter<PaymentListResponse> responseStream, ServerCallContext context)
    {
        var paginationQuery = new PaginationQuery
        {
            PageNumber = request.PageNumber > 0 ? request.PageNumber : 1,
            PageSize = request.PageSize > 0 ? request.PageSize : 10
        };

        var paginatedPayments = await _paymentService.GetCustomerPaymentsWithPaginationAsync(
            Guid.Parse(request.CustomerId), 
            paginationQuery);

        var response = new PaymentListResponse();
        response.Payments.AddRange(paginatedPayments.Items.Select(MapToPaymentDto));

        await responseStream.WriteAsync(response);
    }

    private Protos.Payment MapToPaymentDto(DTOs.Responses.PaymentResponseDto payment) => new()
    {
        Id = payment.Id,
        OrderId = payment.OrderId,
        TransactionId = payment.TransactionId,
        Amount = (double)payment.Amount,
        Currency = payment.Currency,
        PaymentMethod = payment.PaymentMethod,
        Status = payment.Status,
        CreatedAt = payment.CreatedAt.ToString("O"), 
        UpdatedAt = payment.UpdatedAt?.ToString("O") ?? ""
    };
}