namespace ApiGateway.Queries
{
    public class Query
    {
        public Order GetOrder(string orderId)
        {
            var orderQuery = new OrderQuery();
            return orderQuery.GetOrder(orderId);
        }
    }
}