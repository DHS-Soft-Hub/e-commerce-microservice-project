# Use the official .NET 9 SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy project files for dependency resolution
COPY *.csproj ./
RUN dotnet restore

# Copy all source code
COPY . ./
RUN dotnet publish -c Release -o /out

# Use the runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

# Expose the port that the service listens on
EXPOSE 8080

# Run the application
ENTRYPOINT ["dotnet", "Auth.Api.dll"]