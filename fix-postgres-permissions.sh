#!/bin/bash

echo "🔧 Recreating PostgreSQL database with proper permissions..."

# Drop and recreate database with proper ownership
sudo -u postgres psql <<EOF
DROP DATABASE IF EXISTS ecommerce_bakso_raden;
CREATE DATABASE ecommerce_bakso_raden;
ALTER DATABASE ecommerce_bakso_raden OWNER TO postgres;
\c ecommerce_bakso_raden
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
EOF

echo "✅ Database recreated with proper ownership!"
echo ""
echo "Now restart your server:"
echo "  cd server && npm run dev"
