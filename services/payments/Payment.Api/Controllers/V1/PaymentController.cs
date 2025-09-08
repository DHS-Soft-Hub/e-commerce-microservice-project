using Microsoft.AspNetCore.Mvc;
using Payment.Api.Services.Interfaces;

using Payment.Api.DTOs.Requests;
using Payment.Api.DTOs.Responses;
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
        public async Task<IActionResult> CreatePayment([FromBody] PaymentCreateRequestDto payment)
        {
            if (payment == null)
            {
                return BadRequest();
            }

            var response = await _service.AddPaymentAsync(payment);
            return Ok(response);
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

        [HttpGet]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _service.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdatePayment(Guid id, [FromBody] PaymentUpdateRequestDto payment)
        {
            if (payment == null || id == Guid.Empty)
            {
                return BadRequest();
            }

            await _service.UpdatePaymentAsync(payment);

            return Ok();
        }
    }
}