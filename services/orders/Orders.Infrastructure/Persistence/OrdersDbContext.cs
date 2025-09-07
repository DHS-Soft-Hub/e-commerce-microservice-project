using Microsoft.EntityFrameworkCore;
using Orders.Application.Sagas;
using Orders.Domain.Aggregates;
using Orders.Domain.Entities;
using Orders.Infrastructure.Configurations;
using Orders.Infrastructure.Persistence.Interceptors;
using Shared.Domain.Events;

namespace Orders.Infrastructure.Persistence
{
    public class OrdersDbContext : DbContext
    {
        private readonly PublishDomainEventsInterceptor _publishDomainEventsInterceptor;

        public OrdersDbContext(
            DbContextOptions<OrdersDbContext> options,
            PublishDomainEventsInterceptor publishDomainEventsInterceptor)
            : base(options)
        {
            _publishDomainEventsInterceptor = publishDomainEventsInterceptor;
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<OrderCreateSagaStateData> OrderCreateSagaState { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply entity configurations
            modelBuilder
                .Ignore<List<IDomainEvent>>()
                .ApplyConfiguration(new OrderConfigurations());
            modelBuilder
                .Ignore<List<IDomainEvent>>()
                .ApplyConfiguration(new OrderItemConfigurations());

            // Apply saga state configuration
            modelBuilder.Entity<OrderCreateSagaStateData>(b =>
            {
                b.HasKey(x => x.CorrelationId);
                b.Property(x => x.CorrelationId).ValueGeneratedNever();
                b.ToTable("OrderCreateSagaStates");
            });

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.AddInterceptors(_publishDomainEventsInterceptor);
            base.OnConfiguring(optionsBuilder);
        }
    }
}