# Infrastructure Layer

## 📋 Overview

The **Infrastructure Layer** provides concrete implementations of the abstractions defined by the domain and application layers. This layer handles all external concerns like databases, APIs, file systems, email services, and third-party integrations. It's the most volatile layer and should be easily replaceable without affecting business logic.

## 🎯 Core Responsibilities

### 1. **External System Integration**
- Implements database access through repository pattern
- Integrates with external APIs and web services
- Handles file system operations and storage
- Manages email, SMS, and notification services

### 2. **Cross-Cutting Concerns Implementation**
- Implements logging, monitoring, and observability
- Provides caching mechanisms and strategies
- Handles security concerns like encryption and authentication
- Implements performance optimization patterns

### 3. **Technology-Specific Implementations**
- Database-specific repository implementations
- Framework-specific HTTP clients and API integrations
- Cloud service integrations (AWS, Azure, GCP)
- Message queue and event bus implementations

### 4. **Configuration & Environment Management**
- Environment-specific configuration handling
- Dependency injection container setup
- Service discovery and registration
- Health check and monitoring implementations

## 🏗️ Layer Structure

```
infrastructure/
├── abstractions/              # Infrastructure Interfaces
│   ├── IRepository.ts        # Generic repository interface
│   ├── IHttpClient.ts        # HTTP client interface
│   ├── ILogger.ts            # Logging interface
│   ├── ICache.ts             # Caching interface
│   ├── IEventBus.ts          # Event publishing interface
│   ├── IFileStorage.ts       # File storage interface
│   ├── IEmailService.ts      # Email service interface
│   └── index.ts              # Interface exports
├── patterns/                 # Design Pattern Interfaces
│   ├── IFactory.ts           # Factory pattern interface
│   ├── IStrategy.ts          # Strategy pattern interface
│   ├── IDecorator.ts         # Decorator pattern interface
│   ├── IObserver.ts          # Observer pattern interface
│   └── index.ts              # Pattern exports
├── repositories/             # Repository Abstractions
│   └── index.ts              # Repository exports
├── services/                 # Infrastructure Service Interfaces
│   ├── IQueryService.ts      # Query service interface
│   └── index.ts              # Service exports
└── README.md                 # This file
```

## 🎨 Design Patterns & Concepts

### **Repository Pattern**
- **Data Access Abstraction**: Abstracts the underlying data storage mechanism
- **Query Encapsulation**: Encapsulates complex queries and data access logic
- **Technology Independence**: Domain layer independent of database technology
- **Testing Support**: Easy mocking for unit tests

### **Unit of Work Pattern**
- **Transaction Management**: Manages database transactions and consistency
- **Change Tracking**: Tracks changes to domain objects
- **Batch Operations**: Optimizes database operations through batching
- **Rollback Support**: Provides transaction rollback capabilities

### **Gateway Pattern**
- **External Service Integration**: Abstracts external service communications
- **Protocol Translation**: Handles protocol differences and transformations
- **Error Handling**: Manages external service failures and retries
- **Rate Limiting**: Implements rate limiting and throttling

### **Factory Pattern**
- **Object Creation**: Creates complex objects with multiple dependencies
- **Environment Configuration**: Creates different implementations based on environment
- **Dependency Injection**: Facilitates dependency injection and IoC containers
- **Plugin Architecture**: Supports pluggable and extensible architectures

## 🔧 Core Infrastructure Abstractions

