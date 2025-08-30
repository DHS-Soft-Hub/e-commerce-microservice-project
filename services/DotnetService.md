## .NET Service Structure

### Option 1: Single Service per Solution (Recommended for Microservices)

```
payment-service/ (.NET)
├── src/
│   └── PaymentService/
│       ├── Controllers/
│       ├── Services/
│       ├── Models/
│       ├── Repositories/
│       ├── Configuration/
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── appsettings.Production.json
│       └── PaymentService.csproj
├── tests/
│   ├── PaymentService.UnitTests/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   └── PaymentService.UnitTests.csproj
│   └── PaymentService.IntegrationTests/
│       ├── Controllers/
│       ├── TestFixtures/
│       └── PaymentService.IntegrationTests.csproj
├── PaymentService.sln              # Solution file at service root
├── Directory.Build.props           # Shared MSBuild properties
├── Directory.Packages.props        # Central package management
├── global.json                     # .NET SDK version
├── nuget.config                    # NuGet configuration
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Option 2: Multi-Project Service (For Complex Services)

```
user-service/ (.NET)
├── src/
│   ├── UserService.Api/           # Web API project
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── UserService.Api.csproj
│   ├── UserService.Core/          # Business logic
│   │   ├── Services/
│   │   ├── Interfaces/
│   │   ├── Models/
│   │   └── UserService.Core.csproj
│   ├── UserService.Infrastructure/ # Data access
│   │   ├── Repositories/
│   │   ├── Data/
│   │   ├── Migrations/
│   │   └── UserService.Infrastructure.csproj
│   └── UserService.Shared/        # Shared utilities
│       ├── Constants/
│       ├── Extensions/
│       └── UserService.Shared.csproj
├── tests/
│   ├── UserService.UnitTests/
│   ├── UserService.IntegrationTests/
│   └── UserService.ArchitectureTests/
├── UserService.sln
├── Directory.Build.props
├── Directory.Packages.props
├── global.json
└── nuget.config
```

### Key .NET Files Explained

**UserService.sln**
```xml
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.31903.59
MinimumVisualStudioVersion = 10.0.40219.1

Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UserService.Api", "src\UserService.Api\UserService.Api.csproj", "{GUID}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UserService.Core", "src\UserService.Core\UserService.Core.csproj", "{GUID}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UserService.Infrastructure", "src\UserService.Infrastructure\UserService.Infrastructure.csproj", "{GUID}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UserService.UnitTests", "tests\UserService.UnitTests\UserService.UnitTests.csproj", "{GUID}"
EndProject

Global
    GlobalSection(SolutionConfigurationPlatforms) = preSolution
        Debug|Any CPU = Debug|Any CPU
        Release|Any CPU = Release|Any CPU
    EndGlobalSection
EndGlobal
```

**Directory.Build.props** (Root level properties)
```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <Company>YourCompany</Company>
    <Product>UserService</Product>
    <Copyright>Copyright © YourCompany 2024</Copyright>
  </PropertyGroup>
  
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <DebugSymbols>true</DebugSymbols>
    <DebugType>full</DebugType>
  </PropertyGroup>
</Project>
```

**Directory.Packages.props** (Central Package Management)
```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>

  <ItemGroup>
    <PackageVersion Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageVersion Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageVersion Include="Serilog.AspNetCore" Version="8.0.0" />
    <PackageVersion Include="xunit" Version="2.4.2" />
    <PackageVersion Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.0.0" />
  </ItemGroup>
</Project>
```

**global.json**
```json
{
  "sdk": {
    "version": "8.0.100",
    "rollForward": "latestMinor"
  }
}
```



## Polyglot Project Root Structure

When combining both .NET and Java services:

```
services/
├── shared/
│   ├── dotnet/
│   │   ├── Common.Logging/
│   │   ├── Common.Messaging/
│   │   └── Common.Configuration/
│   └── java/
│       ├── common-logging/
│       ├── common-messaging/
│       └── common-configuration/
├── user-service/ (.NET)
│   ├── UserService.sln
│   └── src/...
├── order-service/ (Java)
│   ├── pom.xml
│   └── src/...
└── payment-service/ (.NET)
    ├── PaymentService.sln
    └── src/...
```

## Build Scripts for Each Service

**.NET - build.sh**
```bash
#!/bin/bash
dotnet restore
dotnet build --no-restore
dotnet test --no-build --verbosity normal
dotnet publish -c Release -o out
```

This structure ensures that each service maintains its language-specific conventions while fitting into the overall microservices architecture pattern.