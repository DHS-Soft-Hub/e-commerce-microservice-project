using Payment.Api.Protos;
using ApiGateway.Queries.Payments;
using Grpc.Net.Client;

namespace ApiGateway.Services;

public interface IPaymentsGrpcService
{
    Task<PaymentType> CreatePaymentAsync(CreatePaymentInput input);
    Task<PaymentType> GetPaymentByIdAsync(string paymentId);
    Task<PaymentType> GetPaymentByOrderIdAsync(string orderId);
    Task<PaymentType> UpdatePaymentAsync(UpdatePaymentInput input);
    Task<string> DeletePaymentAsync(string paymentId);
    Task<List<PaymentType>> GetPaymentsAsync(int pageNumber = 1, int pageSize = 10);
    Task<List<PaymentType>> GetCustomerPaymentsAsync(string customerId, int pageNumber = 1, int pageSize = 10);
}

public class PaymentsGrpcService : IPaymentsGrpcService
{
    private readonly PaymentService.PaymentServiceClient _client;
    private readonly ILogger<PaymentsGrpcService> _logger;

    public PaymentsGrpcService(IConfiguration configuration, ILogger<PaymentsGrpcService> logger)
    {
        _logger = logger;
        var paymentServiceUrl = configuration["GrpcServices:Payments"] ?? "https://localhost:7002";
        var channel = GrpcChannel.ForAddress(paymentServiceUrl);
        _client = new PaymentService.PaymentServiceClient(channel);
    }

    public async Task<PaymentType> CreatePaymentAsync(CreatePaymentInput input)
    {
        try
        {
            var request = new PaymentCreateRequest
            {
                Payment = new PaymentCreate
                {
                    OrderId = input.OrderId,
                    TransactionId = input.TransactionId,
                    PaymentMethod = input.PaymentMethod,
                    Amount = (double)input.Amount,
                    Currency = input.Currency
                }
            };

            var response = await _client.CreatePaymentAsync(request);
            return MapToPaymentType(response.Payment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment");
            throw;
        }
    }

    public async Task<PaymentType> GetPaymentByIdAsync(string paymentId)
    {
        try
        {
            var request = new PaymentGetRequest { Id = paymentId };
            var response = await _client.GetPaymentByIdAsync(request);
            return MapToPaymentType(response.Payment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment by id: {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<PaymentType> GetPaymentByOrderIdAsync(string orderId)
    {
        try
        {
            var request = new PaymentGetRequest { Id = orderId };
            var response = await _client.GetPaymentByOrderIdAsync(request);
            return MapToPaymentType(response.Payment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment by order id: {OrderId}", orderId);
            throw;
        }
    }

    public async Task<PaymentType> UpdatePaymentAsync(UpdatePaymentInput input)
    {
        try
        {
            var request = new PaymentUpdateRequest
            {
                Payment = new PaymentUpdate
                {
                    Id = input.Id,
                    OrderId = input.OrderId,
                    TransactionId = input.TransactionId,
                    PaymentMethod = input.PaymentMethod,
                    Amount = (double)input.Amount,
                    Currency = input.Currency,
                    Status = input.Status
                }
            };

            var response = await _client.UpdatePaymentAsync(request);
            return MapToPaymentType(response.Payment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payment");
            throw;
        }
    }

    public async Task<string> DeletePaymentAsync(string paymentId)
    {
        try
        {
            var request = new PaymentDeleteRequest { Id = paymentId };
            var response = await _client.DeletePaymentAsync(request);
            return response.Id;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting payment: {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<List<PaymentType>> GetPaymentsAsync(int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var request = new PaymentListRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var call = _client.ListPayments(request);
            var payments = new List<PaymentType>();

            while (await call.ResponseStream.MoveNext(CancellationToken.None))
            {
                var response = call.ResponseStream.Current;
                payments.AddRange(response.Payments.Select(MapToPaymentType));
            }

            return payments;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payments");
            throw;
        }
    }

    public async Task<List<PaymentType>> GetCustomerPaymentsAsync(string customerId, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var request = new PaymentListCustomerRequest
            {
                CustomerId = customerId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var call = _client.ListCustomerPayments(request);
            var payments = new List<PaymentType>();

            while (await call.ResponseStream.MoveNext(CancellationToken.None))
            {
                var response = call.ResponseStream.Current;
                payments.AddRange(response.Payments.Select(MapToPaymentType));
            }

            return payments;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer payments: {CustomerId}", customerId);
            throw;
        }
    }

    private static PaymentType MapToPaymentType(Payment.Api.Protos.Payment payment)
    {
        return new PaymentType
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            TransactionId = payment.TransactionId,
            PaymentMethod = payment.PaymentMethod,
            Amount = (decimal)payment.Amount,
            Currency = payment.Currency,
            Status = payment.Status,
            CreatedAt = DateTime.TryParse(payment.CreatedAt, out var createdAt) ? createdAt : DateTime.MinValue,
            UpdatedAt = DateTime.TryParse(payment.UpdatedAt, out var updatedAt) ? updatedAt : null
        };
    }
}