### **Repository Interfaces**
```typescript
// Generic Repository Pattern
export interface IRepository<TEntity, TKey> {
  getById(id: TKey): Promise<IResult<TEntity | null>>;
  getAll(): Promise<IResult<TEntity[]>>;
  create(entity: TEntity): Promise<IResult<TEntity>>;
  update(entity: TEntity): Promise<IResult<TEntity>>;
  delete(id: TKey): Promise<IResult<void>>;
  exists(id: TKey): Promise<boolean>;
}

// Specification-based Repository
export interface ISpecificationRepository<TEntity> extends IRepository<TEntity, string> {
  findBySpecification(spec: ISpecification<TEntity>): Promise<IResult<TEntity[]>>;
  findOneBySpecification(spec: ISpecification<TEntity>): Promise<IResult<TEntity | null>>;
  countBySpecification(spec: ISpecification<TEntity>): Promise<IResult<number>>;
}

// Queryable Repository
export interface IQueryableRepository<TEntity, TQuery> extends IRepository<TEntity, string> {
  query(query: TQuery): Promise<IResult<TEntity[]>>;
  queryPaginated(query: TQuery): Promise<IResult<IPaginatedResult<TEntity>>>;
  queryFirst(query: TQuery): Promise<IResult<TEntity | null>>;
  count(query: TQuery): Promise<IResult<number>>;
}
```

### **HTTP Client Interfaces**
```typescript
// Generic HTTP Client
export interface IHttpClient {
  get<T>(url: string, options?: IHttpOptions): Promise<IResult<T>>;
  post<T>(url: string, data: any, options?: IHttpOptions): Promise<IResult<T>>;
  put<T>(url: string, data: any, options?: IHttpOptions): Promise<IResult<T>>;
  delete<T>(url: string, options?: IHttpOptions): Promise<IResult<T>>;
  patch<T>(url: string, data: any, options?: IHttpOptions): Promise<IResult<T>>;
}

// API Gateway Interface
export interface IApiGateway {
  call<TRequest, TResponse>(
    endpoint: string,
    method: HttpMethod,
    data?: TRequest,
    options?: IApiOptions
  ): Promise<IResult<TResponse>>;
  
  getServiceUrl(serviceName: string): Promise<string>;
  healthCheck(serviceName: string): Promise<IResult<IHealthStatus>>;
}

// HTTP Options and Configuration
export interface IHttpOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  authentication?: IAuthenticationOptions;
}
```

### **Caching Interfaces**
```typescript
// Generic Cache Interface
export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  clear(): Promise<void>;
}

// Distributed Cache Interface
export interface IDistributedCache extends ICache {
  getMultiple<T>(keys: string[]): Promise<Map<string, T>>;
  setMultiple<T>(items: Map<string, T>, ttl?: number): Promise<void>;
  deleteMultiple(keys: string[]): Promise<void>;
  invalidatePattern(pattern: string): Promise<void>;
}

// Cache Strategy Interface
export interface ICacheStrategy {
  shouldCache(key: string, value: any): boolean;
  getTtl(key: string, value: any): number;
  getKey(prefix: string, identifier: string): string;
  shouldInvalidate(event: IDomainEvent): boolean;
}
```

### **Event Bus Interfaces**
```typescript
// Event Bus Interface
export interface IEventBus {
  publish<T extends IDomainEvent>(event: T): Promise<void>;
  publishBatch<T extends IDomainEvent>(events: T[]): Promise<void>;
  subscribe<T extends IDomainEvent>(
    eventType: string,
    handler: IEventHandler<T>
  ): Promise<void>;
  unsubscribe(eventType: string, handlerId: string): Promise<void>;
}

// Event Store Interface
export interface IEventStore {
  saveEvent(event: IDomainEvent): Promise<void>;
  saveEvents(events: IDomainEvent[]): Promise<void>;
  getEvents(aggregateId: string): Promise<IDomainEvent[]>;
  getEventsAfter(aggregateId: string, version: number): Promise<IDomainEvent[]>;
  getAllEvents(fromTimestamp?: Date): Promise<IDomainEvent[]>;
}

// Event Handler Interface
export interface IEventHandler<T extends IDomainEvent> {
  handle(event: T): Promise<void>;
  canHandle(event: IDomainEvent): boolean;
  getEventType(): string;
}
```

## 🔒 Constraints & Rules

