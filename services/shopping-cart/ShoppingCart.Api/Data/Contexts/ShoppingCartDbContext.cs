using Microsoft.EntityFrameworkCore;
using ShoppingCart.Api.Models.Entities;

namespace ShoppingCart.Api.Data.Contexts
{
    public class ShoppingCartDbContext : DbContext
    {
        public ShoppingCartDbContext(DbContextOptions<ShoppingCartDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cart>()
                .ToTable("Carts");

            modelBuilder.Entity<CartItem>()
                .ToTable("CartItems");
        }
    }
}