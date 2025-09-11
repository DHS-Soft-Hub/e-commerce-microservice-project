using Web.DTOs;
using System.Text;
using System.Text.Json;

namespace Web.Services
{
    public class PaymentService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly JsonSerializerOptions _jsonOptions;

        public PaymentService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task<Guid> ProcessPaymentAsync(Guid orderId, Guid customerId, decimal price, string currency, string paymentMethod)
        {
            var request = new
            {
                OrderId = orderId,
                CustomerId = customerId,
                Price = price,
                Currency = currency,
                PaymentMethod = paymentMethod
            };

            var json = JsonSerializer.Serialize(request, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var httpClient = _httpClientFactory.CreateClient("APIGateway");
                var response = await httpClient.PostAsync("/api/v1/payment", content);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                var paymentResponse = JsonSerializer.Deserialize<JsonElement>(responseJson, _jsonOptions);
                
                // Extract payment ID from response
                if (paymentResponse.TryGetProperty("id", out var idProperty))
                {
                    return Guid.Parse(idProperty.GetString() ?? Guid.NewGuid().ToString());
                }
                
                return Guid.NewGuid();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing payment: {ex.Message}");
                throw;
            }
        }
    }
}
