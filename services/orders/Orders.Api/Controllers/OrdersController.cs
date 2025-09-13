using Microsoft.AspNetCore.Mvc;
using Orders.Application.Commands;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;
using Orders.Application.Services;

namespace Orders.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto order)
        {
            var createdOrder = await _orderService.CreateOrderAsync(order);
            return Ok(createdOrder);
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var orders = await _orderService.GetOrdersAsync(pageNumber, pageSize);
            return Ok(orders);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetOrderById(Guid id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            
            return Ok(order);
        }
    }
}