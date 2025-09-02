# Application Layer

## 📋 Overview

The **Application Layer** serves as the orchestrator of use cases and coordinates between the domain layer and infrastructure layer. This layer contains application-specific business logic and workflows, transforming user intentions into domain operations without containing core business rules.

## 🎯 Core Responsibilities

### 1. **Use Case Orchestration**
- Implements specific application use cases and workflows
- Coordinates multiple domain services and repositories
- Manages transaction boundaries and data consistency
- Handles cross-cutting concerns like logging and monitoring

### 2. **Command & Query Handling**
- Processes commands (write operations) through CQRS pattern
- Handles queries (read operations) with optimized data retrieval
- Validates input data and enforces application-level constraints
- Transforms domain objects to application-specific DTOs

### 3. **Integration Coordination**
- Manages interactions with external systems
- Handles domain event processing and publishing
- Coordinates between different bounded contexts
- Implements application-level security and authorization

### 4. **Workflow Management**
- Implements complex business processes that span multiple domains
- Manages state transitions and process flows
- Handles compensation and rollback scenarios
- Coordinates async operations and background tasks

## 🏗️ Layer Structure

```
application/
├── abstractions/               # Application Service Interfaces
│   ├── IApplicationService.ts  # Base application service interface
│   ├── IUseCase.ts            # Use case pattern interface
│   ├── ICommandHandler.ts     # Command handler interface
│   ├── IQueryHandler.ts       # Query handler interface
│   └── index.ts               # Interface exports
├── use-cases/                 # Application Use Cases
│   └── index.ts               # Use case exports
├── handlers/                  # Command & Query Handlers
│   └── index.ts               # Handler exports
├── services/                  # Application Services
│   └── index.ts               # Service exports
├── workflows/                 # Business Process Workflows
│   └── index.ts               # Workflow exports
├── events/                    # Application Event Handlers
│   └── index.ts               # Event handler exports
└── README.md                  # This file
```

## 🎨 Design Patterns & Concepts

### **Use Case Pattern**
- **Single Responsibility**: Each use case handles one specific business operation
- **Clear Intent**: Use case names reflect business language and user intentions
- **Input/Output**: Well-defined request/response contracts
- **Error Handling**: Comprehensive error handling and user feedback

### **Command Query Responsibility Segregation (CQRS)**
- **Command Side**: Handles write operations that change system state
- **Query Side**: Handles read operations optimized for data retrieval
- **Separation**: Clear separation between read and write concerns
- **Scalability**: Independent scaling of read and write operations

### **Application Services**
- **Orchestration**: Coordinates domain services and repositories
- **Transaction Management**: Handles transaction boundaries and consistency
- **DTO Transformation**: Converts between domain objects and DTOs
- **Validation**: Application-level input validation and business rule checks

### **Event Handling**
- **Domain Event Processing**: Handles domain events from the domain layer
- **Integration Events**: Publishes events for other bounded contexts
- **Async Processing**: Non-blocking event processing and side effects
- **Error Recovery**: Handles event processing failures and retries

## 🔧 CQRS Implementation

### **Command Side Architecture**
```typescript
// Command Definition
export interface ICommand {
  readonly name: string;
  readonly timestamp: Date;
  readonly userId?: string;
}

// Command Handler
export interface ICommandHandler<TCommand extends ICommand, TResult> {
  handle(command: TCommand): Promise<IResult<TResult>>;
  canHandle(command: ICommand): boolean;
}

// Command Bus
export interface ICommandBus {
  send<TResult>(command: ICommand): Promise<IResult<TResult>>;
  register<TCommand extends ICommand, TResult>(
    handler: ICommandHandler<TCommand, TResult>
  ): void;
}
```

### **Query Side Architecture**
```typescript
// Query Definition
export interface IQuery {
  readonly name: string;
  readonly filters?: Record<string, any>;
  readonly pagination?: IPaginationOptions;
}

// Query Handler
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  handle(query: TQuery): Promise<IResult<TResult>>;
  canHandle(query: IQuery): boolean;
}

// Query Bus
export interface IQueryBus {
  send<TResult>(query: IQuery): Promise<IResult<TResult>>;
  register<TQuery extends IQuery, TResult>(
    handler: IQueryHandler<TQuery, TResult>
  ): void;
}
```

## 🔒 Constraints & Rules

