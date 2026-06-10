# 🛒 E-Commerce Platform

A full-stack e-commerce application built with **Next.js 16 + React 19** (frontend) and **Node.js + Express + Prisma** (backend), with auto-generated TypeScript API clients via Orval.

---

## 📁 Project Structure

```
E-commerce/
├── fontend/              # Next.js 16 frontend
│   ├── src/
│   │   ├── api/generated/    # Auto-generated API clients (Orval)
│   │   ├── app/              # Next.js App Router
│   │   │   ├── (auth)/       # Login / Register pages
│   │   │   └── (shop)/       # Home, Products, Cart
│   │   ├── features/         # Feature-based components & hooks
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── home/
│   │   │   └── products/
│   │   ├── store/            # Global state (auth, cart)
│   │   └── lib/              # Axios instance, env, mappers
│   └── scripts/              # Code-gen helper scripts
│
├── newBackend/           # Express + Prisma backend
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # JWT auth, refresh tokens
│   │   │   ├── products/     # CRUD + image upload
│   │   │   ├── cart/         # Cart management
│   │   │   ├── category/     # Product categories
│   │   │   └── user/         # User management
│   │   ├── config/           # App, DB, OpenAPI configs
│   │   ├── utils/            # Error handler, logger
│   │   └── swagger/          # OpenAPI spec generation
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # SQL migrations
│   │   └── seed.ts           # Seed data
│   └── Dockerfile            # Multi-stage Docker build
│
└── .github/workflows/    # CI/CD (Vercel + Render)
```

---

## 🚀 Tech Stack

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.4 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TanStack Query | ^5 | Server state management |
| Axios | ^1.15 | HTTP client |
| Orval | ^8.8 | Auto-generate API hooks from OpenAPI |
| Tailwind CSS | ^4 | Styling |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| Express | ^4.18 | HTTP server |
| Prisma | ^7.7 | ORM + migrations |
| PostgreSQL | - | Database |
| JWT | ^9.0 | Authentication |
| Zod | ^4.3 | Schema validation |
| Winston | ^3.11 | Logging |
| Helmet | ^7.1 | Security headers |
| Multer | ^1.4 | File uploads |
| Swagger UI | ^5.0 | API documentation |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd E-commerce
```

### 2. Setup Backend

```bash
cd newBackend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# → Edit .env with your database credentials and JWT secrets

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`  
Swagger UI: `http://localhost:5000/api-docs`

### 3. Setup Frontend

```bash
cd fontend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local
# → Edit .env.local with the API URL

# (Optional) Regenerate API client from live backend
npm run orval-generate

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 🔄 Auto Code Generation (Orval)

This project uses **Orval** to auto-generate fully typed TanStack Query hooks and TypeScript models from the backend's OpenAPI spec.

```bash
# Make sure backend is running first, then:
cd fontend
npm run orval-generate
```

This generates:
- `src/api/generated/model/` — TypeScript interfaces (Product, Cart, User, etc.)
- `src/api/generated/products/` — `useGetProducts`, `useGetProductsIdVariants`, etc.
- `src/api/generated/auth/` — `usePostAuthLogin`, `usePostAuthRegister`, etc.
- `src/api/generated/cart/` — Cart management hooks

> **Tip:** Run `orval-generate` every time the backend API changes.

---

## 🗄️ Database Schema

Key models in the Prisma schema:

```
User ──── Cart ──── CartItem
 │                     │
 ├── Order ────── OrderItem ──── Product ──── ProductVariant
 │        │                         │
 │      Payment              ProductImage
 │
 └── Address
     └── Review
```

**Enums:** `Role (ADMIN | USER)`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`, `ShippingRateType`

---

## 🐳 Docker

### Backend only

```bash
cd newBackend
docker build -t ecommerce-backend .
docker run -p 5000:5000 --env-file .env ecommerce-backend
```

### Full stack with Docker Compose

```yaml
# docker-compose.yml (create at project root)
version: '3.9'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ecommerce_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./newBackend
    ports:
      - "5000:5000"
    env_file: ./newBackend/.env
    depends_on:
      - db

volumes:
  pgdata:
```

```bash
docker compose up -d
```

---

## 🔐 Environment Variables

### Backend (`newBackend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/ecommerce_db` |
| `JWT_SECRET` | Access token secret (min 32 chars) | `your-super-secret-key...` |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `another-secret...` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `PORT` | Server port | `5000` |
| `BCRYPT_ROUNDS` | Password hash cost | `12` |
| `LOG_LEVEL` | Winston log level | `debug` |

### Frontend (`fontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `ORVAL_API_SPEC_URL` | OpenAPI spec URL for code gen | `http://localhost:5000/api-docs.json` |

---

## 📡 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT pair |
| POST | `/api/auth/refresh` | — | Refresh access token |
| GET | `/api/products` | — | List products (paginated, filterable) |
| GET | `/api/products/:id` | — | Get product by ID |
| GET | `/api/products/slug/:slug` | — | Get product by slug |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/carts` | User | Get current user's cart |
| POST | `/api/carts/items` | User | Add item to cart |
| PUT | `/api/carts/items/:id` | User | Update cart item quantity |
| DELETE | `/api/carts/items/:id` | User | Remove item from cart |

Full documentation available at `/api-docs` when the backend is running.

---

## 🚢 CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys on push to `main`:

- **Frontend** → [Vercel](https://vercel.com) (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets)
- **Backend** → [Render](https://render.com) via deploy hook (requires `RENDER_DEPLOY_HOOK_URL` secret)

---

## 🛠️ Useful Scripts

### Backend

```bash
npm run dev              # Start with hot reload (ts-node-dev)
npm run build            # Compile TypeScript
npm run start            # Run compiled build
npm run prisma:migrate   # Run migrations (dev)
npm run prisma:migrate:prod  # Run migrations (production)
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio GUI
npm run swagger          # Regenerate swagger_output.json
npm run lint             # ESLint
npm run format           # Prettier
```

### Frontend

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run start            # Start production server
npm run orval-generate   # Regenerate API client from backend spec
npm run lint             # ESLint
```

---

## 📝 Notes

- The frontend folder is named `fontend` (typo preserved from original)
- Product images are uploaded to `newBackend/uploads/` directory
- Logs are written to `newBackend/logs/combined.log` and `error.log`
- The backend Dockerfile uses a **3-stage build** (deps → builder → runner) with a non-root user for security
- Prisma generates Zod validators automatically via `zod-prisma-types`
