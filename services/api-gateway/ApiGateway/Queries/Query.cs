using HotChocolate;
using HotChocolate.Types;

namespace ApiGateway.Queries
{
    public class Query
    {
        [GraphQLName("order")]
        public Order GetOrder([ID][GraphQLNonNullType] string orderId)
        {
            var orderQuery = new OrderQuery();
            return orderQuery.GetOrder(orderId);
        }
    }
}