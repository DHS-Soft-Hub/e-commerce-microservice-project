namespace Auth.Api.Data.Configurations;

using Auth.Api.Entities;
using Auth.Api.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class RolesConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(
            new IdentityRole { Name = Roles.Admin.ToString() },
            new IdentityRole { Name = Roles.User.ToString() }
        );
    }
}