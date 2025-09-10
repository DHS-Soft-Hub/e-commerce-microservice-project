namespace Payment.Api.Data.Repositories;

public interface IPaymentRepository
{
    // Define your repository methods here
    Task<Entities.Payment> GetPaymentByIdAsync(Guid id);
    Task<IEnumerable<Entities.Payment>> GetAllPaymentsAsync();
    Task AddPaymentAsync(Entities.Payment payment);
    Task UpdatePaymentAsync(Entities.Payment payment);
    Task DeletePaymentAsync(Guid id);
}