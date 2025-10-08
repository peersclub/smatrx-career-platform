# Database & Redis Setup Checklist

## ✅ Neon PostgreSQL Setup

### 1. Create Neon Account
- [ ] Go to https://neon.tech
- [ ] Sign up with GitHub or email
- [ ] Verify email if needed

### 2. Create Project
- [ ] Click "New Project"
- [ ] Name: `smatrx-production`
- [ ] Database: `smatrx_db`
- [ ] Region: Choose closest to users (e.g., `us-east-2`)
- [ ] Click "Create Project"

### 3. Get Connection Strings
- [ ] Copy **Pooled Connection** string
  ```
  Format: postgresql://...?sslmode=require&pgbouncer=true
  ```
- [ ] Copy **Direct Connection** string
  ```
  Format: postgresql://...?sslmode=require
  ```

### 4. Add to Vercel
- [ ] Go to Vercel → Project → Settings → Environment Variables
- [ ] Add `DATABASE_URL` (pooled connection)
- [ ] Add `DIRECT_URL` (direct connection)
- [ ] Environment: All (Production, Preview, Development)
- [ ] Click "Save"

### 5. Add to Local Environment
- [ ] Edit `.env.local`
- [ ] Add `DATABASE_URL=` (your pooled connection)
- [ ] Add `DIRECT_URL=` (your direct connection)

### 6. Run Migrations
```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to database
pnpm prisma db push

# (Optional) Seed sample data
pnpm prisma db seed

# Verify with Prisma Studio
pnpm prisma studio
```

---

## ✅ Upstash Redis Setup

### 1. Create Upstash Account
- [ ] Go to https://upstash.com
- [ ] Click "Start Free"
- [ ] Sign up with GitHub or email
- [ ] Choose "Redis" (not Kafka)

### 2. Create Redis Database
- [ ] Click "Create Database"
- [ ] Name: `smatrx-queue`
- [ ] Type: Regional (cheaper) or Global (faster)
- [ ] Region: Same as Neon (e.g., `us-east-1`)
- [ ] Eviction: `allkeys-lru`
- [ ] TLS: Enabled (default)
- [ ] Click "Create"

### 3. Get Connection Strings
- [ ] Click your database name
- [ ] Copy from "Redis Clients" → "Node.js" tab:
  ```
  REDIS_URL: rediss://default:TOKEN@host.upstash.io:6379
  ```
- [ ] Copy from "REST API" section:
  ```
  UPSTASH_REDIS_REST_URL: https://host.upstash.io
  UPSTASH_REDIS_REST_TOKEN: your-token-here
  ```

### 4. Add to Vercel
- [ ] Go to Vercel → Project → Settings → Environment Variables
- [ ] Add `REDIS_URL`
- [ ] Add `UPSTASH_REDIS_REST_URL`
- [ ] Add `UPSTASH_REDIS_REST_TOKEN`
- [ ] Environment: All (Production, Preview, Development)
- [ ] Click "Save"

### 5. Add to Local Environment
- [ ] Edit `.env.local`
- [ ] Add `REDIS_URL=` (your Redis URL)
- [ ] Add `UPSTASH_REDIS_REST_URL=`
- [ ] Add `UPSTASH_REDIS_REST_TOKEN=`

---

## 🧪 Test Connections

### Test Database
```bash
# Quick test
pnpm prisma db execute --stdin <<< "SELECT 1;"

# Should output: No errors = success!
```

### Test Redis
```bash
# Install ioredis if needed
pnpm add ioredis

# Quick test
node -e "const Redis = require('ioredis'); const redis = new Redis(process.env.REDIS_URL); redis.ping().then(() => {console.log('✅ Redis connected!'); redis.quit();}).catch(e => {console.log('❌ Failed:', e.message);});"
```

---

## 📝 Your Complete .env.local

After completing all steps, your `.env.local` should look like:

```bash
# Neon PostgreSQL Database
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/smatrx_db?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/smatrx_db?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-generated-secret-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"

# Upstash Redis
REDIS_URL="rediss://default:TOKEN@us1-xxx.upstash.io:6379"
UPSTASH_REDIS_REST_URL="https://us1-xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-rest-token"
```

---

## ✅ Verification Checklist

Before proceeding:

- [ ] Neon account created
- [ ] Neon project created
- [ ] Database connection strings copied
- [ ] Added to Vercel environment variables
- [ ] Added to local .env.local
- [ ] Prisma migrations run successfully
- [ ] Upstash account created
- [ ] Redis database created
- [ ] Redis connection strings copied
- [ ] Added to Vercel environment variables
- [ ] Added to local .env.local
- [ ] Both connections tested successfully

---

## 🚀 Next Steps

Once database and Redis are configured:

1. **Redeploy on Vercel** (if already deployed)
   - Vercel → Deployments → Click "..." → Redeploy
   - This applies the new environment variables

2. **Test the application**
   ```bash
   pnpm dev
   # Visit http://localhost:3000
   ```

3. **Check health endpoint**
   ```bash
   curl http://localhost:3000/api/health
   # Should show database: "ok", redis: "ok"
   ```

4. **Continue with other services**
   - SMTP (SendGrid)
   - File Storage (S3)
   - OAuth providers
   - Monitoring (Sentry, PostHog)

---

## 💰 Cost Breakdown

### Free Tier (Current Setup)
- **Neon**: $0/month (3GB storage, unlimited compute)
- **Upstash**: $0/month (10k commands/day)
- **Total**: $0/month

### When to Upgrade?
- **Neon**: When you exceed 3GB or need more compute
- **Upstash**: When you exceed 10k Redis commands per day

---

## 🐛 Troubleshooting

### Database connection fails
```bash
# Check connection string format
echo $DATABASE_URL

# Test with Prisma
pnpm prisma db execute --stdin <<< "SELECT 1;"
```

### Redis connection fails
```bash
# Check REDIS_URL format (should start with rediss://)
echo $REDIS_URL

# Ensure TLS is enabled in Upstash dashboard
```

### Migrations fail
```bash
# Make sure DIRECT_URL is set (without pgbouncer)
echo $DIRECT_URL

# Try with direct URL
DIRECT_URL=$DIRECT_URL pnpm prisma db push
```

---

**Setup complete! Your database and Redis are ready for production.** ✅
