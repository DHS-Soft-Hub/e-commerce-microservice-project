namespace Web.Services.Cart.Mutations
{
    public static class CartMutations
    {
        public const string AddToCart = @"
            mutation AddToCart($input: AddToCartInput!) {
                cart: addToCart(input: $input) {
                    userId
                    sessionId
                    items {
                        productId
                        productName
                        quantity
                        price
                        currency
                    }
                    totalPrice
                    currency
                }
            }";

        public const string RemoveFromCart = @"
            mutation RemoveFromCart($input: RemoveFromCartInput!) {
                cart: removeFromCart(input: $input) {
                    userId
                    sessionId
                    items {
                        productId
                        productName
                        quantity
                        price
                        currency
                    }
                    totalPrice
                    currency
                }
            }";

        public const string UpdateItemQuantity = @"
            mutation UpdateItemQuantity($input: UpdateItemQuantityInput!) {
                cart: updateItemQuantity(input: $input) {
                    userId
                    sessionId
                    items {
                        productId
                        productName
                        quantity
                        price
                        currency
                    }
                    totalPrice
                    currency
                }
            }";

        public const string Checkout = @"
            mutation Checkout($input: CheckoutInput!) {
                result: checkout(input: $input) {
                    orderId
                    success
                    message
                }
            }";
    }
}
