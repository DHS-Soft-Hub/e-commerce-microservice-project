using Payment.Api.DTOs.Requests;
using Payment.Api.DTOs.Responses;

namespace Payment.Api.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponse> GetPaymentByIdAsync(Guid id);
        Task<IEnumerable<PaymentResponse>> GetAllPaymentsAsync();
        Task<PaymentResponse> AddPaymentAsync(PaymentCreateRequest payment);
        Task UpdatePaymentAsync(PaymentUpdateRequest payment);
        Task DeletePaymentAsync(Guid id);
    }
}