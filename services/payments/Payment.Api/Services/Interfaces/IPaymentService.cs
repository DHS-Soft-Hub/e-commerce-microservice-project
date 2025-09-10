using Payment.Api.DTOs.Requests;
using Payment.Api.DTOs.Responses;

namespace Payment.Api.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> GetPaymentByIdAsync(Guid id);
        Task<IEnumerable<PaymentResponseDto>> GetAllPaymentsAsync();
        Task<PaymentResponseDto> AddPaymentAsync(PaymentCreateRequestDto payment);
        Task UpdatePaymentAsync(PaymentUpdateRequestDto payment);
        Task DeletePaymentAsync(Guid id);
    }
}