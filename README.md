# TinyWorld E-Commerce Platform

Full-stack e-commerce platform for TinyWorld, built with Spring Boot backend and React frontend.

## Project Structure

```
TinyWorldWebsite/
├── tinyworld-backend/     # Spring Boot REST API
└── tinyworld-frontend/    # React frontend application
```

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd tinyworld-backend
   ```

2. **Create MySQL database:**
   ```sql
   CREATE DATABASE tinyworld_db;
   ```

3. **Update database credentials in `src/main/resources/application.properties`:**
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Update JWT secret:**
   ```properties
   jwt.secret=your-long-random-secret-key-at-least-256-bits
   ```

5. **Run the backend:**
   ```bash
   mvn spring-boot:run
   ```
   
   Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd tinyworld-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the frontend:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

## Features

### Backend (Spring Boot)
- RESTful API with Spring Boot 3.2
- JWT-based authentication
- MySQL database with JPA/Hibernate
- Product and category management
- Order processing system
- User profile management

### Frontend (React)
- Modern React 18 with Vite
- Material-UI components
- Gallery view with category filtering
- Order request form with product selection
- User authentication (login/register)
- Account management and order history
- Responsive design

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/categories` - Get all categories

### Protected Endpoints (Require JWT)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Database Schema

The backend automatically creates the following tables:
- `users` - User accounts
- `categories` - Product categories
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Order line items

## Development

### Backend Development
- Main application: `tinyworld-backend/src/main/java/com/tinyworld/TinyWorldApplication.java`
- Controllers: `tinyworld-backend/src/main/java/com/tinyworld/controller/`
- Services: `tinyworld-backend/src/main/java/com/tinyworld/service/`
- Models: `tinyworld-backend/src/main/java/com/tinyworld/model/`

### Frontend Development
- Main app: `tinyworld-frontend/src/App.jsx`
- Pages: `tinyworld-frontend/src/pages/`
- Components: `tinyworld-frontend/src/components/`
- Services: `tinyworld-frontend/src/services/`

## Testing

### Backend
```bash
cd tinyworld-backend
mvn test
```

### Frontend
```bash
cd tinyworld-frontend
npm run dev
```

## Production Build

### Backend
```bash
cd tinyworld-backend
mvn clean package
java -jar target/tinyworld-backend-1.0.0.jar
```

### Frontend
```bash
cd tinyworld-frontend
npm run build
# Serve the dist/ directory with a web server
```

## Notes

- The backend uses JPA with `ddl-auto=update` which automatically creates/updates database schema
- JWT tokens are stored in localStorage on the frontend
- CORS is configured to allow requests from `http://localhost:3000`
- Personalization options: Name (+R30), Initial (+R20), or None

## Support

For issues or questions, please contact the development team.

