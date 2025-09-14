using ApiGateway.Queries.Payments;
using ApiGateway.Services;

namespace ApiGateway.Queries.Payments;

[ExtendObjectType(nameof(Query))]
public class PaymentsQuery
{
    /// <summary>
    /// Get a payment by its ID
    /// </summary>
    public async Task<PaymentType> GetPaymentAsync(
        [Service] IPaymentsGrpcService paymentsService,
        string paymentId) =>
        await paymentsService.GetPaymentByIdAsync(paymentId);

    /// <summary>
    /// Get paginated list of payments
    /// </summary>
    public async Task<List<PaymentType>> GetPaymentsAsync(
        [Service] IPaymentsGrpcService paymentsService,
        int pageNumber = 1,
        int pageSize = 10) =>
        await paymentsService.GetPaymentsAsync(pageNumber, pageSize);

    /// <summary>
    /// Get payments for a specific customer
    /// </summary>
    public async Task<List<PaymentType>> GetCustomerPaymentsAsync(
        [Service] IPaymentsGrpcService paymentsService,
        string customerId,
        int pageNumber = 1,
        int pageSize = 10) =>
        await paymentsService.GetCustomerPaymentsAsync(customerId, pageNumber, pageSize);
}

[ExtendObjectType(nameof(Mutation))]
public class PaymentsMutation
{
    /// <summary>
    /// Create a new payment
    /// </summary>
    public async Task<PaymentType> CreatePaymentAsync(
        [Service] IPaymentsGrpcService paymentsService,
        CreatePaymentInput input) =>
        await paymentsService.CreatePaymentAsync(input);

    /// <summary>
    /// Update an existing payment
    /// </summary>
    public async Task<PaymentType> UpdatePaymentAsync(
        [Service] IPaymentsGrpcService paymentsService,
        UpdatePaymentInput input) =>
        await paymentsService.UpdatePaymentAsync(input);

    /// <summary>
    /// Delete a payment
    /// </summary>
    public async Task<string> DeletePaymentAsync(
        [Service] IPaymentsGrpcService paymentsService,
        string paymentId) =>
        await paymentsService.DeletePaymentAsync(paymentId);
}
