namespace Web.Services.Products.Queries
{
    public static class ProductQueries
    {
        public const string GetProducts = @"
            query GetProducts {
                products {
                    id
                    name
                    description
                    price
                    currency
                    imageUrl
                }
            }";

        public const string GetProduct = @"
            query GetProduct($id: String!) {
                product(id: $id) {
                    id
                    name
                    description
                    price
                    currency
                    imageUrl
                }
            }";
    }
}
