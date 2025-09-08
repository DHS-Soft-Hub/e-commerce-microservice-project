using Microsoft.AspNetCore.Mvc;
using Payment.Api.Data.Services.Interfaces;

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
        public async Task<IActionResult> CreatePayment([FromBody] Models.Requests.PaymentRequest payment)
        {
            if (payment == null)
            {
                return BadRequest();
            }

            var paymentEntity = new Models.Entities.Payment
            {
                Id = Guid.NewGuid(),
                OrderId = payment.OrderId,
                CustomerId = payment.CustomerId,
                Price = payment.Price,
                Currency = payment.Currency,
                PaymentMethod = payment.PaymentMethod,
                CreatedAt = DateTime.UtcNow
            };

            await _service.AddPaymentAsync(paymentEntity);
            
            // Return payment response that matches Frontend expectations
            var response = new
            {
                Id = paymentEntity.Id,
                OrderId = paymentEntity.OrderId,
                CustomerId = paymentEntity.CustomerId,
                Price = paymentEntity.Price,
                Currency = paymentEntity.Currency,
                PaymentMethod = paymentEntity.PaymentMethod,
                Status = "Processed",
                CreatedAt = paymentEntity.CreatedAt
            };
            
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