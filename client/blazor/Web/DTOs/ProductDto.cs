namespace Web.DTOs
{
    public record ProductDto(
        Guid Id,
        string Name,
        string Description,
        decimal Price,
        string Currency,
        string ImageUrl);
}
