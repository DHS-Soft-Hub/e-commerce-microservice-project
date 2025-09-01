namespace ApiGateway.Queries
{
  public class Order
  {
    public string OrderId { get; set; }
    public Customer Customer { get; set; }
    public List<OrderItem> OrderItems { get; set; }
    public Payment Payment { get; set; }
    public Shipping Shipping { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Totals Totals { get; set; }
  }

  public class Customer
  {
    public string CustomerId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public Address Address { get; set; }
  }

  public class Address
  {
    public string Street { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
  }

  public class OrderItem
  {
    public string ProductId { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public Money Price { get; set; }
    public Money Total { get; set; }
  }

  public class Payment
  {
    public string Method { get; set; }
    public string Status { get; set; }
    public string TransactionId { get; set; }
  }

  public class Shipping
  {
    public string Method { get; set; }
    public string Status { get; set; }
    public string TrackingNumber { get; set; }
    public Address Address { get; set; }
  }

  public class Totals
  {
    public Money Subtotal { get; set; }
    public Money Tax { get; set; }
    public Money GrandTotal { get; set; }
  }

  public class Money
  {
    public string Currency { get; set; }
    public decimal Amount { get; set; }
  }
}