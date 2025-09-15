using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orders.Domain.Aggregates;
using Orders.Domain.Enums;
using Orders.Domain.ValueObjects;
using Shared.Domain.ValueObjects;

namespace Orders.Infrastructure.Configurations
{
    public class OrderConfigurations : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");

            builder.HasKey(o => o.Id);

            // OrderId value object conversion
            builder.Property(o => o.Id)
                .HasConversion(
                    orderId => orderId.Value,
                    value => new OrderId(value))
                .ValueGeneratedOnAdd();

            // CustomerId value object conversion
            builder.Property(o => o.CustomerId)
                .HasConversion(
                    customerId => customerId.Value, 
                    value => new CustomerId(value)) 
                .IsRequired();

            // Money value object - owned entity approach
            builder.OwnsOne(o => o.TotalPrice, money =>
            {
                money.Property(m => m.Amount)
                    .HasColumnName("TotalPrice")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                money.Property(m => m.Currency)
                    .HasColumnName("Currency")
                    .HasMaxLength(3)
                    .IsRequired();
            });

            // Order status enum conversion
            builder.Property(o => o.Status)
                .HasConversion(
                    status => status.ToString(),
                    value => Enum.Parse<OrderStatus>(value))
                .HasMaxLength(20)
                .IsRequired();

            // PaymentId nullable value object
            builder.Property(o => o.PaymentId)
                .HasConversion(
                    paymentId => paymentId != null ? paymentId.Value : (Guid?)null,
                    value => value.HasValue ? new PaymentId(value.Value) : null)
                .IsRequired(false);

            // ShipmentId nullable value object
            builder.Property(o => o.ShipmentId)
                .HasConversion(
                    shipmentId => shipmentId != null ? shipmentId.Value : (Guid?)null,
                    value => value.HasValue ? new ShipmentId(value.Value) : null)
                .IsRequired(false);

            // DateTime properties
            builder.Property(o => o.CreatedDate)
                .IsRequired();

            builder.Property(o => o.UpdatedDate)
                .IsRequired();

            // Relationship with OrderItems
            builder.HasMany(o => o.Items)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}