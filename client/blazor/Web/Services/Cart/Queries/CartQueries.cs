namespace Web.Services.Cart.Queries
{
    public static class CartQueries
    {
        public const string GetCart = @"
            query GetCart($userId: String!, $sessionId: String!) {
                cart: getCart(userId: $userId, sessionId: $sessionId) {
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
    }
}
