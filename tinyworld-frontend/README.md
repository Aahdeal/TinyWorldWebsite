# TinyWorld Frontend

React frontend application for TinyWorld e-commerce platform.

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Features

- **Gallery View**: Browse products organized by categories
- **Order Request**: Create orders with product selection and personalization
- **User Authentication**: Login and registration
- **Account Management**: View profile and order history
- **Responsive Design**: Material-UI components for modern UI

## Project Structure

```
src/
├── components/
│   ├── common/       # Header, Footer, ProtectedRoute
│   ├── gallery/      # Gallery, GalleryItem, ProductModal
│   ├── order/        # OrderForm, PersonalizationOptions, OrderSummary
│   └── auth/         # Login, Register
├── pages/            # Page components
├── services/         # API service layer
├── context/          # React Context (AuthContext)
├── utils/            # Constants and helpers
└── App.jsx           # Main app with routing
```

## API Integration

The frontend communicates with the Spring Boot backend via REST API. All API calls are handled through service files in `src/services/`.

## Environment Variables

Create a `.env` file if needed:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

