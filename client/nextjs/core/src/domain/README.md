# Domain Layer

## 📋 Overview

The **Domain Layer** is the heart of the application architecture, containing the core business logic and rules. This layer is completely independent of external concerns like databases, APIs, or UI frameworks. It represents the essential complexity of the business domain.

## 🎯 Core Responsibilities

### 1. **Business Logic Encapsulation**
- Contains all core business rules and domain knowledge
- Enforces business invariants and constraints
- Implements complex business operations and calculations
- Maintains domain integrity through validation

### 2. **Domain Model Definition**
- Defines rich domain entities with behavior
- Creates immutable value objects for domain concepts
- Establishes aggregate boundaries for consistency
- Models domain relationships and dependencies

### 3. **Domain Event Management**
- Publishes domain events for significant business occurrences
- Enables decoupled communication between domain concepts
- Supports eventual consistency patterns
- Facilitates integration with other bounded contexts

## 🏗️ Layer Structure

```
domain/
├── entities/                    # Domain Entities
│   ├── IBaseEntity.ts          # Base entity interface with domain events
│   └── index.ts                # Entity exports
├── value-objects/              # Immutable Value Objects
│   └── index.ts                # Value object exports
├── aggregates/                 # Aggregate Roots
│   └── index.ts                # Aggregate exports
├── services/                   # Domain Services
│   └── index.ts                # Domain service exports
├── events/                     # Domain Events
│   └── index.ts                # Event exports
├── specifications/             # Business Rule Specifications
│   └── index.ts                # Specification exports
└── README.md                   # This file
```

## 🎨 Design Patterns & Concepts

### **Entities**
- **Identity**: Objects with unique identity that persists over time
- **Behavior**: Rich objects with methods that enforce business rules
- **Lifecycle**: Managed creation, modification, and deletion
- **Invariants**: Business rules that must always be true

### **Value Objects**
- **Immutability**: Cannot be changed once created
- **Equality**: Two value objects are equal if their values are equal
- **Validation**: Self-validating with business rule enforcement
- **Expressiveness**: Clear representation of domain concepts

### **Aggregates**
- **Consistency Boundary**: Ensures business invariants across related entities
- **Transactional Unit**: Single aggregate per transaction rule
- **Root Access**: External access only through aggregate root
- **Reference Management**: Aggregates reference each other by ID only

### **Domain Services**
- **Stateless Operations**: Complex business operations that don't belong to entities
- **Multi-Entity Operations**: Coordinates operations across multiple entities
- **Business Processes**: Implements complex business workflows
- **Domain Calculations**: Performs domain-specific calculations

### **Domain Events**
- **Business Significance**: Represents meaningful business occurrences
- **Immutability**: Events cannot be changed once created
- **Rich Information**: Contains all necessary context for handlers
- **Past Tense Naming**: Events represent things that have already happened

## 🔒 Constraints & Rules

### **No External Dependencies**
- ❌ **Database**: No direct database access or ORM dependencies
- ❌ **HTTP**: No web framework or HTTP client dependencies
- ❌ **UI**: No user interface or presentation logic
- ❌ **Infrastructure**: No file system, email, or external service dependencies

### **Pure Business Logic**
- ✅ **Domain Rules**: All business rules must be in this layer
- ✅ **Validation**: Domain-specific validation and constraints
- ✅ **Calculations**: Business calculations and computations
- ✅ **Workflows**: Core business process definitions

### **Dependency Direction**
- ✅ **Inward Only**: This layer should not depend on any other layers
- ✅ **Self-Contained**: All domain logic contained within this layer
- ✅ **Interface Definition**: Can define interfaces for external dependencies
- ✅ **Event Publishing**: Can publish events but not handle infrastructure concerns

## 📝 Implementation Guidelines

### **Entity Design**
```typescript
// ✅ Good: Rich domain entity with behavior
export class User extends BaseEntity {
  private constructor(
    id: UserId,
    private email: Email,
    private password: Password
  ) {
    super(id);
  }

  public changePassword(newPassword: Password, currentPassword: Password): void {
    if (!this.password.matches(currentPassword)) {
      throw new InvalidPasswordError('Current password is incorrect');
    }
    
    this.password = newPassword;
    this.addDomainEvent(new PasswordChangedEvent(this.id, new Date()));
  }

  public hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }
}
```

