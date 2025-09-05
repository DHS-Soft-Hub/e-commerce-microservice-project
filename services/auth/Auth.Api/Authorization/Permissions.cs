namespace Auth.Api.Authorization;

public static class Permissions
{
    public static class Catalog
    {
        public const string Read  = "catalog.read";
        public const string Write = "catalog.write";
    }

    public static class Orders
    {
        public const string Read  = "orders.read";
        public const string Manage = "orders.manage";
    }

    public static IEnumerable<string> All()
    {
        yield return Catalog.Read;
        yield return Catalog.Write;
        yield return Orders.Read;
        yield return Orders.Manage;
    }
}