using Web.DTOs;
using System.Text;
using System.Text.Json;

namespace Web.Services
{
    public class OrderService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly JsonSerializerOptions _jsonOptions;

        public OrderService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task<OrderDto> CreateOrderAsync(List<CartItemDto> items, Guid customerId)
        {
            var request = new
            {
                CustomerId = customerId,
                Items = items.Select(item => new
                {
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Price = item.Price,
                    Currency = item.Currency,
                    Quantity = item.Quantity
                }).ToList(),
                Currency = items.FirstOrDefault()?.Currency ?? "USD"
            };

            var json = JsonSerializer.Serialize(request, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var httpClient = _httpClientFactory.CreateClient("APIGateway");
                var response = await httpClient.PostAsync("/api/orders", content);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                var orderResponse = JsonSerializer.Deserialize<OrderDto>(responseJson, _jsonOptions);
                
                return orderResponse ?? new OrderDto(
                    Guid.NewGuid(),
                    customerId,
                    items.Select(i => new OrderItemDto(
                        Guid.NewGuid(),
                        i.ProductId,
                        i.ProductName,
                        i.Price,
                        i.Currency,
                        i.Quantity
                    )).ToList(),
                    items.Sum(i => i.Price * i.Quantity),
                    "USD",
                    "Completed",
                    DateTime.UtcNow
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating order: {ex.Message}");
                throw;
            }
        }

        public async Task<OrderDto?> GetOrderAsync(Guid orderId)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("APIGateway");
                var response = await httpClient.GetAsync($"/api/orders/{orderId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<OrderDto>(json, _jsonOptions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting order: {ex.Message}");
                return null;
            }
        }
    }
}
