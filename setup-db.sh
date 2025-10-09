#!/bin/bash

echo "🗄️  Setting up PostgreSQL database..."

# Create Victor user as superuser using postgres (default superuser)
/opt/homebrew/opt/postgresql@14/bin/createuser -s Victor 2>/dev/null || echo "Victor user may exist"

# Now create smatrx user with password
psql postgres -c "CREATE USER smatrx WITH PASSWORD 'smatrx_dev_2024' CREATEDB;" 2>/dev/null || psql postgres -c "ALTER USER smatrx WITH PASSWORD 'smatrx_dev_2024';"

# Create database
psql postgres -c "CREATE DATABASE smatrx_db OWNER smatrx;" 2>/dev/null || echo "Database may exist"

# Grant privileges
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE smatrx_db TO smatrx;"

echo "✅ Database setup complete!"
