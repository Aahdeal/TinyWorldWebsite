# TinyWorld Backend Setup Guide

## Quick Start

1. **Prerequisites**
   - Java 17+
   - Maven 3.6+
   - MySQL 8.0+

2. **Database Setup**
   ```sql
   CREATE DATABASE tinyworld_db;
   ```

3. **Configuration**
   - Update `src/main/resources/application.properties` with your MySQL credentials
   - Change the JWT secret to a secure random string (at least 32 characters)

4. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

   The API will be available at `http://localhost:8080`

## Project Structure

```
tinyworld-backend/
├── src/main/java/com/tinyworld/
│   ├── config/          # Configuration classes (Security, CORS, JWT)
│   ├── controller/      # REST controllers
│   ├── dto/             # Data Transfer Objects
│   ├── exception/       # Exception handling
│   ├── model/           # JPA entities
│   ├── repository/      # Data access layer
│   ├── security/        # Security components
│   └── service/         # Business logic
└── src/main/resources/
    └── application.properties
```

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

### Protected Endpoints (Require JWT Token)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Authentication

Include JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Database Schema

The application uses JPA with `spring.jpa.hibernate.ddl-auto=update`, which will automatically create/update tables on startup.

### Tables Created:
- `users` - User accounts
- `categories` - Product categories
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Order line items

## Next Steps

1. Seed the database with initial categories and products
2. Test the API endpoints using Postman or similar tool
3. Connect the React frontend

