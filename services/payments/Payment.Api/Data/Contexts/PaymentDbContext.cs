using Microsoft.EntityFrameworkCore;
using Payment.Api.Enums;

namespace Payment.Api.Data.Contexts
{
    public class PaymentDbContext : DbContext
    {
        public PaymentDbContext(DbContextOptions<PaymentDbContext> options)
            : base(options)
        {
        }

        public DbSet<Entities.Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Entities.Payment>()
                .ToTable("Payments");

            modelBuilder.Entity<Entities.Payment>()
                .Property(p => p.Status)
                .HasConversion(
                    status => status.ToString(),
                    value => Enum.Parse<PaymentStatus>(value))
                .HasMaxLength(50);

            modelBuilder.Entity<Entities.Payment>()
                .Property(p => p.PaymentMethod)
                .HasConversion(
                    status => status.ToString(),
                    value => Enum.Parse<PaymentMethods>(value))
                .HasMaxLength(50);
        }
    }
}