# E-Commerce Blazor Client

This is the frontend application for the e-commerce microservice project, built with ASP.NET Core Blazor Server. It provides a modern, responsive web interface for customers to browse products, manage shopping carts, and complete orders.

## Overview

The Blazor client serves as the user interface layer that communicates with various microservices through a GraphQL API Gateway. It implements a complete e-commerce shopping experience with real-time updates and responsive design.

## Architecture

```
Blazor Client
├── Components/
│   ├── Layout/           # Shared layout components
│   ├── Pages/           # Page components
│   │   ├── Cart/        # Shopping cart management
│   │   ├── Orders/      # Order history and details
│   │   └── Payment/     # Payment processing
│   └── Shared/          # Reusable UI components
├── Services/            # Backend communication services
│   ├── Auth/           # Authentication service
│   ├── Cart/           # Shopping cart service
│   ├── Orders/         # Order management service
│   └── Payment/        # Payment processing service
└── wwwroot/            # Static assets (CSS, JS, images)
```

## Frontend Process Flow

### 1. Authentication Flow
```
User Access → Login Page → JWT Token → Authenticated Session
```
- Users authenticate through the Auth service
- JWT tokens are stored securely and used for API calls
- Authentication state is managed globally

### 2. Shopping Experience

#### Product Browsing
```
Home Page → Product Catalog → Product Details → Add to Cart
```
- Browse available products
- View detailed product information
- Add items to shopping cart

#### Cart Management
```
Add to Cart → Cart Page → Update Quantities → Proceed to Checkout
```
- Real-time cart updates
- Quantity adjustments
- Item removal
- Price calculations

### 3. Order Processing Workflow

#### Checkout Process
```
Cart → Checkout → Order Creation → Payment Processing → Order Confirmation
```

**Detailed Steps:**

1. **Cart Review** (`/cart`)
   - Display cart items and total
   - Allow quantity modifications
   - Validate cart contents

2. **Checkout Initiation**
   - User clicks "Proceed to Checkout"
   - Cart data is sent to Order Service
   - Order is created with `Pending` status

3. **Saga Processing** (Backend)
   - OrderCreateSaga begins orchestration
   - Inventory reservation
   - Payment creation with `Pending` status

4. **Payment Page** (`/payment/{orderId}`)
   - **Retry Logic**: Waits for saga to create payment (up to 10 attempts with exponential backoff)
   - Displays order summary and payment form
   - Shows payment status (`Pending`, `Completed`, etc.)

5. **Payment Approval**
   - User selects payment method
   - Clicks "Approve Payment" 
   - Payment status updated to `Completed`
   - Triggers `PaymentProcessedIntegrationEvent`

6. **Order Completion**
   - Saga continues with shipment creation
   - Order status updates reflect progress
   - User redirected to order details

### 4. Order Tracking

#### Order History (`/orders`)
```
Orders List → Order Details → Status Updates → Shipping Tracking
```
- View all user orders
- Real-time status updates
- Order details and history

## Key Features

### Real-time Updates
- SignalR integration for live order status updates
- Dynamic cart updates
- Real-time payment status changes

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interface

### Error Handling
- Graceful error messages
- Retry mechanisms for failed requests
- Fallback options for service unavailability

### Performance Optimization
- Server-side rendering with Blazor Server
- Efficient state management
- Minimal JavaScript footprint

## Payment Processing Details

### Payment Page Features

#### Retry Mechanism
The payment page implements intelligent retry logic to handle saga processing delays:

```csharp
// Exponential backoff: 1s, 2s, 4s, 8s, etc. (max 30s)
var delaySeconds = Math.Min(Math.Pow(2, retryAttempt - 1), 30);
```

- **Max Attempts**: 10 retries
- **Backoff Strategy**: Exponential (1s → 2s → 4s → 8s → 16s → 30s → 30s...)
- **Progress Indicator**: Visual progress bar showing retry attempts
- **User Feedback**: Clear messaging about wait status

#### Payment Status Handling
- **Pending**: Shows payment form with approval button
- **Completed**: Displays success message with order link
- **Failed/Unknown**: Error message with support contact info

#### Data Flow
```
Payment Page Load
↓
Load Order Details
↓
Wait for Payment Creation (with retries)
↓
Display Payment Form
↓
User Approves Payment
↓
Update Payment Status to Completed
↓
Redirect to Order Details
```

## Services Integration

### GraphQL Communication
All backend communication uses GraphQL queries and mutations through the API Gateway:

```csharp
// Example service call
var response = await _graphQLClient.QueryAsync<PaymentQueryResponse>(
    PaymentQueries.GetPaymentByOrderId, 
    new { orderId }
);
```

### Service Dependencies
- **AuthService**: User authentication and JWT management
- **CartService**: Shopping cart operations
- **OrderService**: Order creation and management
- **PaymentService**: Payment processing and status updates

## Configuration

### Environment Settings
```json
{
  "ApiGateway": {
    "BaseUrl": "https://localhost:5000/graphql"
  },
  "Authentication": {
    "Authority": "https://localhost:5001",
    "ClientId": "blazor-client"
  }
}
```

### Features
- **Interactive Server Rendering**: Full server-side rendering with real-time updates
- **Authentication**: Integration with IdentityServer/Auth service
- **Authorization**: Role-based access control
- **Logging**: Comprehensive logging for debugging and monitoring

## Development

### Prerequisites
- .NET 9.0 SDK
- Visual Studio 2022 or VS Code
- Docker (for microservices)

### Running Locally
```bash
# Start microservices
cd ../../services
docker-compose up -d

# Run Blazor client
cd ../client/blazor
dotnet run --project Web/Web.csproj
```

### Build Process
```bash
dotnet build
dotnet publish -c Release
```

## User Experience Highlights

### Shopping Flow
1. **Intuitive Navigation**: Clear menu structure and breadcrumbs
2. **Smooth Cart Experience**: Instant feedback on cart actions
3. **Streamlined Checkout**: Minimal steps from cart to payment
4. **Payment Transparency**: Clear status updates and wait indicators
5. **Order Tracking**: Real-time status updates throughout fulfillment

### Error Handling
- **Network Issues**: Automatic retries with user feedback
- **Service Unavailability**: Graceful degradation with helpful messages
- **Validation Errors**: Clear, actionable error messages
- **Timeout Handling**: Smart retry logic for saga processing delays

### Performance
- **Fast Loading**: Optimized server-side rendering
- **Efficient Updates**: Targeted DOM updates for dynamic content
- **Minimal Latency**: Direct communication with API Gateway
- **Scalable Architecture**: Stateless design for horizontal scaling

## Monitoring & Debugging

### Logging
- Client-side console logging for debugging
- Server-side structured logging
- Request/response tracing
- Error tracking and reporting

### Performance Metrics
- Page load times
- API response times
- User interaction tracking
- Conversion funnel analysis

This Blazor client provides a modern, responsive, and reliable frontend for the e-commerce platform, with particular attention to handling the complexities of microservice communication and saga-based order processing.
