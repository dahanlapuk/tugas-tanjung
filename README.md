# Bakso Raden E-Commerce - MERN Stack + PWA

Aplikasi e-commerce modern untuk Mie Ayam Bakso Raden menggunakan MERN Stack (MongoDB, Express.js, React, Node.js) dengan fitur Progressive Web App (PWA).

## 🚀 Features

### Customer Features
- ✅ Browse products dengan filter dan search
- ✅ Product detail dengan related products
- ✅ Shopping cart management
- ✅ Checkout dengan kupon diskon
- ✅ Multiple payment methods
- ✅ Upload bukti pembayaran
- ✅ Order tracking
- ✅ Order history
- ✅ Product reviews
- ✅ User profile management
- 📱 PWA - Install to home screen
- 📱 Offline support
- 🔔 Push notifications untuk update pesanan

### Admin Features
- 📊 Dashboard dengan statistik
- 📦 Product management (CRUD)
- 📂 Category management
- 📋 Order management
- 💳 Payment verification
- 🎟️ Coupon management
- 👥 Customer management
- 📧 Contact/message management

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB dengan Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, bcryptjs

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS dengan modern design system

### PWA
- **Service Worker**: Workbox
- **Caching Strategies**: Network First, Cache First, Stale While Revalidate
- **Offline Support**: Fallback pages
- **Push Notifications**: Web Push API

## 📁 Project Structure

```
MERN/
├── server/                 # Backend API
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── uploads/           # Uploaded files
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Entry point
│
├── client/                # Frontend React app
│   ├── public/            # Static files
│   │   ├── manifest.json  # PWA manifest
│   │   └── sw.js          # Service worker
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand stores
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── scripts/               # Utility scripts
    ├── migrate.js         # MySQL to MongoDB migration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- npm atau yarn

### Installation

1. **Clone repository** (atau gunakan existing directory)

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

3. **Setup Frontend**
```bash
cd ../client
npm install
```

4. **Migrate Data dari MySQL ke MongoDB** (opsional)
```bash
cd ../scripts
npm install
npm run migrate
```

### Running the Application

1. **Start MongoDB**
```bash
mongod
```

2. **Start Backend Server**
```bash
cd server
npm run dev
```
Server akan berjalan di `http://localhost:5000`

3. **Start Frontend Development Server**
```bash
cd client
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

## 📝 Default Accounts

### Admin Account
- Username: `admin`
- Password: `admin123`

### Customer Account
- Username: `customer`
- Password: `customer123`

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce_bakso_raden
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Mie Ayam Bakso Raden
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/updatepassword` - Update password

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/sku/:sku` - Get product by SKU
- `GET /api/products/best-deal` - Get best deal
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin)

[See full API documentation in server/README.md]

## 🎨 Design System

Aplikasi menggunakan modern design system dengan:
- **Color Palette**: Primary, Secondary, Accent colors
- **Typography**: Responsive font scale
- **Spacing**: Consistent spacing system
- **Components**: Reusable UI components
- **Animations**: Smooth transitions dan micro-interactions
- **Dark Mode**: Support (optional)

## 📱 PWA Features

### Offline Support
- Cached products tetap accessible offline
- Offline fallback page
- Background sync untuk orders

### Install to Home Screen
- Custom install prompt
- Standalone app experience
- App icons untuk berbagai devices

### Push Notifications
- Order status updates
- Payment confirmation
- Promotional notifications

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd client
npm test
npm run test:ui
```

## 🚀 Deployment

### Backend Deployment
Recommended platforms:
- Railway
- Render
- DigitalOcean
- Heroku

### Frontend Deployment
Recommended platforms:
- Vercel
- Netlify
- Cloudflare Pages

### Database
- MongoDB Atlas (recommended)
- Self-hosted MongoDB

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Developer: [Hexadev Technologies]

## 📞 Support

Untuk pertanyaan atau bantuan, silakan hubungi:
- Email: mieayambaksoraden@gmail.com
- Phone: (+62) 851-9001-1008

---

**Made with ❤️ using MERN Stack**
