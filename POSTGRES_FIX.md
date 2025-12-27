# PostgreSQL Permission Error - Fix Guide

## Error
```
✗ Unable to connect to PostgreSQL: permission denied for schema public
```

## Solution

### Option 1: Run Fix Script (Recommended)
```bash
cd "/home/itba/Desktop/ecommerce (2)/MERN"
sudo bash fix-postgres-permissions.sh
```

### Option 2: Manual Fix
Run these commands:

```bash
# Grant database privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ecommerce_bakso_raden TO postgres;"

# Grant schema privileges
sudo -u postgres psql -d ecommerce_bakso_raden -c "GRANT ALL ON SCHEMA public TO postgres;"

# Grant table privileges
sudo -u postgres psql -d ecommerce_bakso_raden -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;"

# Grant sequence privileges
sudo -u postgres psql -d ecommerce_bakso_raden -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;"
```

### Option 3: Use Different PostgreSQL User

Edit `server/.env`:
```env
DB_USER=your_username
DB_PASSWORD=your_password
```

Then restart server.

---

## After Fixing

1. Restart backend server:
```bash
cd server
npm run dev
```

2. Should see:
```
✓ PostgreSQL Connected
✓ Database synced (tables created)
```

3. Then register/login at http://localhost:5173

---

**Run the fix script now!** 🚀
