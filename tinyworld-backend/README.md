# TinyWorld Backend

Spring Boot REST API backend for TinyWorld e-commerce platform.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE tinyworld_db;
   ```

2. **Update Database Configuration**
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Update JWT Secret**
   Change the JWT secret in `application.properties`:
   ```properties
   jwt.secret=your-long-random-secret-key-at-least-256-bits
   ```

## Running the Application

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

### Orders (Requires Authentication)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details

### User Profile (Requires Authentication)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

The application uses JPA to automatically create/update the database schema. Tables will be created on first run.

