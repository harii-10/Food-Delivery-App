# Food Delivery System

A complete, production-grade Food Delivery Application built with microservices architecture.

## Architecture Overview

### High-Level Design (HLD)
- **Microservices**: Auth, Restaurant, Order, Delivery, Payment, Notification
- **Communication**: REST APIs with event-driven flows
- **Databases**: Separate MongoDB databases per service
- **Frontend**: Vite + React (JSX only)

### Service Boundaries
- **Auth Service**: User authentication, JWT tokens
- **Restaurant Service**: Restaurant CRUD, menu management
- **Order Service**: Order lifecycle management
- **Delivery Service**: Delivery assignment and tracking (mocked)
- **Payment Service**: Payment processing (mocked)
- **Notification Service**: Asynchronous notifications (mocked)

### Order Lifecycle Flow
1. User places order → Order Service creates order
2. Payment processed → Order status to CONFIRMED
3. Delivery assigned → Status to PREPARING
4. Delivery picked up → Status to OUT_FOR_DELIVERY
5. Delivery completed → Status to DELIVERED
6. Notifications sent at each status change

## System Design Principles
- **Scalability**: Read-heavy optimization with indexing and caching (explained)
- **Fault Tolerance**: Asynchronous communication, retries
- **Loose Coupling**: Independent service scaling
- **Event-Driven**: Status changes trigger notifications

## MongoDB Schemas

### Auth Service (authDB)
```javascript
User: {
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['USER', 'RESTAURANT', 'ADMIN'],
  createdAt: Date
}
```

### Restaurant Service (restaurantDB)
```javascript
Restaurant: {
  name: String,
  description: String,
  location: { lat: Number, lng: Number },
  address: String,
  ownerId: ObjectId,
  isOpen: Boolean,
  createdAt: Date
} // Indexed on location (2dsphere)

Menu: {
  restaurantId: ObjectId,
  name: String,
  description: String,
  items: [{
    name: String,
    description: String,
    price: Number,
    category: String,
    isAvailable: Boolean
  }]
}
```

### Order Service (orderDB)
```javascript
Order: {
  userId: ObjectId,
  restaurantId: ObjectId,
  items: [{
    menuItemId: ObjectId,
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: Enum ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
  createdAt: Date,
  updatedAt: Date
}
```

### Delivery Service (deliveryDB)
```javascript
Delivery: {
  orderId: ObjectId,
  deliveryPartnerId: String (mock),
  status: Enum ['ASSIGNED', 'PICKED_UP', 'DELIVERED'],
  estimatedTime: Number,
  currentLocation: { lat: Number, lng: Number } (mock)
}
```

### Payment Service (paymentDB)
```javascript
Payment: {
  orderId: ObjectId,
  amount: Number,
  status: Enum ['PENDING', 'SUCCESS', 'FAILED'],
  method: String,
  createdAt: Date
}
```

### Notification Service (notificationDB)
```javascript
Notification: {
  userId: ObjectId,
  type: String,
  message: String,
  isRead: Boolean,
  createdAt: Date
}
```

## REST API Endpoints

### Auth Service (Port 3001)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Restaurant Service (Port 3002)
- `POST /api/restaurants` - Create restaurant (auth required)
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `PUT /api/restaurants/:id/menu` - Update menu (auth required)

### Order Service (Port 3003)
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders` - Get user orders (auth required)
- `PUT /api/orders/:id/status` - Update order status (auth required)

### Delivery Service (Port 3004)
- `POST /api/deliveries` - Assign delivery
- `GET /api/deliveries/:orderId` - Get delivery status

### Payment Service (Port 3005)
- `POST /api/payments` - Process payment

### Notification Service (Port 3006)
- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get user notifications (auth required)

## How to Run Locally

### Prerequisites
- Node.js
- MongoDB (local, via MongoDB Compass)
- npm or yarn

### Setup
1. Start MongoDB locally on default port 27017
2. Run all the services at once using the command 
  **pm3 start ./ecosystem.config.js
3. Frontend runs on http://localhost:5173
4. Services run on ports 3001-3006

### Mock Data
- Register a restaurant owner and create restaurants/menus
- Register users and place orders
- Delivery and payment are mocked to always succeed

## Design Decisions & Trade-offs

### Microservices vs Monolith
- **Decision**: Microservices for scalability and independent deployment
- **Trade-off**: Increased complexity in communication and data consistency

### Separate Databases
- **Decision**: Logical separation per service for autonomy
- **Trade-off**: Cross-service queries require API calls

### Event-Driven Flow
- **Decision**: Asynchronous notifications and status updates
- **Trade-off**: Eventual consistency vs immediate consistency

### No Real External APIs
- **Decision**: Mocked delivery, payment, notifications for simplicity
- **Trade-off**: Not production-ready, but demonstrates architecture

### Frontend State Management
- **Decision**: Simple useState for demo
- **Trade-off**: Not scalable for complex apps (would use Redux/Context)

## Scalability Discussion

### Read-Heavy Optimization
- **Restaurant Listing**: Geo-indexing for location-based queries
- **Caching Strategy**: Implement Redis for frequently accessed data (restaurants, menus)
- **CDN**: Static assets and images

### Service Scaling
- **Auth**: Stateless, horizontal scaling
- **Restaurant**: Read replicas for listings
- **Order**: Sharding by user/region
- **Delivery/Payment/Notification**: Queue-based processing

### Database Optimization
- **Indexing**: Location, userId, status fields
- **Read Replicas**: For high-read services
- **Archiving**: Old orders to separate storage

### Failure Handling
- **Circuit Breakers**: Prevent cascade failures
- **Retries**: Exponential backoff for API calls
- **Fallbacks**: Default responses for failed services

This implementation demonstrates real-world system design principles suitable for interviews and production planning.
