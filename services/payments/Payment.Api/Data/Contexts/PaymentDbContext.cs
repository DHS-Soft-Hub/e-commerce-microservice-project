using Microsoft.EntityFrameworkCore;

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
                .HasKey(p => p.Id);

            modelBuilder.Entity<Entities.Payment>()
                .Property(p => p.Status)
                .HasConversion<string>()
                .HasMaxLength(50);

            modelBuilder.Entity<Entities.Payment>()
                .Property(p => p.PaymentMethod)
                .HasConversion<string>()
                .HasMaxLength(50);
        }
    }
}