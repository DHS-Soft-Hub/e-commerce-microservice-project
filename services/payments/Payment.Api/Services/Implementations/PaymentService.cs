using MassTransit;
using Payment.Api.Data.Repositories;
using Payment.Api.Services.Interfaces;
using Shared.Contracts.Payments.Events;
using Payment.Api.DTOs.Responses;
using Payment.Api.DTOs.Requests;
using Payment.Api.Enums;
using Grpc.Core;
using MassTransit.Initializers;

namespace Payment.Api.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repository;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
            IPaymentRepository repository,
            IPublishEndpoint publishEndpoint,
            ILogger<PaymentService> logger)
        {
            _repository = repository;
            _publishEndpoint = publishEndpoint;
            _logger = logger;
        }

        public async Task<PaymentResponseDto> AddPaymentAsync(PaymentCreateRequestDto payment)
        {

            var newPayment = new Entities.Payment
            {
                Id = Guid.NewGuid(),
                OrderId = payment.OrderId,
                TransactionId = payment.TransactionId,
                Price = payment.Price,
                Currency = payment.Currency,
                PaymentMethod = Enum.Parse<PaymentMethods>(payment.PaymentMethod),
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            await _repository.AddPaymentAsync(newPayment);

            await _publishEndpoint.Publish(new PaymentProcessedIntegrationEvent(
                OrderId: newPayment.OrderId,
                PaymentId: newPayment.Id,
                Amount: newPayment.Price,
                Currency: newPayment.Currency,
                PaymentMethod: newPayment.PaymentMethod.ToString(),
                Status: newPayment.Status.ToString(),
                ProcessedAt: newPayment.CreatedAt
            ));

            return new PaymentResponseDto(
                Id: newPayment.Id.ToString(),
                OrderId: newPayment.OrderId.ToString(),
                TransactionId: newPayment.TransactionId,
                Status: newPayment.Status.ToString(),
                Amount: newPayment.Price,
                Currency: newPayment.Currency,
                PaymentMethod: newPayment.PaymentMethod.ToString()
            );
        }

        public async Task<PaymentResponseDto> GetPaymentByIdAsync(Guid id)
        {
            var payment = await _repository.GetPaymentByIdAsync(id);

            return new PaymentResponseDto(
                Id: payment.Id.ToString(),
                OrderId: payment.OrderId.ToString(),
                TransactionId: payment.TransactionId.ToString(),
                Status: payment.Status.ToString(),
                Amount: payment.Price,
                Currency: payment.Currency,
                PaymentMethod: payment.PaymentMethod.ToString()
            );
        }

        public async Task<IEnumerable<PaymentResponseDto>> GetAllPaymentsAsync()
        {
            var payments = await _repository.GetAllPaymentsAsync();

            return payments.Select(payment => new PaymentResponseDto(
                Id: payment.Id.ToString(),
                OrderId: payment.OrderId.ToString(),
                TransactionId: payment.TransactionId.ToString(),
                Status: payment.Status.ToString(),
                Amount: payment.Price,
                Currency: payment.Currency,
                PaymentMethod: payment.PaymentMethod.ToString()
            ));
        }

        public async Task UpdatePaymentAsync(PaymentUpdateRequestDto payment)
        {
            var existingPayment = await _repository.GetPaymentByIdAsync(payment.Id);
            if (existingPayment == null)
            {
                _logger.LogWarning("Payment with ID {PaymentId} not found.", payment.Id);
                throw new KeyNotFoundException($"Payment with ID {payment.Id} not found.");
            }

            existingPayment.OrderId = payment.OrderId;
            existingPayment.Price = payment.Price;
            existingPayment.Currency = payment.Currency;
            existingPayment.PaymentMethod = Enum.Parse<PaymentMethods>(payment.PaymentMethod);
            existingPayment.Status = Enum.Parse<PaymentStatus>(payment.Status);
            existingPayment.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdatePaymentAsync(existingPayment);
        }

        public Task DeletePaymentAsync(Guid id)
        {
            return _repository.DeletePaymentAsync(id);
        }
    }
}