# Bakso Raden E-Commerce - Backend Server

Backend API untuk aplikasi e-commerce Mie Ayam Bakso Raden menggunakan Node.js, Express, dan MongoDB.

## Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- npm atau yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy `.env` file dan sesuaikan konfigurasi:
```bash
cp .env.example .env
```

3. Pastikan MongoDB sudah running

4. Start development server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/updatepassword` - Update password

### Products
- `GET /api/products` - Get all products (dengan pagination, filter, search)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/sku/:sku` - Get product by SKU
- `GET /api/products/best-deal` - Get best deal product
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders
- `GET /api/orders` - Get orders (all for admin, user's orders for customer)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce_bakso_raden
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## Default Admin Account

Setelah migrasi data, gunakan akun ini untuk login sebagai admin:
- Username: `admin`
- Password: `admin123`

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Project Structure

```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # Uploaded files
└── server.js        # Entry point
```
