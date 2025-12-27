# Bakso Raden - Frontend (React + Vite + PWA)

Frontend aplikasi e-commerce Mie Ayam Bakso Raden menggunakan React, Vite, dan Progressive Web App features.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool & dev server
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing (to be installed)
- **PWA** - Service Worker, Manifest, Offline support

## 📁 Project Structure

```
src/
├── api/              # API client & services
│   ├── client.js     # Axios instance with interceptors
│   └── index.js      # All API endpoints
├── components/       # React components
│   ├── layout/       # Header, Footer, Navbar
│   ├── product/      # Product components
│   ├── cart/         # Cart components
│   └── auth/         # Auth components
├── pages/            # Page components
├── stores/           # Zustand stores
│   ├── authStore.js  # Authentication state
│   └── cartStore.js  # Shopping cart state
├── utils/            # Utility functions
│   ├── helpers.js    # Format, validation helpers
│   └── pwa.js        # PWA utilities
├── assets/           # Images, fonts, etc
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Install additional packages
npm install react-router-dom zustand axios
```

## 🏃 Running the App

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Mie Ayam Bakso Raden
VITE_UPLOAD_URL=http://localhost:5000/uploads
```

## 📱 PWA Features

### Service Worker
- Caching strategies (Cache First, Network First)
- Offline support
- Background sync
- Push notifications

### Manifest
- Install to home screen
- Standalone app mode
- Custom icons & splash screens
- App shortcuts

### Offline Support
- Cached products available offline
- Offline fallback page
- Auto-reload when back online

## 🎨 Design System (To be implemented)

The app will use a modern design system with:
- Custom CSS properties for theming
- Responsive typography
- Color palette (Primary: Red, Secondary: Dark)
- Spacing system
- Reusable components
- Smooth animations

## 🔧 API Integration

All API calls are centralized in `src/api/index.js`:

```javascript
import { productAPI, authAPI, orderAPI } from './api';

// Example usage
const products = await productAPI.getAll({ page: 1, limit: 12 });
const user = await authAPI.login({ username, password });
```

## 📦 State Management

### Auth Store
```javascript
import useAuthStore from './stores/authStore';

const { user, setAuth, logout } = useAuthStore();
```

### Cart Store
```javascript
import useCartStore from './stores/cartStore';

const { items, addItem, removeItem, getTotal } = useCartStore();
```

## 🚀 Next Steps

1. Install React Router: `npm install react-router-dom`
2. Create component library
3. Build pages (Home, Products, Cart, Checkout, etc.)
4. Implement routing
5. Add styling (CSS)
6. Test PWA features
7. Build & deploy

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Features to Implement

- [ ] Product listing with filters
- [ ] Product detail page
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] User authentication
- [ ] Order tracking
- [ ] User profile
- [ ] Admin dashboard
- [ ] PWA install prompt
- [ ] Push notifications

## 📄 License

MIT
