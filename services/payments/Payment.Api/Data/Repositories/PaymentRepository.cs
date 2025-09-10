
using Microsoft.EntityFrameworkCore;
using Payment.Api.Data.Contexts;

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
            return await _context.Payments.FindAsync(id).AsTask();
        }

        public Task UpdatePaymentAsync(Entities.Payment payment)
        {
            _context.Payments.Update(payment);
            return _context.SaveChangesAsync();
        }
    }
}