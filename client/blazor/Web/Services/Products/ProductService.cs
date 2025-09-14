using Web.Services.Products.DTOs;
using Web.Services.Products.Queries;
using Web.Services.Shared;

namespace Web.Services.Products
{
    public class ProductService
    {
        private readonly GraphQLClient _graphQLClient;
        private readonly ILogger<ProductService> _logger;

        public ProductService(GraphQLClient graphQLClient, ILogger<ProductService> logger)
        {
            _graphQLClient = graphQLClient;
            _logger = logger;
        }

        public async Task<List<ProductDto>?> GetProductsAsync()
        {
            try
            {
                var response = await _graphQLClient.QueryAsync<ProductsQueryResponse>(ProductQueries.GetProducts);
                return response?.Products;
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
                var variables = new { id };
                var response = await _graphQLClient.QueryAsync<ProductQueryResponse>(ProductQueries.GetProduct, variables);
                return response?.Product;
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
