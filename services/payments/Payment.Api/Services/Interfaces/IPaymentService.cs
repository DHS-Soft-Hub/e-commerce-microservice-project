namespace Payment.Api.Data.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<Entities.Payment> GetPaymentByIdAsync(Guid id);
        Task<IEnumerable<Entities.Payment>> GetAllPaymentsAsync();
        Task AddPaymentAsync(Entities.Payment payment);
        Task UpdatePaymentAsync(Entities.Payment payment);
        Task DeletePaymentAsync(Guid id);
    }
}