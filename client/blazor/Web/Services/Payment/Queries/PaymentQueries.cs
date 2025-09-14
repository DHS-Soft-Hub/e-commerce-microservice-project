namespace Web.Services.Payment.Queries
{
    public static class PaymentQueries
    {
        public const string GetPayment = @"
            query GetPayment($paymentId: String!) {
                payment: getPayment(paymentId: $paymentId) {
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

        public const string GetPayments = @"
            query GetPayments($pageNumber: Int!, $pageSize: Int!) {
                payments: getPayments(pageNumber: $pageNumber, pageSize: $pageSize) {
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

        public const string GetCustomerPayments = @"
            query GetCustomerPayments($customerId: String!, $pageNumber: Int!, $pageSize: Int!) {
                payments: getCustomerPayments(customerId: $customerId, pageNumber: $pageNumber, pageSize: $pageSize) {
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
    }
}
