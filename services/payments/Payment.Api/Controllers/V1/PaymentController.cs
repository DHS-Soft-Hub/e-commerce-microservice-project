using Microsoft.AspNetCore.Mvc;
using Payment.Api.Data.Services.Interfaces;

using Payment.Api.Contracts.Requests;
using Payment.Api.Contracts.Responses;
using Payment.Api.Enums;

namespace Payment.Api.Controllers.V1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentController(IPaymentService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest payment)
        {
            if (payment == null)
            {
                return BadRequest();
            }

            var paymentEntity = new Entities.Payment
            {
                Id = Guid.NewGuid(),
                OrderId = payment.OrderId,
                TransactionId = payment.TransactionId,
                Status = PaymentStatus.Processing,
                Price = payment.Price,
                Currency = payment.Currency,
                PaymentMethod = (PaymentMethods)Enum.Parse(typeof(PaymentMethods), payment.PaymentMethod, true),
                CreatedAt = DateTime.UtcNow
            };

            await _service.AddPaymentAsync(paymentEntity);

            // Return payment response that matches Frontend expectations
            var response = new PaymentResponse(
                Id: paymentEntity.Id.ToString(),
                Amount: paymentEntity.Price,
                Currency: paymentEntity.Currency,
                PaymentMethod: nameof(paymentEntity.PaymentMethod),
                Status: paymentEntity.Status.ToString()
            );

            return CreatedAtAction(nameof(GetPaymentById), new { id = paymentEntity.Id }, response);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPaymentById(Guid id)
        {
            var payment = await _service.GetPaymentByIdAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            return Ok(payment);
        }
    }
}