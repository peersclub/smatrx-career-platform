#!/bin/bash

echo "🧪 Testing Database and Redis Connections..."
echo ""

# Test database connection
echo "1️⃣ Testing Neon PostgreSQL..."
pnpm prisma db execute --stdin <<< "SELECT 1 as test;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Database connection successful!"
else
    echo "   ❌ Database connection failed!"
    echo "   Check your DATABASE_URL in .env.local"
fi

echo ""
echo "2️⃣ Testing Redis connection..."
# We'll create a simple test script
echo ""
echo "Run this to test Redis:"
echo "  node -e \"const Redis = require('ioredis'); const redis = new Redis(process.env.REDIS_URL); redis.ping().then(() => {console.log('✅ Redis connected!'); redis.quit();}).catch(e => {console.log('❌ Redis failed:', e.message); redis.quit();});\""

