
using Orders.Domain.Aggregates;
using Shared.Domain.Common;

namespace Orders.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
        Task UpdateAsync(Order order);
        Task<Order?> GetByIdAsync(ValueObjects.OrderId id);
        Task<List<Order>> GetAllAsync();
    }
}
