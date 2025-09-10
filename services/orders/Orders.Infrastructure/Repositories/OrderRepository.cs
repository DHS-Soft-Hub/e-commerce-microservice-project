using Microsoft.EntityFrameworkCore;
using Orders.Domain.Aggregates;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Orders.Infrastructure.Persistence;
using Shared.Domain.Common;

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
            if (order == null)
            {
                return Task.FromResult(Result.Failure("Order not found."));
            }
            
            if (_dbContext.Orders.Any(o => o.Id == order.Id))
            {
                return Task.FromResult(Result.Failure("Order with the same ID already exists."));
            }

            _dbContext.Orders.Add(order);
            return _dbContext.SaveChangesAsync();
        }

        public Task<Order?> GetByIdAsync(OrderId id)
        {
            return _dbContext.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public Task<List<Order>> GetAllAsync()
        {
            return _dbContext.Orders
            .Include(o => o.Items)
            .ToListAsync();
        }

        public Task UpdateAsync(Order order)
        {
            if (order == null)
            {
                return Task.FromResult(Result.Failure("Order not found."));
            }

            _dbContext.Orders.Update(order);
            return _dbContext.SaveChangesAsync();
        }
    }
}