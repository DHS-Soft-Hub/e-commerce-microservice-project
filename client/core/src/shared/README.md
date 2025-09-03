# Shared Layer

## 📋 Overview

The **Shared Layer** contains cross-cutting concerns, common abstractions, and reusable components that are used across all other layers of the architecture. This layer provides the foundational building blocks and contracts that enable the implementation of clean architecture principles and design patterns.

## 🎯 Core Responsibilities

### 1. **Common Abstractions**
- Defines fundamental interfaces used across all layers
- Provides base contracts for design pattern implementations
- Establishes common data structures and value objects
- Creates reusable generic interfaces and types

### 2. **Cross-Cutting Concerns**
- Implements result patterns for error handling
- Provides validation abstractions and utilities
- Defines logging and monitoring contracts
- Establishes mapping and transformation interfaces

### 3. **Type Definitions**
- Contains shared TypeScript interfaces and types
- Defines API contracts and DTOs
- Provides pagination and query abstractions
- Establishes event and messaging types

### 4. **Utility Functions**
- Implements pure utility functions without side effects
- Provides common validation logic
- Contains formatting and transformation utilities
- Offers helper functions for common operations

## 🏗️ Layer Structure

```
shared/
├── abstractions/              # Common Interface Abstractions
│   ├── IMapper.ts            # Object mapping interface
│   ├── IAutoMapper.ts        # Automatic mapping interface
│   └── index.ts              # Abstraction exports
├── types/                    # TypeScript Type Definitions
│   ├── IResult.ts           # Result pattern types
│   ├── IDomainTypes.ts      # Domain-related types
│   ├── IApiTypes.ts         # API contract types
│   ├── IValidationTypes.ts  # Validation types
│   ├── IPaginationTypes.ts  # Pagination types
│   ├── IQueryTypes.ts       # Query types
│   ├── IEventTypes.ts       # Event types
│   ├── IResponseTypes.ts    # Response types
│   ├── IHttpTypes.ts        # HTTP types
│   ├── ICQRSTypes.ts        # CQRS pattern types
│   └── index.ts             # Type exports
├── constants/               # Application Constants
│   └── index.ts             # Constant exports
├── utils/                   # Pure Utility Functions
│   └── index.ts             # Utility exports
└── README.md                # This file
```

## 🎨 Core Abstractions & Patterns

### **Result Pattern**
```typescript
// Success/Failure result pattern for explicit error handling
export interface IResult<T> {
  isSuccess: boolean;
  isFailure: boolean;
  value: T;
  error: string;
}

export interface IResultFactory {
  success<T>(value: T): IResult<T>;
  failure<T>(error: string): IResult<T>;
}

// Usage across all layers
export class Result<T> implements IResult<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value: T,
    public readonly error: string
  ) {}

  public static success<T>(value: T): Result<T> {
    return new Result(true, value, '');
  }

  public static failure<T>(error: string): Result<T> {
    return new Result(false, null as any, error);
  }

  public get isFailure(): boolean {
    return !this.isSuccess;
  }
}
```

### **Domain Types**
```typescript
// Base entity interface
export interface IEntity<TId = string> {
  id: TId;
  createdAt: Date;
  updatedAt: Date;
}

// Base value object interface
export interface IValueObject {
  equals(other: IValueObject): boolean;
  toString(): string;
}

// Aggregate root marker interface
export interface IAggregateRoot<TId = string> extends IEntity<TId> {
  domainEvents: IDomainEvent[];
}

// Specification pattern interface
export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}
```

### **Validation Abstractions**
```typescript
// Validation result interface
export interface IValidationResult {
  isValid: boolean;
  errors: IValidationError[];
}

// Validation error interface
export interface IValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

// Validator interface
export interface IValidator<T> {
  validate(value: T): IValidationResult;
  validateAsync(value: T): Promise<IValidationResult>;
}

// Validation service interface
export interface IValidationService {
  validate<T>(value: T, validator: IValidator<T>): IValidationResult;
  validateAsync<T>(value: T, validator: IValidator<T>): Promise<IValidationResult>;
  registerValidator<T>(type: string, validator: IValidator<T>): void;
}
```

### **Mapping Abstractions**
```typescript
// Object mapper interface
export interface IMapper<TSource, TDestination> {
  map(source: TSource): TDestination;
  mapArray(sources: TSource[]): TDestination[];
}

// Bidirectional mapper interface
export interface IBidirectionalMapper<TSource, TDestination> extends IMapper<TSource, TDestination> {
  reverse(destination: TDestination): TSource;
  reverseArray(destinations: TDestination[]): TSource[];
}

// Auto-mapper interface
export interface IAutoMapper {
  map<TSource, TDestination>(source: TSource, destinationType: new() => TDestination): TDestination;
  createMap<TSource, TDestination>(
    sourceType: new() => TSource,
    destinationType: new() => TDestination
  ): IMappingConfiguration<TSource, TDestination>;
}
```

