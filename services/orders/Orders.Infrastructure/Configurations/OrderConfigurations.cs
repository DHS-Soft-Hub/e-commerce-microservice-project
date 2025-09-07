using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orders.Domain.Aggregates;
using Orders.Domain.ValueObjects;

namespace Orders.Infrastructure.Configurations
{
    public class OrderConfigurations : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");

            builder.HasKey(o => o.Id);

            builder.Property(o => o.Id)
                .HasConversion(
                    orderId => orderId.Value,
                    value => (OrderId)value)    
                .ValueGeneratedOnAdd();

            builder.Property(o => o.CustomerId)
                .HasConversion(
                    customerId => customerId.Value, 
                    value => (CustomerId)value) 
                .IsRequired();

            builder.Property(o => o.TotalPrice)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(o => o.Currency)
                .HasMaxLength(3)
                .IsRequired();

            builder.Property(o => o.Status)
                .IsRequired();

            builder.Property(o => o.CreatedDate)
                .IsRequired();

            builder.HasMany(o => o.Items)
                .WithOne()
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}