### **Value Object Design**
```typescript
// ✅ Good: Immutable value object with validation
export class Email {
  private constructor(private readonly value: string) {
    this.validate(value);
  }

  public static create(value: string): Result<Email> {
    try {
      return Result.success(new Email(value));
    } catch (error) {
      return Result.failure(error.message);
    }
  }

  private validate(value: string): void {
    if (!this.isValidEmailFormat(value)) {
      throw new InvalidEmailError('Invalid email format');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

### **Domain Service Design**
```typescript
// ✅ Good: Stateless domain service
export class AuthenticationDomainService {
  public authenticateUser(
    user: User,
    credentials: Credentials,
    securityPolicy: SecurityPolicy
  ): AuthenticationResult {
    if (!user.isActive()) {
      return AuthenticationResult.failure('User account is inactive');
    }

    if (securityPolicy.requiresMultiFactorAuth(user)) {
      return AuthenticationResult.requiresMFA(user);
    }

    if (credentials.isValid(user.getPasswordHash())) {
      return AuthenticationResult.success(user);
    }

    return AuthenticationResult.failure('Invalid credentials');
  }
}
```

## ✅ Best Practices

### **1. Rich Domain Models**
- Encapsulate business logic within domain objects
- Avoid anemic domain models with only getters/setters
- Use meaningful method names that express business intent
- Implement business rules as domain object methods

### **2. Immutability Where Appropriate**
- Value objects should always be immutable
- Consider immutability for entities when business rules allow
- Use builder patterns for complex object construction
- Implement copy-on-write semantics for modifications

### **3. Clear Business Language**
- Use ubiquitous language from domain experts
- Name classes, methods, and properties using business terms
- Avoid technical jargon that business experts wouldn't understand
- Maintain consistency in terminology across the domain

### **4. Proper Aggregate Design**
- Keep aggregates small and focused
- Ensure single aggregate per transaction
- Reference other aggregates by identity only
- Model true business invariants, not technical constraints

### **5. Domain Event Usage**
- Publish events for significant business occurrences
- Include all necessary context in event data
- Use past tense naming for events
- Keep events focused on business significance

## 🚫 Anti-Patterns to Avoid

### **❌ Anemic Domain Model**
```typescript
// ❌ Bad: Anemic entity with no behavior
export class User {
  public id: string;
  public email: string;
  public password: string;
  public isActive: boolean;
}
```

### **❌ Infrastructure Leakage**
```typescript
// ❌ Bad: Domain entity depending on infrastructure
export class User {
  public async save(): Promise<void> {
    await database.users.save(this); // Infrastructure dependency!
  }
}
```

### **❌ Business Logic in Getters/Setters**
```typescript
// ❌ Bad: Business logic in property setters
export class User {
  set email(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email');
    }
    this._email = value;
    this.sendEmailVerification(); // Side effect in setter!
  }
}
```

## 🧪 Testing Strategy

### **Unit Testing Focus**
- **Business Rules**: Test all business logic and invariants
- **Edge Cases**: Test boundary conditions and error scenarios
- **Behavior**: Test entity and value object behavior
- **Events**: Verify domain event generation and content

### **Testing Principles**
- **Isolation**: Test domain objects in complete isolation
- **No Mocks**: Domain layer should not require mocking
- **Business Scenarios**: Write tests that reflect business requirements
- **Fast Execution**: Tests should run quickly without external dependencies

### **Example Test Structure**
```typescript
describe('User Domain Entity', () => {
  describe('changePassword', () => {
    it('should change password when current password is correct', () => {
      // Arrange
      const user = UserBuilder.create()
        .withEmail('user@example.com')
        .withPassword('currentPassword')
        .build();

      // Act
      const result = user.changePassword('newPassword', 'currentPassword');

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(user.getDomainEvents()).toContainEventOfType(PasswordChangedEvent);
    });

    it('should fail when current password is incorrect', () => {
      // Test implementation
    });
  });
});
```

## 📚 Further Reading

- **Domain-Driven Design** by Eric Evans
- **Implementing Domain-Driven Design** by Vaughn Vernon
- **Clean Architecture** by Robert C. Martin
- **Patterns of Enterprise Application Architecture** by Martin Fowler

---

*The Domain Layer is the foundation of your application's business logic. Keep it pure, focused, and independent of all external concerns.*
