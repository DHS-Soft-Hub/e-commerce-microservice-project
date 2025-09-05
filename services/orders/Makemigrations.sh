# ask for migration name as an argument with -n flag
if [ -z "$2" ]; then
  echo "Usage: $0 -n <MigrationName>"
  exit 1
fi

# Make sure to run this script from the root of the Orders.Infrastructure project
dotnet ef migrations add "$2" --project Orders.Infrastructure --startup-project Orders.Api