## 🔧 CQRS & Event Types

### **Command & Query Types**
```typescript
// Base command interface
export interface ICommand {
  readonly id: string;
  readonly timestamp: Date;
  readonly userId?: string;
}

// Base query interface
export interface IQuery {
  readonly id: string;
  readonly timestamp: Date;
  readonly userId?: string;
}

// Command handler interface
export interface ICommandHandler<TCommand extends ICommand, TResult> {
  handle(command: TCommand): Promise<IResult<TResult>>;
  canHandle(command: ICommand): boolean;
}

// Query handler interface
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  handle(query: TQuery): Promise<IResult<TResult>>;
  canHandle(query: IQuery): boolean;
}

// Mediator pattern interface
export interface IMediator {
  send<TResult>(request: ICommand | IQuery): Promise<IResult<TResult>>;
  publish<T extends IDomainEvent>(event: T): Promise<void>;
}
```

### **Event Types**
```typescript
// Base domain event interface
export interface IDomainEvent {
  readonly id: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly version: number;
  readonly timestamp: Date;
  readonly data: Record<string, any>;
}

// Event handler interface
export interface IEventHandler<T extends IDomainEvent> {
  handle(event: T): Promise<void>;
  canHandle(event: IDomainEvent): boolean;
  getEventType(): string;
}

// Event bus interface
export interface IEventBus {
  publish<T extends IDomainEvent>(event: T): Promise<void>;
  subscribe<T extends IDomainEvent>(
    eventType: string,
    handler: IEventHandler<T>
  ): Promise<void>;
}
```

## 📊 Pagination & Query Types

### **Pagination Abstractions**
```typescript
// Pagination options
export interface IPaginationOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Paginated result
export interface IPaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Query options
export interface IQueryOptions {
  filters?: Record<string, any>;
  pagination?: IPaginationOptions;
  includes?: string[];
  select?: string[];
}

// Sort criteria
export interface ISortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

// Filter criteria
export interface IFilterCriteria {
  field: string;
  operator: FilterOperator;
  value: any;
  values?: any[];
}

export type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'startsWith' 
  | 'endsWith'
  | 'greaterThan' 
  | 'lessThan' 
  | 'greaterThanOrEqual' 
  | 'lessThanOrEqual'
  | 'in' 
  | 'notIn'
  | 'isNull' 
  | 'isNotNull';
```

## 🌐 API & HTTP Types

### **HTTP Abstractions**
```typescript
// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

// HTTP status codes
export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500
}

// HTTP request interface
export interface IHttpRequest {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

// HTTP response interface
export interface IHttpResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  success: boolean;
}

// API response wrapper
export interface IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
  timestamp: Date;
}
```

### **API Contract Types**
```typescript
// Base API request
export interface IApiRequest {
  readonly timestamp: Date;
  readonly correlationId: string;
  readonly userId?: string;
}

// API error response
export interface IApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// API validation error
export interface IApiValidationError extends IApiError {
  field: string;
  rejectedValue?: any;
}

// API pagination request
export interface IApiPaginationRequest {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
```

## 🔒 Constraints & Rules

### **No Implementation Details**
- ❌ **Concrete Classes**: Only interfaces and type definitions
- ❌ **Business Logic**: No domain-specific business rules
- ❌ **Framework Dependencies**: No framework-specific code
- ❌ **Infrastructure Code**: No database or external service code

### **Pure Abstractions**
- ✅ **Interface Definitions**: Common contracts and abstractions
- ✅ **Type Definitions**: Shared TypeScript types and interfaces
- ✅ **Utility Types**: Generic utility types for common patterns
- ✅ **Pattern Definitions**: Abstract design pattern interfaces

### **Reusability Focus**
- ✅ **Cross-Layer Usage**: Used by all other layers
- ✅ **Generic Patterns**: Reusable across different domains
- ✅ **Technology Agnostic**: Not tied to specific technologies
- ✅ **Framework Independent**: Works with any frontend/backend framework

## 📝 Implementation Guidelines

### **Result Pattern Usage**
```typescript
// ✅ Good: Using Result pattern for error handling
export async function validateUser(user: User): Promise<IResult<ValidationResult>> {
  try {
    const validationResult = await userValidator.validate(user);
    
    if (validationResult.isValid) {
      return Result.success(validationResult);
    } else {
      return Result.failure('User validation failed');
    }
  } catch (error) {
    return Result.failure(`Validation error: ${error.message}`);
  }
}

// ✅ Good: Consuming Result pattern
const result = await validateUser(user);
if (result.isSuccess) {
  console.log('User is valid:', result.value);
} else {
  console.error('Validation failed:', result.error);
}
```

