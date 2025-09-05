using System.Security.Claims;
using Auth.Api.Authorization;
using Auth.Api.Entities;
using Auth.Api.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auth.Api.Data.Seed;

public static class IdentityPermissionsSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AuthUser>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("IdentityPermissionsSeeder");

        // Ensure roles
        foreach (var roleName in new[] { nameof(Roles.Admin), nameof(Roles.User) })
        {
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole(roleName));
        }

        // Add permissions to Admin
        var adminRole = await roleManager.FindByNameAsync(nameof(Roles.Admin));
        if (adminRole != null)
        {
            var existing = await roleManager.GetClaimsAsync(adminRole);
            foreach (var perm in Permissions.All())
            {
                if (!existing.Any(c => c.Type == "permission" && c.Value == perm))
                {
                    var res = await roleManager.AddClaimAsync(adminRole, new Claim("permission", perm));
                    if (!res.Succeeded)
                        logger.LogError("Failed adding {Perm}: {Err}", perm, string.Join(", ", res.Errors.Select(e => e.Description)));
                }
            }
        }

        logger.LogInformation("Role & permission seeding complete.");
    }
}