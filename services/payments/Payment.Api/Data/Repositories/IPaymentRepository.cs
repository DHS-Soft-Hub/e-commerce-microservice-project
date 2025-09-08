namespace Payment.Api.Data.Repositories
{
    public interface IPaymentRepository
    {
        // Define your repository methods here
        Task<Models.Entities.Payment> GetPaymentByIdAsync(Guid id);
        Task<IEnumerable<Models.Entities.Payment>> GetAllPaymentsAsync();
        Task AddPaymentAsync(Models.Entities.Payment payment);
        Task UpdatePaymentAsync(Models.Entities.Payment payment);
        Task DeletePaymentAsync(Guid id);
    }
}