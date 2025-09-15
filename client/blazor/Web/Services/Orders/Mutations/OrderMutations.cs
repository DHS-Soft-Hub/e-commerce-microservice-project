namespace Web.Services.Orders.Mutations
{
    public static class OrderMutations
    {
        public const string CreateOrder = @"
            mutation CreateOrder($input: CreateOrderInput!) {
                order: createOrder(input: $input) {
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

        public const string AddItemToOrder = @"
            mutation AddItemToOrder($input: AddItemToOrderInput!) {
                order: addItemToOrder(input: $input) {
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

        public const string RemoveItemFromOrder = @"
            mutation RemoveItemFromOrder($input: RemoveItemFromOrderInput!) {
                order: removeItemFromOrder(input: $input) {
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

        public const string UpdateOrderItemQuantity = @"
            mutation UpdateOrderItemQuantity($input: UpdateOrderItemQuantityInput!) {
                order: updateOrderItemQuantity(input: $input) {
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

        public const string UpdateOrderStatus = @"
            mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
                success: updateOrderStatus(input: $input)
            }";
    }
}
