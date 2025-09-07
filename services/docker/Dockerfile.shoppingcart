# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# 1. Copy solution + project files (only metadata for restore layer)
COPY orders/*.sln ./
COPY orders/ShoppingCart.Api/ShoppingCart.Api.csproj orders/ShoppingCart.Api/

# Shopping Cart API project
COPY orders/ShoppingCart.Api/ShoppingCart.Api.csproj orders/ShoppingCart.Api/
COPY shared/ shared/

# Restore dependencies
RUN dotnet restore orders/ShoppingCart.Api/ShoppingCart.Api.csproj

# 2. Copy the remaining source
COPY . .

# 3. Publish (explicitly target the ShoppingCart.Api project)
RUN dotnet publish orders/ShoppingCart.Api/ShoppingCart.Api.csproj -c Release -o /out /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

EXPOSE 8080
ENTRYPOINT ["dotnet", "ShoppingCart.Api.dll"]