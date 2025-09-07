using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Api.Commands.AddItemToCartCommand;
using ShoppingCart.Api.Commands.PrepareCheckoutCommand;
using ShoppingCart.Api.Commands.RemoveItemFromCartCommand;
using ShoppingCart.Api.Data.Requests;
using ShoppingCart.Api.Queries;
using ShoppingCart.Api.Services;

namespace ShoppingCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICartSessionService _sessionService;

    public CartController(IMediator mediator, ICartSessionService sessionService)
    {
        _mediator = mediator;
        _sessionService = sessionService;
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItemToCart([FromBody] AddItemToCartRequest request)
    {
        // var userId = User.Identity?.IsAuthenticated == true ? 
        //     Guid.Parse(User.FindFirst("sub")?.Value ?? "") : null;
        var userId = new Guid("00000000-0000-0000-0000-000000000000");
        
        var sessionId = await _sessionService.GetOrCreateSessionId(HttpContext);

        var command = new AddItemToCartCommand(
            userId, sessionId, request.ProductId, 
            request.ProductName, request.Price, request.Quantity);

        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItemFromCart(Guid productId)
    {
        // var userId = User.Identity?.IsAuthenticated == true ? 
        //     Guid.Parse(User.FindFirst("sub")?.Value ?? "") : null;
        var userId = new Guid("00000000-0000-0000-0000-000000000000");
        
        var sessionId = await _sessionService.GetOrCreateSessionId(HttpContext);

        var command = new RemoveItemFromCartCommand(userId, sessionId, productId);
        await _mediator.Send(command);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        // var userId = User.Identity?.IsAuthenticated == true ? 
        //     Guid.Parse(User.FindFirst("sub")?.Value ?? "") : null;
        var userId = new Guid("00000000-0000-0000-0000-000000000000");
        
        var sessionId = await _sessionService.GetOrCreateSessionId(HttpContext);

        var query = new GetCartQuery(userId, sessionId);
        var cart = await _mediator.Send(query);
        return Ok(cart);
    }

    [HttpPost("checkout")]
    [Authorize]
    public async Task<IActionResult> PrepareCheckout()
    {
        var userId = Guid.Parse(User.FindFirst("sub")?.Value ?? "");
        var sessionId = await _sessionService.GetOrCreateSessionId(HttpContext);

        // Merge session cart with user cart if needed
        await _sessionService.MergeAnonymousCartWithUserCart(sessionId, userId);

        var command = new PrepareCheckoutCommand(userId);
        var checkoutData = await _mediator.Send(command);
        
        return Ok(checkoutData);
    }
}