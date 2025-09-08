# Use the runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY . ./

# Expose the port that the service listens on
EXPOSE 5003

# Run the application
ENTRYPOINT ["dotnet", "bin/Debug/net9.0/Orders.Api.dll"]