### **Implementation Only**
- ✅ **Interface Implementation**: Implements abstractions defined by domain/application layers
- ✅ **Technology Binding**: Contains all technology-specific code
- ✅ **External Integration**: Handles all external system communications
- ✅ **Infrastructure Concerns**: Manages logging, caching, monitoring, etc.

### **No Business Logic**
- ❌ **Domain Rules**: No business rules or domain logic
- ❌ **Business Calculations**: No business calculations or validations
- ❌ **Workflow Logic**: No business process or workflow logic
- ❌ **Entity Behavior**: No domain entity behavior implementation

### **Dependency Direction**
- ✅ **Inward Dependencies**: Depends on domain and application abstractions
- ✅ **External Dependencies**: Can depend on external libraries and frameworks
- ✅ **Technology Specific**: Contains framework and technology-specific implementations
- ✅ **Replaceable**: Should be easily replaceable without affecting business logic

## 📝 Implementation Guidelines

### **Repository Implementation**
```typescript
// ✅ Good: Repository implementation with proper error handling
export class UserRepository implements IUserRepository {
  constructor(
    private readonly httpClient: IHttpClient,
    private readonly cache: ICache,
    private readonly logger: ILogger
  ) {}

  public async getById(id: string): Promise<IResult<User | null>> {
    try {
      // Check cache first
      const cacheKey = this.getCacheKey('user', id);
      const cachedUser = await this.cache.get<User>(cacheKey);
      if (cachedUser) {
        this.logger.debug(`User ${id} retrieved from cache`);
        return Result.success(cachedUser);
      }

      // Fetch from API
      const response = await this.httpClient.get<UserDto>(`/users/${id}`);
      if (!response.isSuccess) {
        return Result.failure(response.error);
      }

      if (!response.value) {
        return Result.success(null);
      }

      // Map DTO to domain entity
      const user = UserMapper.toDomain(response.value);
      
      // Cache the result
      await this.cache.set(cacheKey, user, 300); // 5 minutes TTL
      
      this.logger.debug(`User ${id} retrieved from API and cached`);
      return Result.success(user);

    } catch (error) {
      this.logger.error(`Failed to get user ${id}:`, error);
      return Result.failure(`Failed to retrieve user: ${error.message}`);
    }
  }

  public async create(user: User): Promise<IResult<User>> {
    try {
      // Map domain entity to DTO
      const userDto = UserMapper.toDto(user);
      
      // Send to API
      const response = await this.httpClient.post<UserDto>('/users', userDto);
      if (!response.isSuccess) {
        return Result.failure(response.error);
      }

      // Map response back to domain entity
      const createdUser = UserMapper.toDomain(response.value);
      
      // Update cache
      const cacheKey = this.getCacheKey('user', createdUser.id);
      await this.cache.set(cacheKey, createdUser, 300);
      
      this.logger.info(`User ${createdUser.id} created successfully`);
      return Result.success(createdUser);

    } catch (error) {
      this.logger.error('Failed to create user:', error);
      return Result.failure(`Failed to create user: ${error.message}`);
    }
  }

  private getCacheKey(prefix: string, id: string): string {
    return `${prefix}:${id}`;
  }
}
```

