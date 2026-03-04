# 🛍️ ShopThai — คู่มือการติดตั้งและรัน

## 📋 ความต้องการของระบบ

| เครื่องมือ   | เวอร์ชันขั้นต่ำ |
|-------------|--------------|
| Node.js     | 18.x ขึ้นไป  |
| npm         | 9.x ขึ้นไป   |
| Backend API | รองรับ REST  |

---

## 🚀 ขั้นตอนการติดตั้ง

### 1. ติดตั้ง dependencies

```bash
cd shopthai
npm install
```

> **หมายเหตุ:** คำสั่งนี้จะติดตั้ง package ทั้งหมดที่ระบุใน `package.json` โดยอัตโนมัติ ได้แก่:
> - `next` — Framework หลัก
> - `axios` — HTTP client
> - `@tanstack/react-query` — Data fetching + caching
> - `zustand` — Global state management
> - `tailwindcss` — Styling

---

### 2. ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env.local
```

จากนั้นแก้ไข `.env.local` ให้ตรงกับ Backend ของคุณ:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> **เปลี่ยน `http://localhost:4000/api` เป็น URL จริงของ Backend API ของคุณ**

---

### 3. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 โครงสร้างโปรเจกต์

```
shopthai/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (ใส่ Providers)
│   ├── page.tsx                  # หน้าแรก /
│   ├── shop/page.tsx             # หน้าสินค้า /shop
│   ├── cart/page.tsx             # หน้าตะกร้า /cart
│   ├── orders/page.tsx           # ประวัติคำสั่งซื้อ /orders
│   ├── profile/page.tsx          # จัดการที่อยู่ /profile
│   ├── login/page.tsx            # Login/Register /login
│   ├── providers.tsx             # React Query + Zustand setup
│   └── api/[...proxy]/route.ts   # Next.js API proxy (optional)
│
├── components/                   # UI Components
│   ├── Navbar.tsx                # Navigation bar พร้อม cart badge
│   ├── ProductGrid.tsx           # แสดงสินค้า + filter + pagination
│   ├── CartList.tsx              # ตะกร้าสินค้า + optimistic update
│   ├── OrderList.tsx             # ประวัติคำสั่งซื้อ + accordion
│   ├── AddressManager.tsx        # CRUD ที่อยู่จัดส่ง
│   └── AuthForms.tsx             # Login / Register form
│
├── lib/
│   ├── axios.ts                  # Axios instance + JWT interceptor + auto-refresh
│   └── api.ts                    # Typed API service functions
│
├── stores/
│   ├── authStore.ts              # Zustand — user session
│   └── cartStore.ts              # Zustand — cart state
│
├── hooks/
│   └── useShopQueries.ts         # React Query hooks ทุก feature
│
├── .env.example                  # ตัวอย่าง environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 🔗 หน้าที่มีในโปรเจกต์

| URL         | หน้า                    |
|-------------|------------------------|
| `/`         | หน้าแรก                |
| `/shop`     | สินค้าทั้งหมด + filter  |
| `/cart`     | ตะกร้าสินค้า            |
| `/orders`   | ประวัติคำสั่งซื้อ        |
| `/profile`  | จัดการที่อยู่จัดส่ง      |
| `/login`    | เข้าสู่ระบบ / สมัครสมาชิก |

---

## 🔌 API Endpoints ที่ต้องมีใน Backend

### Auth
| Method | Endpoint           | Body                              |
|--------|--------------------|-----------------------------------|
| POST   | `/auth/login`      | `{ email, password }`             |
| POST   | `/auth/register`   | `{ name, email, password }`       |
| GET    | `/auth/me`         | (ต้องการ Bearer token)             |
| POST   | `/auth/logout`     | (ต้องการ Bearer token)             |
| POST   | `/auth/refresh`    | `{ refreshToken }`                |

### Products
| Method | Endpoint                         | Query Params                                  |
|--------|----------------------------------|-----------------------------------------------|
| GET    | `/products`                      | `page, limit, search, sort, categoryId`       |
| GET    | `/products/:slug`                | —                                             |
| GET    | `/products/:id/reviews`          | —                                             |
| POST   | `/products/:id/reviews`          | `{ rating, comment }`                         |

### Cart
| Method | Endpoint                | Body                          |
|--------|-------------------------|-------------------------------|
| GET    | `/cart`                 | —                             |
| POST   | `/cart/items`           | `{ productId, quantity }`     |
| PATCH  | `/cart/items/:productId`| `{ quantity }`                |
| DELETE | `/cart/items/:productId`| —                             |
| DELETE | `/cart`                 | —                             |

### Orders
| Method | Endpoint             | Body                    |
|--------|----------------------|-------------------------|
| GET    | `/orders`            | —                       |
| GET    | `/orders/:id`        | —                       |
| POST   | `/orders`            | `{ addressId, note? }`  |
| PATCH  | `/orders/:id/cancel` | —                       |

### Addresses
| Method | Endpoint           | Body         |
|--------|--------------------|--------------|
| GET    | `/addresses`       | —            |
| POST   | `/addresses`       | Address body |
| PATCH  | `/addresses/:id`   | Address body |
| DELETE | `/addresses/:id`   | —            |

---

## 🔐 JWT Flow

```
1. Login → POST /auth/login → { accessToken, refreshToken }
2. เก็บใน localStorage (authStore + axios)
3. ทุก request → Authorization: Bearer <accessToken>
4. ถ้า 401 → auto refresh → POST /auth/refresh → accessToken ใหม่
5. ถ้า refresh fail → clearTokens → redirect /login
```

---

## 📦 Build สำหรับ Production

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 🛠️ Scripts ทั้งหมด

| Script          | คำอธิบาย                     |
|-----------------|------------------------------|
| `npm run dev`   | รัน dev server (port 3000)   |
| `npm run build` | Build สำหรับ production       |
| `npm start`     | รัน production server         |
| `npm run lint`  | ตรวจสอบ code ด้วย ESLint      |

---

## ❓ แก้ปัญหาเบื้องต้น

### สินค้าไม่โหลด / API Error
- ตรวจสอบ `NEXT_PUBLIC_API_URL` ใน `.env.local`
- ตรวจสอบว่า Backend กำลังรันอยู่
- เปิด DevTools → Network tab เพื่อดู request/response

### CORS Error
เพิ่ม header ใน Backend:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Headers: Authorization, Content-Type
```

หรือใช้ Next.js API Proxy (`app/api/[...proxy]/route.ts`) แล้วเปลี่ยน `NEXT_PUBLIC_API_URL` เป็น `/api`

### Token หมดอายุตลอด
ตรวจสอบว่า Backend ส่ง `refreshToken` กลับมาใน response ของ `/auth/refresh`

---

## 🧑‍💻 เทคโนโลยีที่ใช้

| Package                  | เวอร์ชัน | หน้าที่                    |
|--------------------------|---------|---------------------------|
| Next.js                  | 14.x    | Framework + App Router    |
| React                    | 18.x    | UI Library                |
| TypeScript               | 5.x     | Type safety               |
| Tailwind CSS             | 3.x     | Styling                   |
| Axios                    | 1.x     | HTTP + JWT interceptor    |
| @tanstack/react-query    | 5.x     | Server state + caching    |
| Zustand                  | 4.x     | Client state (auth, cart) |
