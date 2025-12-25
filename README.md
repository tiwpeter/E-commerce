# 🛒 Full Stack E-Commerce Platform (Next.js)

ระบบ E-commerce แบบ Full Stack
พัฒนาด้วย Next.js (App Router) ครอบคลุมทั้งฝั่งผู้ใช้งานและฝั่งผู้ดูแลระบบ
ใช้ Prisma ORM เชื่อมต่อฐานข้อมูล SQLite

---

## ✨ Features

### ฝั่งผู้ใช้งาน (Shopping)
- แสดงรายการสินค้าและรายละเอียดสินค้า
- แสดงราคาปกติและราคาหลังส่วนลด
- ระบบตะกร้าสินค้า
- รองรับการใช้งานทุกขนาดหน้าจอ (Responsive)

### ฝั่งผู้ดูแลระบบ (Admin Dashboard)
- จัดการสินค้า (เพิ่ม / แก้ไข / ลบ)
- จัดการหมวดหมู่สินค้า
- กำหนดส่วนลดสินค้า (`sale_percent`)
- แยกหน้าใช้งานจากฝั่งผู้ใช้งานอย่างชัดเจน

---

## 🛠️ Tech Stack & Tools

### Frontend & Backend
- Next.js (App Router, Full Stack)
- React
- TypeScript / JavaScript
- Tailwind CSS
- Next.js Route Handlers (`app/api`)

### Database & ORM
- SQLite
- Prisma ORM

## 🚀 Get Started
## Run Web Dashboard
```bash
cd Dashboard
npm install
npm run dev
```
## Run Web Shopping
```bash
cd Shopping
npm install
npm run dev
```

## Original Projects
- [Project Web-dashboard](https://github.com/tiwpeter/Web-dashboard) 
- [Project Web-Shopping](https://github.com/tiwpeter/Web-Shopping)