### **HTTP Client Implementation**
```typescript
// ✅ Good: HTTP client with retry logic and error handling
export class HttpClient implements IHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultHeaders: Record<string, string>,
    private readonly logger: ILogger
  ) {}

  public async get<T>(url: string, options?: IHttpOptions): Promise<IResult<T>> {
    return this.makeRequest<T>('GET', url, undefined, options);
  }

  public async post<T>(url: string, data: any, options?: IHttpOptions): Promise<IResult<T>> {
    return this.makeRequest<T>('POST', url, data, options);
  }

  private async makeRequest<T>(
    method: string,
    url: string,
    data?: any,
    options?: IHttpOptions
  ): Promise<IResult<T>> {
    const fullUrl = `${this.baseUrl}${url}`;
    const headers = { ...this.defaultHeaders, ...options?.headers };
    const timeout = options?.timeout || 30000;
    const maxRetries = options?.retries || 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.debug(`${method} ${fullUrl} (attempt ${attempt})`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(fullUrl, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        this.logger.debug(`${method} ${fullUrl} completed successfully`);
        return Result.success(result);

      } catch (error) {
        this.logger.warn(`${method} ${fullUrl} failed (attempt ${attempt}):`, error);
        
        if (attempt === maxRetries) {
          this.logger.error(`${method} ${fullUrl} failed after ${maxRetries} attempts`);
          return Result.failure(`Request failed: ${error.message}`);
        }

        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    return Result.failure('Request failed after all retry attempts');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### **Event Bus Implementation**
```typescript
// ✅ Good: Event bus with error handling and dead letter queue
export class EventBus implements IEventBus {
  private handlers = new Map<string, IEventHandler<any>[]>();

  constructor(
    private readonly messageQueue: IMessageQueue,
    private readonly deadLetterQueue: IDeadLetterQueue,
    private readonly logger: ILogger
  ) {}

  public async publish<T extends IDomainEvent>(event: T): Promise<void> {
    try {
      this.logger.debug(`Publishing event: ${event.type}`);

      // Serialize event
      const serializedEvent = JSON.stringify(event);
      
      // Send to message queue
      await this.messageQueue.send(event.type, serializedEvent);
      
      this.logger.info(`Event ${event.type} published successfully`);

    } catch (error) {
      this.logger.error(`Failed to publish event ${event.type}:`, error);
      
      // Send to dead letter queue for manual processing
      await this.deadLetterQueue.send({
        event,
        error: error.message,
        timestamp: new Date()
      });
      
      throw error;
    }
  }

  public async subscribe<T extends IDomainEvent>(
    eventType: string,
    handler: IEventHandler<T>
  ): Promise<void> {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    this.handlers.get(eventType)!.push(handler);
    
    // Subscribe to message queue
    await this.messageQueue.subscribe(eventType, async (message) => {
      await this.handleMessage(eventType, message);
    });
    
    this.logger.info(`Subscribed to event type: ${eventType}`);
  }

  private async handleMessage(eventType: string, message: string): Promise<void> {
    try {
      const event = JSON.parse(message);
      const handlers = this.handlers.get(eventType) || [];
      
      // Process handlers in parallel
      const promises = handlers.map(handler => this.processHandler(handler, event));
      await Promise.all(promises);
      
    } catch (error) {
      this.logger.error(`Failed to handle message for ${eventType}:`, error);
      throw error;
    }
  }

