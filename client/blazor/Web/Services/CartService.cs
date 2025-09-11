using Web.DTOs;
using System.Text;
using System.Text.Json;

namespace Web.Services
{
    public class CartService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly JsonSerializerOptions _jsonOptions;

        public CartService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task AddToCartAsync(Guid productId, string productName, decimal price, int quantity = 1)
        {
            var request = new
            {
                ProductId = productId,
                ProductName = productName,
                Price = price,
                Quantity = quantity
            };

            var json = JsonSerializer.Serialize(request, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var httpClient = _httpClientFactory.CreateClient("APIGateway");
                var response = await httpClient.PostAsync("/api/cart/items", content);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                // Handle error - for demo purposes, we'll just log it
                Console.WriteLine($"Error adding to cart: {ex.Message}");
            }
        }

        public async Task<CartDto> GetCartAsync()
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("APIGateway");
                var response = await httpClient.GetAsync("/api/cart");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var cart = JsonSerializer.Deserialize<CartDto>(json, _jsonOptions);
                return cart ?? new CartDto(new List<CartItemDto>(), 0, "USD");
            }
            catch (Exception ex)
            {
                // Handle error - return empty cart for demo
                Console.WriteLine($"Error getting cart: {ex.Message}");
                return new CartDto(new List<CartItemDto>(), 0, "USD");
            }
        }

        public async Task RemoveFromCartAsync(Guid productId)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("APIGateway");
                var response = await httpClient.DeleteAsync($"/api/cart/items/{productId}");
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error removing from cart: {ex.Message}");
            }
        }

        public async Task ClearCartAsync()
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("APIGateway");
                var response = await httpClient.DeleteAsync("/api/cart");
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error clearing cart: {ex.Message}");
            }
        }
    }
}