### **No Direct Domain Logic**
- ❌ **Business Rules**: No core business logic - delegate to domain layer
- ❌ **Domain Calculations**: No business calculations - use domain services
- ❌ **Entity Behavior**: No direct entity manipulation - use domain methods
- ❌ **Validation Logic**: No domain validation - use domain specifications

### **Orchestration Only**
- ✅ **Coordination**: Coordinate between domain services and repositories
- ✅ **Transaction Management**: Manage transaction boundaries and consistency
- ✅ **Data Transformation**: Transform between domain objects and DTOs
- ✅ **Workflow Management**: Implement application-specific workflows

### **Dependency Direction**
- ✅ **Domain Dependencies**: Depends on domain layer abstractions
- ✅ **Infrastructure Abstractions**: Depends on infrastructure interfaces
- ✅ **No Concrete Dependencies**: No dependencies on infrastructure implementations
- ✅ **Inversion of Control**: Uses dependency injection for all external dependencies

## 📝 Implementation Guidelines

### **Use Case Implementation**
```typescript
// ✅ Good: Use case with clear responsibility
export class LoginUseCase implements IUseCase<LoginCommand, AuthenticationResult> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly userRepository: IUserRepository,
    private readonly authDomainService: IAuthDomainService,
    private readonly tokenService: ITokenService,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: LoginCommand): Promise<IResult<AuthenticationResult>> {
    try {
      // 1. Validate input
      const validationResult = await this.validateCommand(command);
      if (!validationResult.isSuccess) {
        return Result.failure(validationResult.error);
      }

      // 2. Retrieve user
      const userResult = await this.userRepository.findByEmail(command.email);
      if (!userResult.isSuccess || !userResult.value) {
        return Result.failure('Invalid credentials');
      }

      // 3. Delegate authentication to domain service
      const authResult = await this.authDomainService.authenticate(
        userResult.value,
        command.credentials
      );

      if (!authResult.isSuccess) {
        return Result.failure(authResult.error);
      }

      // 4. Generate token
      const tokenResult = await this.tokenService.generateToken(userResult.value);
      if (!tokenResult.isSuccess) {
        return Result.failure('Token generation failed');
      }

      // 5. Publish domain event
      await this.eventBus.publish(
        new UserAuthenticatedEvent(userResult.value.id, new Date())
      );

      // 6. Return result
      return Result.success(new AuthenticationResult(
        userResult.value,
        tokenResult.value
      ));

    } catch (error) {
      return Result.failure(`Login failed: ${error.message}`);
    }
  }

  private async validateCommand(command: LoginCommand): Promise<IResult<void>> {
    // Application-level validation
    if (!command.email || !command.credentials) {
      return Result.failure('Email and credentials are required');
    }

    return Result.success();
  }
}
```

### **Command Handler Implementation**
```typescript
// ✅ Good: Command handler with transaction management
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, User> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: IUserDomainService,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus
  ) {}

  public async handle(command: CreateUserCommand): Promise<IResult<User>> {
    return await this.unitOfWork.execute(async () => {
      // 1. Use domain service to create user
      const userResult = await this.userDomainService.createUser(
        command.email,
        command.password,
        command.profile
      );

      if (!userResult.isSuccess) {
        return userResult;
      }

      // 2. Persist user
      const savedUserResult = await this.userRepository.save(userResult.value);
      if (!savedUserResult.isSuccess) {
        return savedUserResult;
      }

      // 3. Publish domain events
      for (const event of userResult.value.getDomainEvents()) {
        await this.eventBus.publish(event);
      }

      return savedUserResult;
    });
  }

  public canHandle(command: ICommand): boolean {
    return command instanceof CreateUserCommand;
  }
}
```

### **Application Service Implementation**
```typescript
// ✅ Good: Application service orchestrating multiple operations
export class UserApplicationService implements IUserApplicationService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus
  ) {}

  public async createUser(request: CreateUserRequest): Promise<IResult<UserResponse>> {
    // Transform request to command
    const command = new CreateUserCommand(
      request.email,
      request.password,
      request.profile
    );

    // Execute command
    const result = await this.commandBus.send<User>(command);
    if (!result.isSuccess) {
      return Result.failure(result.error);
    }

    // Transform domain object to response DTO
    const response = UserResponse.fromDomain(result.value);
    return Result.success(response);
  }

  public async getUserById(id: string): Promise<IResult<UserResponse | null>> {
    const query = new GetUserByIdQuery(id);
    const result = await this.queryBus.send<User | null>(query);
    
    if (!result.isSuccess) {
      return Result.failure(result.error);
    }

    const response = result.value ? UserResponse.fromDomain(result.value) : null;
    return Result.success(response);
  }
}
```

