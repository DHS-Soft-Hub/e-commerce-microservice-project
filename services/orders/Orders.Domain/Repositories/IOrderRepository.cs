
namespace Orders.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task AddAsync(Aggregates.Order order);
        Task<Aggregates.Order?> GetByIdAsync(ValueObjects.OrderId id);
        Task<List<Aggregates.Order>> GetAllAsync();
    }
}
