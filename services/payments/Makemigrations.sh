#!/bin/bash

# Function to display usage
show_usage() {
  echo "Usage:"
  echo "  $0 --initial                    # Clean all migrations and create InitialMigration"
  echo "  $0 -n <MigrationName>          # Create a new migration with specified name"
  exit 1
}

# Check if no arguments provided
if [ $# -eq 0 ]; then
  show_usage
fi

# Parse command line arguments
if [ "$1" = "--initial" ]; then
  echo "Creating initial migration..."
  echo "Removing existing migrations..."
  
  # Remove all migration files from the Migrations folder
  if [ -d "Payment.Api/Data/Migrations" ]; then
    rm -rf Payment.Api/Data/Migrations/*
    echo "Existing migrations removed."
  else
    echo "No existing migrations found."
  fi
  
  # Create the initial migration
  echo "Creating InitialMigration..."
  dotnet ef migrations add InitialMigration --project Payment.Api --output-dir Data/Migrations
  
elif [ "$1" = "-n" ]; then
  # Check if migration name is provided
  if [ -z "$2" ]; then
    echo "Error: Migration name is required when using -n flag"
    show_usage
  fi
  
  echo "Creating migration: $2"
  # Make sure to run this script from the root of the Payment.Api project
  dotnet ef migrations add "$2" --project Payment.Api --output-dir Data/Migrations
  
else
  echo "Error: Invalid option '$1'"
  show_usage
fi