namespace Web.Services.Payment.Mutations
{
    public static class PaymentMutations
    {
        public const string CreatePayment = @"
            mutation CreatePayment($input: CreatePaymentInput!) {
                payment: createPayment(input: $input) {
                    id
                    orderId
                    transactionId
                    paymentMethod
                    amount
                    currency
                    status
                    createdAt
                    updatedAt
                }
            }";

        public const string UpdatePayment = @"
            mutation UpdatePayment($input: UpdatePaymentInput!) {
                payment: updatePayment(input: $input) {
                    id
                    orderId
                    transactionId
                    paymentMethod
                    amount
                    currency
                    status
                    createdAt
                    updatedAt
                }
            }";

        public const string DeletePayment = @"
            mutation DeletePayment($paymentId: String!) {
                result: deletePayment(paymentId: $paymentId)
            }";
    }
}
