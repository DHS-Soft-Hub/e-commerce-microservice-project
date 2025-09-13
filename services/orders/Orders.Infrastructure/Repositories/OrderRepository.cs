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

        public Task AddAsync(Order order, CancellationToken cancellationToken = default)
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

        public Task<Order?> GetByIdAsync(OrderId id, CancellationToken cancellationToken = default)
        {
            return _dbContext.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }

        public Task<List<Order>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return _dbContext.Orders
            .Include(o => o.Items)
            .ToListAsync(cancellationToken);
        }

        public Task UpdateAsync(Order order, CancellationToken cancellationToken = default)
        {
            if (order == null)
            {
                return Task.FromResult(Result.Failure("Order not found."));
            }

            _dbContext.Orders.Update(order);
            return _dbContext.SaveChangesAsync();
        }

        public Task<int> GetCountByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
        {
            return _dbContext.Orders
                .Where(o => o.CustomerId == customerId)
                .CountAsync(cancellationToken);
        }
        
        public Task<List<Order>> GetByCustomerIdAsync(Guid customerId, int skip, int take, CancellationToken cancellationToken = default)
        {
            return _dbContext.Orders
                .Include(o => o.Items)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedDate)
                .Skip(skip)
                .Take(take)
                .ToListAsync(cancellationToken);
        }
    }
}