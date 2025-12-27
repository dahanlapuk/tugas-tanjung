# Quick Start Guide - PERN E-Commerce

## 🚀 Servers Running

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:5173

---

## 🔐 Login Credentials

### Option 1: Quick Test (User Already Created)
```
Username: admin
Password: admin123
```

### Option 2: Register New User
1. Buka http://localhost:5173/register
2. Isi form registrasi
3. Login dengan credentials yang baru dibuat

### Option 3: Full Migration (Recommended for Complete Data)
```bash
cd "/home/itba/Desktop/ecommerce (2)/MERN/scripts"
node migrate.js
```

After migration, login dengan:
- **Admin**: `admin` / `admin123`
- **Customer**: `customer` / `customer123`

---

## ✅ Testing Checklist

### Frontend Pages
- [ ] Home page (http://localhost:5173)
- [ ] Products page
- [ ] Product detail
- [ ] Cart
- [ ] Checkout
- [ ] Login/Register
- [ ] Profile
- [ ] Orders

### Features to Test
- [ ] Register new user
- [ ] Login
- [ ] Browse products
- [ ] Add to cart
- [ ] View cart
- [ ] Checkout (create order)
- [ ] View orders
- [ ] Update profile

### API Endpoints
- [ ] GET /api/health
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET /api/products
- [ ] POST /api/orders

---

## 🐛 Known Issues

1. **No products in database** - Run migration script or manually add via API
2. **Tables auto-recreated on restart** - Change `force: true` to `alter: true` in production

---

## 📝 Notes

- Database: PostgreSQL (auto-creates tables on startup)
- Stack: PERN (PostgreSQL, Express, React, Node)
- PWA: Service worker enabled
- Auth: JWT tokens with httpOnly cookies

---

**Current Status:** ✅ All systems operational!
