
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

        public Task AddPaymentAsync(Models.Entities.Payment payment)
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

        public Task<IEnumerable<Models.Entities.Payment>> GetAllPaymentsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Models.Entities.Payment> GetPaymentByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpdatePaymentAsync(Models.Entities.Payment payment)
        {
            _context.Payments.Update(payment);
            return _context.SaveChangesAsync();
        }
    }
}