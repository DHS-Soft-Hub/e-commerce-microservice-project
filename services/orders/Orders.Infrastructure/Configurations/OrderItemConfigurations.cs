using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orders.Domain.Entities;
using Orders.Domain.ValueObjects;

namespace Orders.Infrastructure.Configurations
{
    public class OrderItemConfigurations : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable("OrderItems");

            builder.HasKey(oi => oi.Id);

            builder.Property(oi => oi.Id)
                .HasConversion(
                    orderItemId => orderItemId.Value,
                    value => (OrderItemId)value)
                .ValueGeneratedOnAdd();

            builder.Property(oi => oi.OrderId)
                .HasConversion(
                    orderId => orderId.Value, 
                    value => (OrderId)value) 
                .IsRequired();

            builder.Property(oi => oi.ProductId)
                .HasConversion(
                    productId => productId.Value, 
                    value => (ProductId)value)
                .IsRequired();

            builder.Property(oi => oi.Quantity)
                .IsRequired();

            builder.Property(oi => oi.UnitPrice)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(oi => oi.ProductName)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(oi => oi.Currency)
                .HasMaxLength(3)
                .IsRequired();
        }
    }
}