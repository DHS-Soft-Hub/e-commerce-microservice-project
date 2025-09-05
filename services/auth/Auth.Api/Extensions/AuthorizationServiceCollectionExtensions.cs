using Auth.Api.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace Auth.Api.Extensions;

public static class AuthorizationServiceCollectionExtensions
{
    public static IServiceCollection AddPermissionPolicies(this IServiceCollection services)
    {
        services.AddAuthorization(o =>
        {
            foreach (var p in Permissions.All())
                o.AddPolicy(p, policy => policy.RequireClaim("permission", p));
        });
        return services;
    }
}