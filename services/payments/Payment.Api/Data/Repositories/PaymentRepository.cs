
using Microsoft.EntityFrameworkCore;
using Payment.Api.Data.Contexts;
using Shared.Domain.Common;

namespace Payment.Api.Data.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly PaymentDbContext _context;

        public PaymentRepository(PaymentDbContext context)
        {
            _context = context;
        }

        public Task AddPaymentAsync(Entities.Payment payment)
        {
            _context.Payments.Add(payment);
            return _context.SaveChangesAsync();
        }

        public Task DeletePaymentAsync(Guid id)
        {
            var payment = _context.Payments.Find(id);
            if (payment != null)
            {
                _context.Payments.Remove(payment);
                return _context.SaveChangesAsync();
            }
            return Task.CompletedTask;
        }

        public async Task<IEnumerable<Entities.Payment>> GetAllPaymentsAsync()
        {
            return await _context.Payments.ToListAsync();
        }

        public async Task<Entities.Payment> GetPaymentByIdAsync(Guid id)
        {
            var payment = await _context.Payments.FindAsync(id);
            return payment ?? throw new KeyNotFoundException($"Payment with ID {id} not found.");
        }

        public async Task<Entities.Payment> GetPaymentByOrderIdAsync(Guid orderId)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId);
            return payment; // Return null if not found, caller will handle it
        }

        public async Task<PaginatedResult<Entities.Payment>> GetPaymentsWithPaginationAsync(PaginationQuery paginationQuery)
        {
            var totalCount = await _context.Payments.CountAsync();
            var payments = await _context.Payments
                .Skip(paginationQuery.Skip)
                .Take(paginationQuery.Take)
                .ToListAsync();

            return new PaginatedResult<Entities.Payment>(payments, totalCount, paginationQuery.PageSize, paginationQuery.PageNumber);
        }

        public async Task<PaginatedResult<Entities.Payment>> GetCustomerPaymentsWithPaginationAsync(Guid customerId, PaginationQuery paginationQuery)
        {
            var totalCount = await _context.Payments.CountAsync(p => p.CustomerId == customerId);
            var payments = await _context.Payments
                .Where(p => p.CustomerId == customerId)
                .Skip(paginationQuery.Skip)
                .Take(paginationQuery.Take)
                .ToListAsync();

            return new PaginatedResult<Entities.Payment>(payments, totalCount, paginationQuery.PageSize, paginationQuery.PageNumber);
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _context.Payments.CountAsync();
        }

        public async Task<int> GetCustomerPaymentsCountAsync(Guid customerId)
        {
            return await _context.Payments.CountAsync(p => p.CustomerId == customerId);
        }

        public Task UpdatePaymentAsync(Entities.Payment payment)
        {
            _context.Payments.Update(payment);
            return _context.SaveChangesAsync();
        }
    }
}