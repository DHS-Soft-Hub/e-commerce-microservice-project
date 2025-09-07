using Shared.Domain.Events;

namespace Orders.Application.Messaging.Contracts;

public record CreateShipmentCommand(
    Guid OrderId,
    Guid CustomerId,
    ShippingAddress Address,
    List<OrderItemRequest> Items) : BaseIntegrationEvent;

public record ShippingAddress(
    string Street,
    string City,
    string State,
    string ZipCode,
    string Country);
