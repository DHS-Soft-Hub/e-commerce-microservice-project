using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Commands;

public record CreateShipmentCommand(
    Guid OrderId,
    Guid CustomerId,
    ShippingAddress Address,
    List<ShipmentItemRequest> Items) : BaseIntegrationEvent;

public record ShippingAddress(
    string Street,
    string City,
    string State,
    string ZipCode,
    string Country);

public record ShipmentItemRequest(
    Guid ProductId,
    int Quantity);