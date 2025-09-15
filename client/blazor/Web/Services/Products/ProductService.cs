using Web.Services.Products.DTOs;
using Web.Services.Products.Queries;
using Web.Services.Shared;

namespace Web.Services.Products
{
    public class ProductService
    {
        private readonly GraphQLClient _graphQLClient;
        private readonly ILogger<ProductService> _logger;
        
        // Dummy products for mocking
        private static readonly List<ProductDto> _dummyProducts = new()
        {
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000001",
                Name = "Wireless Bluetooth Headphones",
                Description = "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
                Price = 99.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
            },
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000002", 
                Name = "Smart Watch Series 8",
                Description = "Advanced smartwatch with fitness tracking, GPS, and cellular connectivity.",
                Price = 399.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
            },
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000003",
                Name = "4K Ultra HD Monitor",
                Description = "27-inch 4K monitor with HDR support, perfect for gaming and professional work.",
                Price = 299.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop"
            },
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000004",
                Name = "Mechanical Gaming Keyboard",
                Description = "RGB backlit mechanical keyboard with Cherry MX switches and programmable keys.",
                Price = 149.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop"
            },
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000005",
                Name = "Wireless Gaming Mouse",
                Description = "Precision gaming mouse with 16,000 DPI sensor and customizable buttons.",
                Price = 79.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop"
            },
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000006",
                Name = "USB-C Charging Station",
                Description = "Multi-port charging station with fast charging for all your devices.",
                Price = 49.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1609592806123-1f30e21bf497?w=500&h=500&fit=crop"
            },
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000007",
                Name = "Portable Bluetooth Speaker",
                Description = "Waterproof portable speaker with 360-degree sound and 12-hour battery.",
                Price = 59.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop"
            },
            new ProductDto
            {
                Id = "00000000-0000-0000-0000-000000000008",
                Name = "Laptop Stand with Cooling",
                Description = "Adjustable laptop stand with built-in cooling fans and ergonomic design.",
                Price = 34.99m,
                Currency = "USD",
                ImageUrl = "https://images.unsplash.com/photo-1616788494672-ec4601c4e2d3?w=500&h=500&fit=crop"
            }
        };

        public ProductService(GraphQLClient graphQLClient, ILogger<ProductService> logger)
        {
            _graphQLClient = graphQLClient;
            _logger = logger;
        }

        public async Task<List<ProductDto>?> GetProductsAsync()
        {
            try
            {
                // Mock GraphQL response with dummy products
                _logger.LogInformation("Returning mocked products data");
                
                // Simulate async operation
                await Task.Delay(100);
                
                // Return copy of dummy products to avoid reference issues
                return _dummyProducts.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Currency = p.Currency,
                    ImageUrl = p.ImageUrl
                }).ToList();
                
                // Original GraphQL call (commented out for mocking)
                // var response = await _graphQLClient.QueryAsync<ProductsQueryResponse>(ProductQueries.GetProducts);
                // return response?.Products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products");
                return null;
            }
        }

        public async Task<ProductDto?> GetProductAsync(string id)
        {
            try
            {
                // Mock GraphQL response with dummy product
                _logger.LogInformation("Returning mocked product data for ID: {ProductId}", id);
                
                // Simulate async operation
                await Task.Delay(50);
                
                // Find product in dummy data
                var product = _dummyProducts.FirstOrDefault(p => p.Id == id);
                
                if (product != null)
                {
                    // Return copy to avoid reference issues
                    return new ProductDto
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        Currency = product.Currency,
                        ImageUrl = product.ImageUrl
                    };
                }
                
                return null;
                
                // Original GraphQL call (commented out for mocking)
                // var variables = new { id };
                // var response = await _graphQLClient.QueryAsync<ProductQueryResponse>(ProductQueries.GetProduct, variables);
                // return response?.Product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product {ProductId}", id);
                return null;
            }
        }
    }

    // Response wrapper classes for GraphQL
    public class ProductQueryResponse
    {
        public ProductDto Product { get; set; } = new();
    }

    public class ProductsQueryResponse
    {
        public List<ProductDto> Products { get; set; } = new();
    }
}
