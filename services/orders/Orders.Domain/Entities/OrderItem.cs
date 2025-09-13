using Orders.Domain.ValueObjects;
using Shared.Domain.Entities;
using Shared.Domain.Common;
using Shared.Domain.ValueObjects;

namespace Orders.Domain.Entities
{
    public sealed class OrderItem : BaseEntity<OrderItemId>
    {
        public OrderId OrderId { get; private set; }
        public ProductId ProductId { get; private set; }
        public string ProductName { get; private set; } = string.Empty;
        public int Quantity { get; private set; }
        public Money UnitPrice { get; private set; } = null!;

        private OrderItem(
            OrderId orderId,
            ProductId productId,
            string productName,
            int quantity,
            Money unitPrice) 
            : base(new OrderItemId())
        {
            OrderId = orderId;
            ProductId = productId;
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }

        // parameterless constructor for EF Core
        private OrderItem() : base(new OrderItemId())
        {
            OrderId = new OrderId();
            ProductId = new ProductId();
            ProductName = string.Empty;
            Quantity = 0;
            UnitPrice = Money.Zero("EUR");
        }

        /// <summary>
        /// Factory method to create a new OrderItem instance.
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="productId"></param>
        /// <param name="productName"></param>
        /// <param name="quantity"></param>
        /// <param name="unitPrice"></param>
        /// <returns></returns>
        public static Result<OrderItem> Create(
            OrderId orderId,
            ProductId productId,
            string productName,
            int quantity,
            Money unitPrice)
        {
            if (quantity <= 0)
            {
                return Result<OrderItem>.Failure("Quantity must be greater than zero.");
            }

            if (unitPrice.Amount < 0)
            {
                return Result<OrderItem>.Failure("Unit price cannot be negative.");
            }

            var orderItem = new OrderItem(orderId, productId, productName, quantity, unitPrice);
            return Result<OrderItem>.Success(orderItem);
        }

        /// <summary>
        /// Calculates the total price for this order item.
        /// Validates that quantity is greater than zero and unit price is non-negative.
        /// </summary>
        /// <returns></returns>
        public Result<Money> GetTotal()
        {
            if (Quantity <= 0)
            {
                return Result<Money>.Failure("Quantity must be greater than zero.");
            }

            if (UnitPrice.Amount < 0)
            {
                return Result<Money>.Failure("Unit price cannot be negative.");
            }

            Money total = UnitPrice.Multiply(Quantity);
            return Result<Money>.Success(total);
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
