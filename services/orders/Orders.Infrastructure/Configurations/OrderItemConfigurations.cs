using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orders.Domain.Entities;
using Orders.Domain.ValueObjects;
using Shared.Domain.ValueObjects;

namespace Orders.Infrastructure.Configurations
{
    public class OrderItemConfigurations : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable("OrderItems");

            builder.HasKey(oi => oi.Id);

            // OrderItemId value object conversion
            builder.Property(oi => oi.Id)
                .HasConversion(
                    orderItemId => orderItemId.Value,
                    value => new OrderItemId(value))
                .ValueGeneratedOnAdd();

            // OrderId value object conversion
            builder.Property(oi => oi.OrderId)
                .HasConversion(
                    orderId => orderId.Value, 
                    value => new OrderId(value)) 
                .IsRequired();

            // ProductId value object conversion
            builder.Property(oi => oi.ProductId)
                .HasConversion(
                    productId => productId.Value, 
                    value => new ProductId(value))
                .IsRequired();

            // Basic properties
            builder.Property(oi => oi.ProductName)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(oi => oi.Quantity)
                .IsRequired();

            // Money value object - owned entity approach
            builder.OwnsOne(oi => oi.UnitPrice, money =>
            {
                money.Property(m => m.Amount)
                    .HasColumnName("UnitPrice")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                money.Property(m => m.Currency)
                    .HasColumnName("UnitPriceCurrency")
                    .HasMaxLength(3)
                    .IsRequired();
            });
        }
    }
}