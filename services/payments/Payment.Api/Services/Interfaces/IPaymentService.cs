namespace Payment.Api.Data.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<Models.Entities.Payment> GetPaymentByIdAsync(Guid id);
        Task<IEnumerable<Models.Entities.Payment>> GetAllPaymentsAsync();
        Task AddPaymentAsync(Models.Entities.Payment payment);
        Task UpdatePaymentAsync(Models.Entities.Payment payment);
        Task DeletePaymentAsync(Guid id);
    }
}