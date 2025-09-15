using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Authorization;
using Web.Components;
using Web.Services;
using Web.Services.Auth;
using Web.Services.Cart;
using Web.Services.Orders;
using Web.Services.Payment;
using Web.Services.Products;
using Web.Services.Shared;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add Authorization (no authentication schemes needed for custom provider)
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AuthenticatedUsers", policy =>
        policy.RequireAuthenticatedUser());
    
    // Set default policy to handle authorization without automatic redirects
    options.DefaultPolicy = new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
        
    // Handle failed authorization without redirects
    options.InvokeHandlersAfterFailure = false;
});
builder.Services.AddCascadingAuthenticationState();

// Add services bootstrap.
builder.Services.AddBlazorBootstrap();

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddOutputCache();

// Add Services
builder.Services.AddBlazoredLocalStorage();

// Configure HttpClient with base address
builder.Services.AddHttpClient("APIGateway", client =>
{
    client.BaseAddress = new Uri("http://localhost:5000"); // API Gateway URL
});

// Register GraphQL Client
builder.Services.AddScoped<GraphQLClient>();

// Register Authentication Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CustomAuthStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider>(provider => provider.GetRequiredService<CustomAuthStateProvider>());

// Register Business Services
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<OrderService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.UseAntiforgery();

app.UseOutputCache();

app.MapStaticAssets();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.MapDefaultEndpoints();

app.Run();
