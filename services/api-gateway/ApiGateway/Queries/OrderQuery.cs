namespace ApiGateway.Queries
{
  public class OrderQuery
  {
    public Order GetOrder(string orderId)
    {
      // Simulate fetching order data from a database or external service
      return new Order
      {
        OrderId = orderId,
        Customer = new Customer
        {
          CustomerId = "CUST-101",
          Name = "John Doe",
          Email = "john.doe@example.com",
          Address = new Address
          {
            Street = "123 Main St",
            City = "Sofia",
            PostalCode = "1000",
            Country = "Bulgaria"
          }
        },
        OrderItems = new List<OrderItem>
        {
          new OrderItem
          {
            ProductId = "PROD-501",
            Name = "Wireless Mouse",
            Quantity = 2,
            Price = new Money
            {
              Currency = "EUR",
              Amount = 25.99m
            },
            Total = new Money
            {
              Currency = "EUR",
              Amount = 51.98m
            }
          },
          new OrderItem
          {
            ProductId = "PROD-502",
            Name = "Mechanical Keyboard",
            Quantity = 1,
            Price = new Money
            {
              Currency = "EUR",
              Amount = 79.99m
            },
            Total = new Money
            {
              Currency = "EUR",
              Amount = 79.99m
            }
          }
        },
        Payment = new Payment
        {
          Method = "CreditCard",
          Status = "Paid",
          TransactionId = "TXN-9001"
        },
        Shipping = new Shipping
        {
          Method = "Standard",
          Status = "Shipped",
          TrackingNumber = "TRACK-12345",
          Address = new Address
          {
            Street = "123 Main St",
            City = "Sofia",
            PostalCode = "1000",
            Country = "Bulgaria"
          }
        },
        Status = "Completed",
        CreatedAt = DateTime.UtcNow.AddDays(-5),
        UpdatedAt = DateTime.UtcNow.AddDays(-3),
        Totals = new Totals
        {
          Subtotal = new Money
          {
            Currency = "EUR",
            Amount = 131.97m
          },
          Tax = new Money
          {
            Currency = "EUR",
            Amount = 26.39m
          },
          GrandTotal = new Money
          {
            Currency = "EUR",
            Amount = 158.36m
          }
        }
      };
    }
  }
}