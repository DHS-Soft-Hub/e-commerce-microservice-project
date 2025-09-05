using Microsoft.EntityFrameworkCore;
using Orders.Domain.Aggregates;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Orders.Infrastructure.Persistence;

namespace Orders.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OrdersDbContext _dbContext;

        public OrderRepository(OrdersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task AddAsync(Order order)
        {
            _dbContext.Orders.Add(order);
            return _dbContext.SaveChangesAsync();
        }

        public Task<Order?> GetByIdAsync(OrderId id)
        {
            return _dbContext.Orders.FindAsync(id).AsTask();
        }

        public Task<List<Order>> GetAllAsync()
        {
            return _dbContext.Orders
            .Include(o => o.Items)
            .ToListAsync();
        }
    }
}