### **Mapping Interface Usage**
```typescript
// ✅ Good: Implementing mapper interface
export class UserMapper implements IBidirectionalMapper<User, UserDto> {
  public map(source: User): UserDto {
    return {
      id: source.id,
      email: source.email.value,
      firstName: source.profile.firstName,
      lastName: source.profile.lastName,
      createdAt: source.createdAt.toISOString()
    };
  }

  public reverse(destination: UserDto): User {
    return User.create(
      destination.id,
      Email.create(destination.email),
      UserProfile.create(destination.firstName, destination.lastName)
    );
  }

  public mapArray(sources: User[]): UserDto[] {
    return sources.map(source => this.map(source));
  }

  public reverseArray(destinations: UserDto[]): User[] {
    return destinations.map(destination => this.reverse(destination));
  }
}
```

### **Validation Interface Usage**
```typescript
// ✅ Good: Implementing validator interface
export class EmailValidator implements IValidator<string> {
  public validate(email: string): IValidationResult {
    const errors: IValidationError[] = [];

    if (!email) {
      errors.push({
        field: 'email',
        message: 'Email is required',
        code: 'REQUIRED',
        value: email
      });
    } else if (!this.isValidEmailFormat(email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        code: 'INVALID_FORMAT',
        value: email
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public async validateAsync(email: string): Promise<IValidationResult> {
    const syncResult = this.validate(email);
    if (!syncResult.isValid) {
      return syncResult;
    }

    // Additional async validation (e.g., check if email exists)
    const emailExists = await this.checkEmailExists(email);
    if (emailExists) {
      syncResult.errors.push({
        field: 'email',
        message: 'Email already exists',
        code: 'DUPLICATE',
        value: email
      });
      syncResult.isValid = false;
    }

    return syncResult;
  }
}
```

## ✅ Best Practices

### **1. Keep It Generic**
- Design interfaces that work across multiple domains
- Avoid domain-specific terminology in shared abstractions
- Create reusable patterns that can be extended
- Focus on common concerns rather than specific implementations

### **2. Strong Typing**
- Use TypeScript's type system to enforce contracts
- Define discriminated unions for different states
- Implement generic constraints where appropriate
- Provide type guards for runtime type checking

### **3. Immutability**
- Prefer readonly properties in interface definitions
- Use immutable data structures where possible
- Implement copy-on-write semantics for modifications
- Avoid mutable global state

### **4. Clear Documentation**
- Document interface purposes and usage patterns
- Provide examples of implementation
- Explain design decisions and constraints
- Maintain up-to-date documentation

### **5. Backward Compatibility**
- Consider versioning for breaking changes
- Use optional properties for new additions
- Provide migration guides for interface changes
- Maintain deprecated interfaces during transition periods

## 🚫 Anti-Patterns to Avoid

### **❌ Domain-Specific Abstractions**
```typescript
// ❌ Bad: Domain-specific interface in shared layer
export interface IUserService {
  authenticateUser(email: string, password: string): Promise<IResult<User>>;
  getUserPermissions(userId: string): Promise<Permission[]>;
}
```

### **❌ Implementation in Shared Layer**
```typescript
// ❌ Bad: Concrete implementation in shared layer
export class DatabaseConnection {
  public async connect(): Promise<void> {
    // Implementation should be in infrastructure layer
  }
}
```

### **❌ Framework Dependencies**
```typescript
// ❌ Bad: Framework-specific types in shared layer
export interface IApiService {
  handleRequest(req: Express.Request): Promise<Express.Response>; // Framework coupling!
}
```

## 🧪 Testing Strategy

### **Type Testing**
- **Interface Compliance**: Test that implementations satisfy interface contracts
- **Type Safety**: Verify TypeScript compilation with strict settings
- **Generic Constraints**: Test generic type constraints work correctly
- **Type Guards**: Test runtime type checking functions

### **Contract Testing**
- **Interface Behavior**: Test that implementations behave according to contracts
- **Error Handling**: Verify error handling patterns work consistently
- **Result Patterns**: Test success and failure scenarios
- **Validation Rules**: Test validation logic and error reporting

### **Example Test Structure**
```typescript
describe('Result Pattern', () => {
  describe('success', () => {
    it('should create successful result with value', () => {
      const value = 'test value';
      const result = Result.success(value);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe(value);
      expect(result.error).toBe('');
    });
  });

  describe('failure', () => {
    it('should create failed result with error', () => {
      const error = 'test error';
      const result = Result.failure<string>(error);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(error);
    });
  });
});
```

## 📊 Utility Functions

### **Pure Utility Functions**
```typescript
// String utilities
export function isNullOrEmpty(value: string | null | undefined): boolean {
  return value == null || value.trim() === '';
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// Array utilities
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Date utilities
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  // Implementation here
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

## 📚 Further Reading

- **TypeScript Deep Dive** - Understanding advanced TypeScript patterns
- **Clean Architecture** by Robert C. Martin - Dependency inversion principles
- **Domain-Driven Design** by Eric Evans - Shared kernel concepts
- **Functional Programming in TypeScript** - Immutability and pure functions

---

*The Shared Layer provides the foundation for all other layers. Keep it focused on truly common concerns and avoid domain-specific logic.*
