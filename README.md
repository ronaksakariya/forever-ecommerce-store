# Forever — Full-Stack E-Commerce Platform

A production-ready, full-stack e-commerce application built with the MERN stack. Forever features a customer-facing storefront, a dedicated admin dashboard, JWT authentication with HTTP-only cookies, Razorpay payments, Cloudinary image hosting, and role-based access control — all deployed on Render and Vercel.

---

## Live Demo

| App                 | URL                                                   |
| ------------------- | ----------------------------------------------------- |
| Customer Storefront | [https://forever-ecommerce-user-store.vercel.app/](#) |
| Admin Dashboard     | [https://forever-ecommerce-admin-store.vercel.app](#) |
| Backend API         | [https://forever-ecommerce-store.onrender.com](#)     |

---

## Features

### Customer App

- Browse products with category, subcategory, and size filters
- Per-size inventory management — out-of-stock sizes are disabled automatically
- Persistent cart synced to the database for logged-in users; LocalStorage for guests
- Guest-to-user cart merge on login
- Razorpay checkout with HMAC SHA-256 webhook verification
- Order history with real-time status tracking
- JWT authentication (HTTP-only cookies + refresh token rotation)
- Protected routes with React Router v6

### Admin Dashboard

- Separate React app with its own auth flow
- Upload and manage products with Cloudinary image hosting (via Multer)
- Update order statuses across all customer orders
- Role-based access control (RBAC) — admin-only routes protected on both client and server

### Backend API

- RESTful API built with Express 5
- Mongoose ODM with aggregation pipelines
- `asyncHandler`, `ApiError`, and `ApiResponse` utilities for consistent error handling
- Refresh token rotation for secure, long-lived sessions
- Input validation and rate limiting middleware

---

## Tech Stack

| Layer            | Technology                                          |
| ---------------- | --------------------------------------------------- |
| Frontend         | React 19, Vite, Tailwind CSS 4, React Router DOM v6 |
| State Management | React Context API                                   |
| Backend          | Node.js, Express 5                                  |
| Database         | MongoDB, Mongoose                                   |
| Authentication   | JWT (access + refresh tokens), HTTP-only cookies    |
| Payments         | Razorpay, HMAC SHA-256 verification                 |
| File Uploads     | Multer, Cloudinary                                  |
| Deployment       | Vercel (frontend/admin), Render (backend)           |

---

## Project Structure

```
forever/
├── frontend/          # Customer-facing React app
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── main.jsx
│   └── vite.config.js
│
├── admin/             # Admin dashboard React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   └── vite.config.js
│
└── backend/           # Express API server
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/         # asyncHandler, ApiError, ApiResponse
    └── server.js
```

---

## API Overview

### Auth

| Method | Endpoint                  | Description                  |
| ------ | ------------------------- | ---------------------------- |
| POST   | `/api/user/register`      | Register new user            |
| POST   | `/api/user/login`         | Login, sets HTTP-only cookie |
| POST   | `/api/user/logout`        | Clears auth cookies          |
| POST   | `/api/user/refresh-token` | Rotate refresh token         |

### Products

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | `/api/product/list`   | Get all products       |
| GET    | `/api/product/:id`    | Get single product     |
| POST   | `/api/product/add`    | Add product (admin)    |
| DELETE | `/api/product/remove` | Remove product (admin) |

### Orders

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/order/place`          | Place an order              |
| POST   | `/api/order/razorpay`       | Initiate Razorpay payment   |
| POST   | `/api/order/verifyRazorpay` | Verify payment with HMAC    |
| GET    | `/api/order/userorders`     | Get user's orders           |
| GET    | `/api/order/list`           | Get all orders (admin)      |
| POST   | `/api/order/status`         | Update order status (admin) |

### Cart

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/api/cart/add`    | Add item to cart          |
| POST   | `/api/cart/update` | Update cart item quantity |
| GET    | `/api/cart/get`    | Get user's cart           |

---

## Key Implementation Details

**Refresh Token Rotation** — Access tokens expire in 15 minutes. On expiry, the client silently calls `/refresh-token` using an HTTP-only cookie. A new access token and rotated refresh token are issued, making token theft significantly harder.

**Razorpay Webhook Verification** — Payment signatures are verified server-side using HMAC SHA-256 before any order is confirmed, preventing spoofed payment callbacks.

**Per-Size Inventory** — Each product stores inventory as a map (`{ S: 10, M: 5, L: 0 }`). The frontend disables out-of-stock sizes, and the backend decrements inventory atomically on order placement.

**Cart Persistence** — Guest carts live in LocalStorage. On login, the guest cart is merged with the user's database cart, with database quantities taking precedence for duplicate items.

---

---

## Author

**Ronak Sakariya**
Frontend Developer | BE Computer Engineering, GTU 2025

---
