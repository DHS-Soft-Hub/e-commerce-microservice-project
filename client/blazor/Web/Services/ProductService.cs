using Web.DTOs;
using System.Text;
using System.Text.Json;

namespace Web.Services
{
    public class ProductService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly JsonSerializerOptions _jsonOptions;

        public ProductService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task<List<ProductDto>> GetProductsAsync()
        {
            // Return dummy products for now
            await Task.Delay(100); // Simulate API call
            
            return new List<ProductDto>
            {
                new ProductDto(
                    Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    "Wireless Headphones",
                    "High-quality wireless headphones with noise cancellation",
                    199.99m,
                    "USD",
                    "https://via.placeholder.com/300x200?text=Headphones"
                ),
                new ProductDto(
                    Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    "Smartphone",
                    "Latest smartphone with advanced camera and performance",
                    799.99m,
                    "USD",
                    "https://via.placeholder.com/300x200?text=Smartphone"
                ),
                new ProductDto(
                    Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    "Laptop",
                    "High-performance laptop for work and gaming",
                    1299.99m,
                    "USD",
                    "https://via.placeholder.com/300x200?text=Laptop"
                ),
                new ProductDto(
                    Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    "Tablet",
                    "Lightweight tablet perfect for reading and entertainment",
                    399.99m,
                    "USD",
                    "https://via.placeholder.com/300x200?text=Tablet"
                ),
                new ProductDto(
                    Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    "Smart Watch",
                    "Feature-rich smartwatch with health monitoring",
                    249.99m,
                    "USD",
                    "https://via.placeholder.com/300x200?text=Smart+Watch"
                ),
                new ProductDto(
                    Guid.Parse("66666666-6666-6666-6666-666666666666"),
                    "Wireless Speaker",
                    "Portable wireless speaker with premium sound quality",
                    149.99m,
                    "USD",
                    "https://via.placeholder.com/300x200?text=Speaker"
                )
            };
        }
    }
}
