using Web.Services.Payment.DTOs;
using Web.Services.Payment.Queries;
using Web.Services.Payment.Mutations;
using Web.Services.Shared;

namespace Web.Services.Payment
{
    public class PaymentService
    {
        private readonly GraphQLClient _graphQLClient;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(GraphQLClient graphQLClient, ILogger<PaymentService> logger)
        {
            _graphQLClient = graphQLClient;
            _logger = logger;
        }

        public async Task<PaymentDto?> GetPaymentAsync(string paymentId)
        {
            try
            {
                var variables = new { paymentId };
                var response = await _graphQLClient.QueryAsync<PaymentQueryResponse>(PaymentQueries.GetPayment, variables);
                return response?.Payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment {PaymentId}", paymentId);
                return null;
            }
        }

        public async Task<PaymentDto?> GetPaymentByOrderIdAsync(string orderId)
        {
            try
            {
                var variables = new { orderId };
                var response = await _graphQLClient.QueryAsync<PaymentQueryResponse>(PaymentQueries.GetPaymentByOrderId, variables);
                return response?.Payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment for order {OrderId}", orderId);
                return null;
            }
        }

        public async Task<List<PaymentDto>?> GetPaymentsAsync(int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var variables = new { pageNumber, pageSize };
                var response = await _graphQLClient.QueryAsync<PaymentsQueryResponse>(PaymentQueries.GetPayments, variables);
                return response?.Payments;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payments");
                return null;
            }
        }

        public async Task<List<PaymentDto>?> GetCustomerPaymentsAsync(string customerId, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var variables = new { customerId, pageNumber, pageSize };
                var response = await _graphQLClient.QueryAsync<PaymentsQueryResponse>(PaymentQueries.GetCustomerPayments, variables);
                return response?.Payments;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payments for customer {CustomerId}", customerId);
                return null;
            }
        }

        public async Task<PaymentDto?> CreatePaymentAsync(CreatePaymentInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<PaymentMutationResponse>(PaymentMutations.CreatePayment, variables);
                return response?.Payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment for order {OrderId}", input.OrderId);
                return null;
            }
        }

        public async Task<PaymentDto?> UpdatePaymentAsync(UpdatePaymentInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<PaymentMutationResponse>(PaymentMutations.UpdatePayment, variables);
                return response?.Payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment {PaymentId}", input.Id);
                return null;
            }
        }

        public async Task<bool> DeletePaymentAsync(string paymentId)
        {
            try
            {
                var variables = new { paymentId };
                var response = await _graphQLClient.MutateAsync<PaymentDeleteResponse>(PaymentMutations.DeletePayment, variables);
                return !string.IsNullOrEmpty(response?.Result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting payment {PaymentId}", paymentId);
                return false;
            }
        }

        public async Task<PaymentDto?> ProcessPaymentAsync(string orderId, PaymentMethod paymentMethod, decimal amount, string currency)
        {
            try
            {
                var transactionId = Guid.NewGuid().ToString();
                var input = new CreatePaymentInput
                {
                    OrderId = orderId,
                    TransactionId = transactionId,
                    PaymentMethod = paymentMethod.ToString(),
                    Amount = amount,
                    Currency = currency
                };

                return await CreatePaymentAsync(input);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment for order {OrderId}", orderId);
                return null;
            }
        }
    }

    // Response wrapper classes for GraphQL
    public class PaymentQueryResponse
    {
        public PaymentDto Payment { get; set; } = new();
    }

    public class PaymentsQueryResponse
    {
        public List<PaymentDto> Payments { get; set; } = new();
    }

    public class PaymentMutationResponse
    {
        public PaymentDto Payment { get; set; } = new();
    }

    public class PaymentDeleteResponse
    {
        public string Result { get; set; } = string.Empty;
    }
}
