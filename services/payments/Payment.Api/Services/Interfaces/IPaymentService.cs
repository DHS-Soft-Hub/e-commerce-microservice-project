using Payment.Api.DTOs.Requests;
using Payment.Api.DTOs.Responses;
using Shared.Domain.Common;

namespace Payment.Api.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> GetPaymentByIdAsync(Guid id);
        Task<PaymentResponseDto> GetPaymentByOrderIdAsync(Guid orderId);
        Task<IEnumerable<PaymentResponseDto>> GetAllPaymentsAsync();
        Task<PaginatedResult<PaymentResponseDto>> GetPaymentsWithPaginationAsync(PaginationQuery paginationQuery);
        Task<PaginatedResult<PaymentResponseDto>> GetCustomerPaymentsWithPaginationAsync(Guid customerId, PaginationQuery paginationQuery);
        Task<PaymentResponseDto> AddPaymentAsync(PaymentCreateRequestDto payment);
        Task UpdatePaymentAsync(PaymentUpdateRequestDto payment);
        Task DeletePaymentAsync(Guid id);
    }
}