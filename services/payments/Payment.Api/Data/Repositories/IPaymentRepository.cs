using Shared.Domain.Common;

namespace Payment.Api.Data.Repositories;

public interface IPaymentRepository
{
    // Define your repository methods here
    Task<Entities.Payment> GetPaymentByIdAsync(Guid id);
    Task<Entities.Payment> GetPaymentByOrderIdAsync(Guid orderId);
    Task<IEnumerable<Entities.Payment>> GetAllPaymentsAsync();
    Task<PaginatedResult<Entities.Payment>> GetPaymentsWithPaginationAsync(PaginationQuery paginationQuery);
    Task<PaginatedResult<Entities.Payment>> GetCustomerPaymentsWithPaginationAsync(Guid customerId, PaginationQuery paginationQuery);
    Task<int> GetTotalCountAsync();
    Task<int> GetCustomerPaymentsCountAsync(Guid customerId);
    Task AddPaymentAsync(Entities.Payment payment);
    Task UpdatePaymentAsync(Entities.Payment payment);
    Task DeletePaymentAsync(Guid id);
}