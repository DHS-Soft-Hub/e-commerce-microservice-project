
using Orders.Domain.Aggregates;
using Shared.Domain.Common;

namespace Orders.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order, CancellationToken cancellationToken = default);
        Task UpdateAsync(Order order, CancellationToken cancellationToken = default);
        Task<Order?> GetByIdAsync(ValueObjects.OrderId id, CancellationToken cancellationToken = default);
        Task<List<Order>> GetAllAsync(CancellationToken cancellationToken = default);
    }
}
