# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# 1. Copy solution + project files (only metadata for restore layer)
COPY orders/*.sln ./
COPY orders/Orders.Api/Orders.Api.csproj orders/Orders.Api/

# Orders API project
COPY orders/Orders.Api/Orders.Api.csproj orders/Orders.Api/
COPY shared/ shared/

# Restore dependencies
RUN dotnet restore orders/Orders.Api/Orders.Api.csproj

# 2. Copy the remaining source
COPY . .

# 3. Publish (explicitly target the Orders.Api project)
RUN dotnet publish orders/Orders.Api/Orders.Api.csproj -c Release -o /out /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

EXPOSE 8080
ENTRYPOINT ["dotnet", "Orders.Api.dll"]