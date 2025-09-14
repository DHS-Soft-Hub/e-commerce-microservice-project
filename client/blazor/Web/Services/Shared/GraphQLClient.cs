using System.Text;
using System.Text.Json;

namespace Web.Services.Shared
{
    public class GraphQLClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<GraphQLClient> _logger;

        public GraphQLClient(IHttpClientFactory httpClientFactory, ILogger<GraphQLClient> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<T?> QueryAsync<T>(string query, object? variables = null, string? operationName = null)
            where T : class
        {
            try
            {
                using var httpClient = _httpClientFactory.CreateClient("APIGateway");
                
                var request = new GraphQLRequest
                {
                    Query = query,
                    Variables = variables,
                    OperationName = operationName
                };

                var json = JsonSerializer.Serialize(request, new JsonSerializerOptions 
                { 
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
                });
                
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await httpClient.PostAsync("/graphql", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    var graphQLResponse = JsonSerializer.Deserialize<GraphQLResponse<T>>(responseJson, new JsonSerializerOptions 
                    { 
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
                    });
                    
                    if (graphQLResponse?.Errors?.Any() == true)
                    {
                        var errorMessages = string.Join(", ", graphQLResponse.Errors.Select(e => e.Message));
                        _logger.LogError("GraphQL errors: {Errors}", errorMessages);
                        throw new GraphQLException(errorMessages);
                    }
                    
                    return graphQLResponse?.Data;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("GraphQL request failed: {StatusCode} - {Content}", response.StatusCode, errorContent);
                    throw new HttpRequestException($"GraphQL request failed: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing GraphQL query");
                throw;
            }
        }

        public async Task<T?> MutateAsync<T>(string mutation, object? variables = null, string? operationName = null)
            where T : class
        {
            return await QueryAsync<T>(mutation, variables, operationName);
        }
    }

    public class GraphQLRequest
    {
        public string Query { get; set; } = string.Empty;
        public object? Variables { get; set; }
        public string? OperationName { get; set; }
    }

    public class GraphQLResponse<T>
        where T : class
    {
        public T? Data { get; set; }
        public List<GraphQLError>? Errors { get; set; }
    }

    public class GraphQLError
    {
        public string Message { get; set; } = string.Empty;
        public List<GraphQLLocation>? Locations { get; set; }
        public List<string>? Path { get; set; }
    }

    public class GraphQLLocation
    {
        public int Line { get; set; }
        public int Column { get; set; }
    }

    public class GraphQLException : Exception
    {
        public GraphQLException(string message) : base(message) { }
        public GraphQLException(string message, Exception innerException) : base(message, innerException) { }
    }
}