## ✅ Best Practices

### **1. Single Responsibility**
- Each use case should handle one specific business operation
- Application services should focus on orchestration, not business logic
- Command and query handlers should have clear, focused responsibilities
- Separate read and write operations using CQRS pattern

### **2. Transaction Management**
- Use Unit of Work pattern for transaction boundaries
- Keep transactions as small as possible
- Handle transaction rollback and compensation scenarios
- Consider eventual consistency for cross-context operations

### **3. Error Handling**
- Provide meaningful error messages for business failures
- Handle infrastructure failures gracefully
- Use Result pattern for explicit error handling
- Log errors with sufficient context for debugging

### **4. DTO Usage**
- Use DTOs for all external communication
- Keep DTOs simple data structures without behavior
- Implement proper mapping between domain objects and DTOs
- Version DTOs for API compatibility

### **5. Event Processing**
- Handle domain events to trigger side effects
- Use async processing for non-critical operations
- Implement idempotent event handlers
- Provide error recovery and retry mechanisms

## 🚫 Anti-Patterns to Avoid

### **❌ Business Logic in Application Layer**
```typescript
// ❌ Bad: Business logic in application service
export class UserApplicationService {
  public async updateUserEmail(userId: string, newEmail: string): Promise<void> {
    const user = await this.userRepository.getById(userId);
    
    // Business logic should be in domain layer!
    if (newEmail.indexOf('@') === -1) {
      throw new Error('Invalid email format');
    }
    
    user.email = newEmail; // Direct property modification!
    await this.userRepository.save(user);
  }
}
```

### **❌ Infrastructure Dependencies**
```typescript
// ❌ Bad: Direct infrastructure dependencies
export class UserApplicationService {
  constructor(
    private readonly database: Database, // Concrete dependency!
    private readonly emailClient: EmailClient // Concrete dependency!
  ) {}
}
```

### **❌ Anemic Application Services**
```typescript
// ❌ Bad: Application service that just passes through to repository
export class UserApplicationService {
  public async getUser(id: string): Promise<User> {
    return await this.userRepository.getById(id); // No added value!
  }
}
```

## 🧪 Testing Strategy

### **Integration Testing Focus**
- **Use Case Testing**: Test complete business scenarios
- **Command/Query Testing**: Test CQRS handlers with real dependencies
- **Workflow Testing**: Test complex business processes
- **Event Processing**: Test event handling and side effects

### **Testing Principles**
- **Mock Infrastructure**: Mock repositories and external services
- **Real Domain Objects**: Use real domain objects, not mocks
- **Test Scenarios**: Write tests that reflect real business scenarios
- **Error Cases**: Test error handling and edge cases

### **Example Test Structure**
```typescript
describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockAuthRepository = createMockAuthRepository();
    mockUserRepository = createMockUserRepository();
    useCase = new LoginUseCase(mockAuthRepository, mockUserRepository);
  });

  describe('execute', () => {
    it('should authenticate user with valid credentials', async () => {
      // Arrange
      const command = new LoginCommand('user@example.com', 'password');
      const user = UserBuilder.create().withEmail(command.email).build();
      mockUserRepository.findByEmail.mockResolvedValue(Result.success(user));

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value.user).toEqual(user);
    });

    it('should fail with invalid credentials', async () => {
      // Test implementation
    });
  });
});
```

## 📊 Performance Considerations

### **Optimization Strategies**
- **Caching**: Cache frequently accessed data at application level
- **Async Processing**: Use async operations for non-blocking workflows
- **Batch Operations**: Implement batch processing for bulk operations
- **Query Optimization**: Optimize read operations with specific query handlers

### **Scalability Patterns**
- **CQRS Scaling**: Scale read and write operations independently
- **Event-Driven**: Use events for async, scalable communication
- **Stateless Services**: Keep application services stateless for horizontal scaling
- **Circuit Breaker**: Implement resilience patterns for external dependencies

## 📚 Further Reading

- **Clean Architecture** by Robert C. Martin
- **Implementing Domain-Driven Design** by Vaughn Vernon
- **CQRS Documents** by Greg Young
- **Microservices Patterns** by Chris Richardson

---

*The Application Layer is the conductor of your business operations. Keep it focused on orchestration and let the domain layer handle the business logic.*
