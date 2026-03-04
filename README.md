# 🛒 E-Commerce Platform — Backend API

Production-ready RESTful API for an e-commerce platform with Admin Dashboard. Built with Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM.

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Docker Deployment](#docker-deployment)
- [API Endpoints](#api-endpoints)
- [Example Requests](#example-requests)
- [Security](#security)
- [Project Structure](#project-structure)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP/HTTPS
┌───────────────────────────▼─────────────────────────────┐
│              Nginx (Reverse Proxy + SSL)                 │
│         Rate Limiting │ Load Balancing │ Static Files    │
└──────────────┬─────────────────────────────┬────────────┘
               │                             │
┌──────────────▼──────────┐   ┌─────────────▼────────────┐
│  Frontend (Next.js)     │   │  Backend API (Express)    │
│  Port: 3000             │   │  Port: 5000               │
└─────────────────────────┘   └──────────────┬────────────┘
                                             │
              ┌──────────────────────────────┤
              │                              │
┌─────────────▼──────────┐    ┌─────────────▼────────────┐
│  PostgreSQL Database   │    │   File Storage (Local)   │
│  Port: 5432            │    │   /uploads               │
└────────────────────────┘    └──────────────────────────┘
```

**Clean Architecture Layers:**

```
Request → Route → Middleware → Controller → Service → Repository → Database
                 (auth, validate,                (business      (data
                  rate-limit)                     logic)         access)
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express.js 4.x |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Auth | JWT (access + refresh tokens) |
| Validation | express-validator |
| API Docs | Swagger/OpenAPI 3.0 |
| Logging | Winston |
| Upload | Multer |
| Security | Helmet, CORS, Rate Limiting |
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx |

---

## ✨ Features

### 🛒 Shop (User)
- Browse products with search, filter, sort
- Product details with gallery and reviews
- Shopping cart (add, update, remove items)
- Checkout with address and mock payment
- Order history and tracking

### 🧑‍💼 Admin Dashboard
- Revenue and sales analytics
- Product CRUD with image upload
- Order management and status updates
- Category management
- User management

### 🔐 Security
- JWT access tokens (15 min) + refresh tokens (7 days)
- Refresh token rotation (detect reuse attacks)
- Password hashing with bcrypt
- Role-based access control (USER / ADMIN)
- Rate limiting (general + auth-specific)
- Input validation and sanitization
- SQL injection protection via Prisma
- Helmet security headers

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Local Development

```bash
# 1. Clone and navigate to backend
cd ecommerce/backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database credentials and secrets

# 4. Run database migrations
npm run prisma:migrate

# 5. Seed with sample data
npm run prisma:seed

# 6. Start development server
npm run dev
```

Server starts at: `http://localhost:5000`
Swagger UI: `http://localhost:5000/api-docs`

---

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Min 32 chars, secret for access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Min 32 chars, secret for refresh tokens |
| `JWT_EXPIRES_IN` | ❌ | Access token expiry (default: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | ❌ | Refresh token expiry (default: `7d`) |
| `BCRYPT_ROUNDS` | ❌ | Password hash rounds (default: `12`) |
| `PORT` | ❌ | Server port (default: `5000`) |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS |
| `RATE_LIMIT_MAX` | ❌ | Max requests per window (default: `100`) |

---

## 📖 API Documentation

Interactive API documentation is available at:
```
http://localhost:5000/api-docs
```

Raw OpenAPI spec:
```
http://localhost:5000/api-docs.json
```

---

## 🗄️ Database Schema

```
users ──────────────────── orders
  │                          │
  ├── addresses ─────────────┤
  │                          ├── order_items ── products
  ├── cart ── cart_items ──  │                     │
  │                          └── payments          ├── product_images
  └── reviews ─────────────────────────────────────│
                                                   └── categories
```

**Key Design Decisions:**
- **Soft deletes** on `users`, `products`, `categories`, `reviews`
- **Decimal types** for prices (no floating point errors)
- **Indexed fields**: email, slug, status, foreign keys
- **Audit fields**: `createdAt`, `updatedAt`, `deletedAt` on all models

---

## 🐳 Docker Deployment

### Start all services

```bash
cd ecommerce

# Copy environment file
cp backend/.env.example .env
# Configure .env at root level

# Start production stack
docker-compose up -d

# With pgAdmin (dev)
docker-compose --profile dev up -d

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed data
docker-compose exec backend npm run prisma:seed
```

### Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Nginx | http://localhost:80 |
| pgAdmin | http://localhost:5050 |
| Swagger | http://localhost:5000/api-docs |

---

## 📡 API Endpoints

### Auth
```
POST   /api/v1/auth/register         Register new user
POST   /api/v1/auth/login            Login
POST   /api/v1/auth/refresh          Refresh access token
POST   /api/v1/auth/logout           Logout
GET    /api/v1/auth/me               Get current user
PUT    /api/v1/auth/change-password  Change password
```

### Products
```
GET    /api/v1/products              List products (filter/sort/paginate)
GET    /api/v1/products/featured     Featured products
GET    /api/v1/products/best-sellers Best sellers
GET    /api/v1/products/:id          Get product by ID
GET    /api/v1/products/slug/:slug   Get product by slug
POST   /api/v1/products              Create product [ADMIN]
PUT    /api/v1/products/:id          Update product [ADMIN]
DELETE /api/v1/products/:id          Delete product [ADMIN]
POST   /api/v1/products/:id/images   Upload image [ADMIN]
DELETE /api/v1/products/:id/images/:imageId  Delete image [ADMIN]
```

### Categories
```
GET    /api/v1/categories            List categories
GET    /api/v1/categories/:id        Get category
POST   /api/v1/categories            Create [ADMIN]
PUT    /api/v1/categories/:id        Update [ADMIN]
DELETE /api/v1/categories/:id        Delete [ADMIN]
```

### Cart
```
GET    /api/v1/cart                  Get cart
POST   /api/v1/cart/items            Add item
PUT    /api/v1/cart/items/:productId Update item quantity
DELETE /api/v1/cart/items/:productId Remove item
DELETE /api/v1/cart                  Clear cart
```

### Orders
```
POST   /api/v1/orders                Create order from cart
GET    /api/v1/orders/my             My orders
GET    /api/v1/orders/my/:id         My order detail
GET    /api/v1/orders                All orders [ADMIN]
GET    /api/v1/orders/stats          Dashboard stats [ADMIN]
GET    /api/v1/orders/:id            Order detail [ADMIN]
PATCH  /api/v1/orders/:id/status     Update status [ADMIN]
```

### Reviews
```
GET    /api/v1/reviews/products/:productId  Product reviews
POST   /api/v1/reviews/products/:productId  Submit review
DELETE /api/v1/reviews/:id                  Delete review
GET    /api/v1/reviews                      All reviews [ADMIN]
```

### Addresses
```
GET    /api/v1/addresses             My addresses
POST   /api/v1/addresses             Create address
PUT    /api/v1/addresses/:id         Update address
DELETE /api/v1/addresses/:id         Delete address
```

---

## 📬 Example Requests & Responses

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "clr1abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### List Products with Filters
```http
GET /api/v1/products?search=iphone&categoryId=smartphones&minPrice=500&maxPrice=1500&sort=price_asc&page=1&limit=10
```

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "clr2def456",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "price": "999.99",
      "comparePrice": "1099.99",
      "stock": 50,
      "isFeatured": true,
      "averageRating": 4.5,
      "reviewCount": 2,
      "category": { "id": "...", "name": "Smartphones", "slug": "smartphones" },
      "images": [{ "id": "...", "url": "https://...", "isPrimary": true }]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Add to Cart
```http
POST /api/v1/cart/items
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "productId": "clr2def456",
  "quantity": 2
}
```

### Create Order
```http
POST /api/v1/orders
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "addressId": "clr3ghi789",
  "paymentMethod": "CREDIT_CARD",
  "notes": "Please leave at door"
}
```

### Admin: Update Order Status
```http
PATCH /api/v1/orders/clr4jkl012/status
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "status": "SHIPPED",
  "trackingNumber": "TRK-US-789456123"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🔒 Security

### JWT Strategy
- **Access Token**: Short-lived (15 min), used for API calls
- **Refresh Token**: Long-lived (7 days), stored in DB, used to issue new access tokens
- **Token Rotation**: Each refresh issues a new refresh token. If the old one is reused, all tokens are invalidated (reuse attack prevention)

### Status Transition Rules
```
PENDING → PAID → SHIPPED → COMPLETED
   └──────────────────────→ CANCELED
```

### Rate Limits
| Endpoint | Limit |
|----------|-------|
| All API | 100 req / 15 min |
| Auth endpoints | 10 req / 15 min |

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data
├── src/
│   ├── config/
│   │   ├── app.config.ts   # Env vars & config
│   │   └── database.ts     # Prisma client singleton
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   └── misc.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── cart.service.ts
│   │   ├── category.service.ts
│   │   ├── review.service.ts
│   │   └── address.service.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   ├── order.repository.ts
│   │   ├── category.repository.ts
│   │   └── cart.repository.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # JWT verify + RBAC
│   │   ├── error.middleware.ts  # Global error handler
│   │   ├── upload.middleware.ts # Multer config
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   └── index.routes.ts
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   ├── product.validation.ts
│   │   └── order.validation.ts
│   ├── swagger/
│   │   └── swagger.config.ts
│   ├── utils/
│   │   ├── errors.ts            # Custom error classes
│   │   ├── jwt.util.ts          # Token helpers
│   │   ├── logger.ts            # Winston logger
│   │   ├── response.helper.ts   # Standard responses
│   │   └── slug.util.ts         # Slug generation
│   ├── app.ts                   # Express app setup
│   └── server.ts               # Entry point
├── .env.example
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 🧪 Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecommerce.com | Password123 |
| User | jane@example.com | Password123 |
| User | bob@example.com | Password123 |

---

## 📝 License

MIT License — see LICENSE file for details.
