namespace Web.Services.Orders.Queries
{
    public static class OrderQueries
    {
        public const string GetOrder = @"
            query GetOrder($orderId: String!) {
                order: getOrder(orderId: $orderId) {
                    id
                    customerId
                    items {
                        id
                        productId
                        productName
                        quantity
                        unitPrice
                        currency
                    }
                    currency
                    status
                    createdAt
                    updatedAt
                    totalAmount
                }
            }";

        public const string GetOrders = @"
            query GetOrders($pageNumber: Int!, $pageSize: Int!) {
                orders: getOrders(pageNumber: $pageNumber, pageSize: $pageSize) {
                    orders {
                        id
                        customerId
                        items {
                            id
                            productId
                            productName
                            quantity
                            unitPrice
                            currency
                        }
                        currency
                        status
                        createdAt
                        updatedAt
                        totalAmount
                    }
                    totalCount
                    pageNumber
                    pageSize
                    totalPages
                }
            }";

        public const string GetOrdersByCustomer = @"
            query GetOrdersByCustomer($customerId: String!, $pageNumber: Int!, $pageSize: Int!) {
                orders: getOrdersByCustomer(customerId: $customerId, pageNumber: $pageNumber, pageSize: $pageSize) {
                    orders {
                        id
                        customerId
                        items {
                            id
                            productId
                            productName
                            quantity
                            unitPrice
                            currency
                        }
                        currency
                        status
                        createdAt
                        updatedAt
                        totalAmount
                    }
                    totalCount
                    pageNumber
                    pageSize
                    totalPages
                }
            }";
    }
}
