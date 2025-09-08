using MassTransit;
using Payment.Api.Data.Repositories;
using Payment.Api.Data.Services.Interfaces;
using Payment.Api.Events;

namespace Payment.Api.Data.Services.Implementations
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

        public Task<Models.Entities.Payment> GetPaymentByIdAsync(Guid id)
        {
            return _repository.GetPaymentByIdAsync(id);
        }

        public Task<IEnumerable<Models.Entities.Payment>> GetAllPaymentsAsync()
        {
            return _repository.GetAllPaymentsAsync();
        }

        public async Task AddPaymentAsync(Models.Entities.Payment payment)
        {
            await _repository.AddPaymentAsync(payment);
            await _publishEndpoint.Publish(new PaymentProcessedIntegrationEvent
            (
                OrderId: payment.OrderId,
                PaymentId: payment.Id,
                Price: payment.Price,
                Currency: "USD",
                Status: "Processed",
                ProcessedAt: DateTime.UtcNow
            ));
        }

        public Task UpdatePaymentAsync(Models.Entities.Payment payment)
        {
            return _repository.UpdatePaymentAsync(payment);
        }

        public Task DeletePaymentAsync(Guid id)
        {
            return _repository.DeletePaymentAsync(id);
        }
    }
}