  private async processHandler(handler: IEventHandler<any>, event: any): Promise<void> {
    try {
      if (handler.canHandle(event)) {
        await handler.handle(event);
        this.logger.debug(`Handler processed event: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Handler failed to process event ${event.type}:`, error);
      // Don't re-throw to prevent affecting other handlers
    }
  }
}
```

## ✅ Best Practices

### **1. Error Handling**
- Always use Result pattern for external operations
- Log errors with sufficient context for debugging
- Implement proper retry logic with exponential backoff
- Handle timeout scenarios gracefully

### **2. Performance Optimization**
- Implement caching strategies where appropriate
- Use connection pooling for database connections
- Implement batch operations for bulk data operations
- Monitor and optimize external service calls

### **3. Security**
- Never expose sensitive data in logs
- Implement proper authentication and authorization
- Use encrypted connections for external communications
- Validate all external data inputs

### **4. Monitoring & Observability**
- Log all external service interactions
- Implement health checks for dependencies
- Monitor performance metrics and response times
- Set up alerts for failure thresholds

### **5. Configuration Management**
- Use environment-specific configuration
- Implement configuration validation
- Support configuration hot-reloading where possible
- Document all configuration options

## 🚫 Anti-Patterns to Avoid

### **❌ Business Logic in Infrastructure**
```typescript
// ❌ Bad: Business logic in repository
export class UserRepository {
  public async updateUser(user: User): Promise<void> {
    // Business logic should be in domain layer!
    if (user.age < 18) {
      throw new Error('User must be 18 or older');
    }
    
    // Repository should only handle data persistence
    await this.database.users.update(user);
  }
}
```

### **❌ Tight Coupling to Frameworks**
```typescript
// ❌ Bad: Direct framework dependency in interface
export interface IEmailService {
  sendEmail(message: ExpressRequest): Promise<void>; // Framework-specific type!
}
```

### **❌ Leaking Infrastructure Details**
```typescript
// ❌ Bad: Exposing database-specific details
export class UserRepository {
  public async getUsers(): Promise<DatabaseResultSet> { // Infrastructure leakage!
    return await this.database.query('SELECT * FROM users');
  }
}
```

## 🧪 Testing Strategy

### **Integration Testing Focus**
- **External Service Integration**: Test actual integrations with external services
- **Database Operations**: Test repository implementations with real databases
- **Message Queue Processing**: Test event publishing and handling
- **Configuration Validation**: Test configuration loading and validation

### **Testing Principles**
- **Real External Dependencies**: Use real external services in integration tests
- **Test Doubles for Unit Tests**: Mock infrastructure in application layer tests
- **Error Scenario Testing**: Test failure cases and error handling
- **Performance Testing**: Test under load and stress conditions

### **Example Test Structure**
```typescript
describe('UserRepository Integration', () => {
  let repository: UserRepository;
  let httpClient: IHttpClient;
  let cache: ICache;

  beforeEach(async () => {
    httpClient = new HttpClient(testConfig.apiUrl, {}, logger);
    cache = new InMemoryCache();
    repository = new UserRepository(httpClient, cache, logger);
  });

  describe('getById', () => {
    it('should retrieve user from API and cache result', async () => {
      // Arrange
      const userId = '123';
      
      // Act
      const result = await repository.getById(userId);
      
      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      
      // Verify caching
      const cachedResult = await repository.getById(userId);
      expect(cachedResult.isSuccess).toBe(true);
    });

    it('should handle API failures gracefully', async () => {
      // Test error scenarios
    });
  });
});
```

## 📊 Performance Monitoring

### **Key Metrics**
- **Response Times**: Monitor external service response times
- **Error Rates**: Track failure rates for external operations
- **Cache Hit Ratios**: Monitor caching effectiveness
- **Resource Usage**: Track memory, CPU, and network usage

### **Monitoring Implementation**
```typescript
// Performance monitoring decorator
export class MonitoredHttpClient implements IHttpClient {
  constructor(
    private readonly httpClient: IHttpClient,
    private readonly metrics: IMetrics
  ) {}

  public async get<T>(url: string, options?: IHttpOptions): Promise<IResult<T>> {
    const startTime = Date.now();
    
    try {
      const result = await this.httpClient.get<T>(url, options);
      
      this.metrics.recordDuration('http_request_duration', Date.now() - startTime, {
        method: 'GET',
        url,
        success: result.isSuccess.toString()
      });
      
      return result;
      
    } catch (error) {
      this.metrics.recordDuration('http_request_duration', Date.now() - startTime, {
        method: 'GET',
        url,
        success: 'false'
      });
      
      throw error;
    }
  }
}
```

## 📚 Further Reading

- **Implementing Domain-Driven Design** by Vaughn Vernon
- **Patterns of Enterprise Application Architecture** by Martin Fowler
- **Enterprise Integration Patterns** by Gregor Hohpe
- **Building Microservices** by Sam Newman

---

*The Infrastructure Layer is the foundation that enables your business logic to interact with the external world. Keep it focused on implementation details and maintain clear abstractions.*
