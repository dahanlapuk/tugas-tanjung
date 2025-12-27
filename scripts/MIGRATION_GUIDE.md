# Migration Script Configuration

## MySQL to PostgreSQL Migration

### Setup MySQL Credentials

Edit `scripts/migrate.js` line 24-27 and set your MySQL password:

```javascript
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD_HERE', // <-- Change this!
    database: 'ecommerce'
};
```

### Or use Environment Variables

Add to `server/.env`:

```env
# MySQL Configuration (for migration)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=ecommerce
```

### Run Migration

```bash
cd scripts
node migrate.js
```

---

## Alternative: Skip Migration

Jika tidak perlu data dari MySQL lama, Anda bisa:

1. **Gunakan user yang sudah dibuat:**
   - Username: `admin`
   - Password: `admin123`

2. **Atau register user baru** di http://localhost:5173/register

3. **Manual add products via API** (optional)

---

## Troubleshooting

### Error: Access denied for user 'root'@'localhost'

**Solution:** Set MySQL password di `migrate.js` atau `.env`

### Error: Unknown database 'ecommerce'

**Solution:** Create database dulu:
```sql
CREATE DATABASE ecommerce;
```

### Error: Table doesn't exist

**Solution:** Pastikan MySQL database lama masih ada dan accessible
