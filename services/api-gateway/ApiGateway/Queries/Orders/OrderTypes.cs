namespace ApiGateway.Queries.Orders;

public class OrderType
{
    public string Id { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public List<OrderItemType> Items { get; set; } = new();
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public decimal TotalAmount { get; set; }
}

public class OrderItemType
{
    public string Id { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string Currency { get; set; } = string.Empty;
}

public class CreateOrderItemInput
{
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string Currency { get; set; } = string.Empty;
}

public class CreateOrderInput
{
    public string CustomerId { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public List<CreateOrderItemInput> Items { get; set; } = new();
}

public class AddItemToOrderInput
{
    public string OrderId { get; set; } = string.Empty;
    public CreateOrderItemInput Item { get; set; } = new();
}

public class RemoveItemFromOrderInput
{
    public string OrderId { get; set; } = string.Empty;
    public string ItemId { get; set; } = string.Empty;
}

public class UpdateOrderItemQuantityInput
{
    public string OrderId { get; set; } = string.Empty;
    public string ItemId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class UpdateOrderStatusInput
{
    public string OrderId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class PaginatedOrdersType
{
    public List<OrderType> Orders { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
