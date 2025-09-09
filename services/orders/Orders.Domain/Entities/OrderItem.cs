using Orders.Domain.ValueObjects;
using Shared.Domain.Entities;
using Shared.Domain.Common;

namespace Orders.Domain.Entities
{
    public sealed class OrderItem : BaseEntity<OrderItemId>
    {
        public OrderId OrderId { get; private set; }
        public ProductId ProductId { get; private set; }
        public string ProductName { get; private set; } = string.Empty;
        public int Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public string Currency { get; private set; } = string.Empty;

        public OrderItem(
            OrderItemId id,
            OrderId orderId,
            ProductId productId,
            string productName,
            int quantity,
            decimal unitPrice,
            string currency) : base(id)
        {
            OrderId = orderId;
            ProductId = productId;
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
            Currency = currency;
        }

        /// <summary>
        /// Calculates the total price for this order item.
        /// Validates that quantity is greater than zero and unit price is non-negative.
        /// </summary>
        /// <returns></returns>
        public Result<decimal> GetTotal()
        {
            if (Quantity <= 0)
            {
                return Result<decimal>.Failure("Quantity must be greater than zero.");
            }

            if (UnitPrice < 0)
            {
                return Result<decimal>.Failure("Unit price cannot be negative.");
            }

            decimal total = Quantity * UnitPrice;
            return Result<decimal>.Success(total);
        }

        /// <summary>
        /// Updates the quantity of the order item.
        /// Validates that the new quantity is greater than zero.
        /// </summary>
        /// <param name="quantity">The new quantity.</param>
        /// <returns>A Result indicating success or failure.</returns>
        public Result UpdateQuantity(int quantity)
        {
            if (quantity <= 0)
            {
                return Result.Failure("Quantity must be greater than zero.");
            }

            Quantity = quantity;
            return Result.Success();
        }
    }
}
