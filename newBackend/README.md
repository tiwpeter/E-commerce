# 🛒 E-Commerce Backend API

Production-ready REST API for an e-commerce platform built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL** via **Prisma ORM**.

---

## ✨ Features

- 🔐 **JWT Authentication** — Access token (15m) + Refresh token (7d) strategy
- 👤 **User Management** — Role-based access control (ADMIN / USER)
- 🛍️ **Products** — Full CRUD with images, SKU, stock, featured flag, and category support
- 🗂️ **Categories** — Hierarchical (parent/child) category tree
- 🛒 **Cart** — Per-user cart with item management
- 📦 **Orders** — Full order lifecycle: PENDING → PAID → SHIPPED → COMPLETED / CANCELED
- 💳 **Payments** — Mock payment gateway with transaction tracking
- ⭐ **Reviews** — Product reviews with rating and approval workflow
- 📍 **Addresses** — Multiple shipping addresses per user
- 📁 **File Upload** — Image uploads via Multer (JPEG, PNG, WebP — max 5MB)
- 📄 **Swagger UI** — Auto-generated API docs at `/api-docs`
- 🪵 **Logging** — Winston + Morgan structured logging with daily log rotation
- 🐳 **Docker** — Multi-stage production Dockerfile
- 🔒 **Security** — Helmet, CORS, rate limiting, bcrypt password hashing

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Language | TypeScript 5 |
| Framework | Express 4 |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Validation | Zod + express-validator |
| Auth | JWT (jsonwebtoken) |
| Logging | Winston + Morgan |
| API Docs | Swagger UI (swagger-jsdoc) |
| Testing | Jest + ts-jest |
| Container | Docker (multi-stage) |

---

## 📁 Project Structure

```
src/
├── config/             # App config, database connection
├── middlewares/        # Auth, error handler, validation
├── routes/             # Route definitions per module
├── swagger/            # OpenAPI spec configuration
└── utils/              # Logger and helpers

prisma/
├── schema.prisma       # Database schema & models
└── seed.ts             # Database seeder with sample data
```

---

## 🗄️ Database Models

```
User ──< Address
User ──< Order ──< OrderItem >── Product
User ──  Cart  ──< CartItem  >── Product
User ──< Review >── Product
Order ── Payment
Category ──< Product ──< ProductImage
Category ──< Category (self-referencing)
```

| Model | Description |
|---|---|
| `User` | Accounts with role (ADMIN/USER), soft delete |
| `Category` | Hierarchical categories with slug |
| `Product` | Items with price, stock, SKU, images |
| `Cart` / `CartItem` | Per-user shopping cart |
| `Order` / `OrderItem` | Order with status lifecycle |
| `Payment` | Payment record with method and status |
| `Review` | Product reviews (1–5 stars) with approval |
| `Address` | Shipping addresses per user |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Update `.env` with your values — at minimum:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
```

### 3. Run database migrations

```bash
npm run prisma:migrate
```

### 4. Seed sample data

```bash
npm run prisma:seed
```

This creates test accounts, categories, 8 products, orders, and reviews.

### 5. Start development server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## 🐳 Docker

### Build and run

```bash
docker build -t ecommerce-backend .
docker run -p 5000:5000 --env-file .env ecommerce-backend
```

The container runs `prisma migrate deploy` automatically before starting.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

Interactive docs: `http://localhost:5000/api-docs`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login, receive tokens | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ |
| POST | `/auth/logout` | Revoke refresh token | ✅ |
| GET | `/auth/me` | Get current user | ✅ |

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | List products (paginated) | ❌ |
| GET | `/products/:id` | Get product by ID | ❌ |
| POST | `/products` | Create product | 🔑 Admin |
| PATCH | `/products/:id` | Update product | 🔑 Admin |
| DELETE | `/products/:id` | Delete product | 🔑 Admin |

### Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/orders` | List my orders | ✅ |
| GET | `/orders/:id` | Get order detail | ✅ |
| POST | `/orders` | Place new order | ✅ |
| PATCH | `/orders/:id/status` | Update order status | 🔑 Admin |

### Cart

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get my cart | ✅ |
| POST | `/cart` | Add item to cart | ✅ |
| PATCH | `/cart/:itemId` | Update item quantity | ✅ |
| DELETE | `/cart/:itemId` | Remove item | ✅ |

Other modules follow the same pattern: `/categories`, `/reviews`, `/addresses`.

---

## 🔑 Authentication

The API uses a **two-token strategy**:

1. **Access Token** — Short-lived (15 min), sent as `Authorization: Bearer <token>` header
2. **Refresh Token** — Long-lived (7 days), used to obtain new access tokens via `/auth/refresh`

---

## 🧪 Test Accounts (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ecommerce.com` | `Password123` |
| User | `jane@example.com` | `Password123` |
| User | `bob@example.com` | `Password123` |

---

## 📋 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled production build |
| `npm test` | Run tests with coverage |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run prisma:migrate` | Run DB migrations (dev) |
| `npm run prisma:migrate:prod` | Run DB migrations (production) |
| `npm run prisma:seed` | Seed database |
| `npm run prisma:studio` | Open Prisma Studio GUI |

---

## 🔒 Security

- **Helmet** — Sets security-related HTTP headers
- **CORS** — Configurable allowed origins
- **Rate Limiting** — 100 req/15min globally, 10 req/15min on auth endpoints
- **bcrypt** — Password hashing with 12 rounds
- **JWT** — Stateless authentication
- **Input Validation** — Zod schemas on all inputs

---

## 📊 Order Status Flow

```
PENDING → PAID → SHIPPED → COMPLETED
                          ↘
             (any stage) → CANCELED
```

## 💳 Payment Methods

`CREDIT_CARD` | `DEBIT_CARD` | `BANK_TRANSFER` | `MOCK_GATEWAY`

---

## 📝 Logging

Logs are written to the `logs/` directory:

- `combined.log` — All logs
- `error.log` — Errors only

Log level is controlled by `LOG_LEVEL` env var (`debug`, `info`, `warn`, `error`).

---

## 📦 Health Check

```
GET /health
```

Returns server status, uptime, and environment.

