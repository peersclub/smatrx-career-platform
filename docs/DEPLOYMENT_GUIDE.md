# 🚀 Deployment Guide - SMATRX Career Platform

## Quick Deploy (5 Minutes)

```bash
# 1. Clone and install
git clone <your-repo>
cd smatrx-career-platform
npm install

# 2. Run deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

That's it! The script will guide you through the entire setup.

---

## 📋 Prerequisites

- [x] Node.js 18+ installed
- [x] Git installed
- [x] GitHub account
- [x] Credit card (for services - most have free tiers)

---

## 🗂️ Service Setup (Step-by-Step)

### 1. Vercel (Frontend + API Hosting) - FREE

**Why Vercel?** Built by Next.js creators, zero-config deployments, global CDN, automatic HTTPS.

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Manual Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repo
4. Click "Deploy"
5. Done! ✨

**Environment Variables** (add in Vercel dashboard):
```
DATABASE_URL=<from-neon>
REDIS_URL=<from-upstash>
NEXTAUTH_SECRET=<generate-below>
NEXTAUTH_URL=<your-vercel-url>
```

Generate secret:
```bash
openssl rand -base64 32
```

---

### 2. Neon (PostgreSQL Database) - FREE

**Why Neon?** Serverless Postgres, auto-scaling, generous free tier, instant branching.

**Setup:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Click "Create Project"
4. Choose region (closest to users)
5. Copy connection string
6. Add to Vercel env vars as `DATABASE_URL`

**Connection String Format:**
```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**Initialize Database:**
```bash
# Install Prisma
npm install -D prisma

# Initialize
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

---

### 3. Upstash (Redis for Queues) - FREE

**Why Upstash?** Serverless Redis, pay-per-request, generous free tier, low latency.

**Setup:**
1. Go to [upstash.com](https://upstash.com)
2. Sign up
3. Click "Create Database"
4. Choose "Global" for multi-region
5. Copy Redis URL
6. Add to Vercel as `REDIS_URL`

**Connection Format:**
```
redis://default:password@hostname.upstash.io:6379
```

**Test Connection:**
```bash
# Install Redis CLI
npm install -g redis-cli

# Connect
redis-cli -u $REDIS_URL

# Test
> PING
PONG
```

---

### 4. AWS S3 (File Storage) - FREE (12 months)

**Why S3?** Industry standard, reliable, cheap, integrates everywhere.

**Setup:**
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Create account (free tier)
3. Go to S3 → Create Bucket
4. Name: `smatrx-uploads-prod`
5. Region: `us-east-1`
6. Uncheck "Block all public access" (we'll use signed URLs)
7. Create bucket

**IAM User for Access:**
1. Go to IAM → Users → Create User
2. Name: `smatrx-s3-uploader`
3. Attach policy: `AmazonS3FullAccess`
4. Create access key
5. Copy Access Key ID and Secret

**Environment Variables:**
```bash
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=smatrx-uploads-prod
```

**CORS Configuration** (in S3 bucket):
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

### 5. SendGrid (Email Delivery) - FREE (100/day)

**Why SendGrid?** Reliable delivery, generous free tier, great docs.

**Setup:**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up
3. Go to Settings → API Keys
4. Create API Key (Full Access)
5. Copy key (shown once!)

**Environment Variables:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-api-key>
EMAIL_FROM="SMATRX <noreply@yourdomain.com>"
```

**Domain Verification** (for production):
1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Enter your email
4. Verify email
5. Or set up domain authentication (recommended)

**Alternative: AWS SES** (cheaper for volume):
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=<ses-username>
SMTP_PASS=<ses-password>
```

---

### 6. NextAuth.js (Authentication)

**Setup:**
```bash
npm install next-auth @auth/prisma-adapter
```

Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})

export { GET, POST } from "@/app/api/auth/[...nextauth]/route"
```

**Google OAuth Setup:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project
3. Enable Google+ API
4. Go to Credentials → Create OAuth Client
5. Application Type: Web Application
6. Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Secret

**Environment Variables:**
```bash
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

---

## 🔐 Environment Variables

### Production (.env.production)

```bash
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require

# Redis
REDIS_URL=redis://default:pass@hostname.upstash.io:6379

# Auth
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-secret>

# AWS S3
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=smatrx-uploads-prod

# Email (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<sendgrid-api-key>
EMAIL_FROM="SMATRX <noreply@yourdomain.com>"

# GitHub API (for sync)
GITHUB_CLIENT_ID=<optional>
GITHUB_CLIENT_SECRET=<optional>

# Monitoring (optional)
SENTRY_DSN=<sentry-dsn>
NEXT_PUBLIC_POSTHOG_KEY=<posthog-key>
```

---

## 🗄️ Database Setup

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]

  // Custom fields
  credibilityScore CredibilityScore?
  badges           VerificationBadge[]
  profile          Profile?
  targetRole       TargetRole?
  skills           Skill[]
  education        Education[]
  certifications   Certification[]
  experience       Experience[]
}

model CredibilityScore {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  overallScore    Int      @default(0)
  educationScore  Int      @default(0)
  experienceScore Int      @default(0)
  technicalScore  Int      @default(0)
  socialScore     Int      @default(0)
  certScore       Int      @default(0)

  verificationLevel String @default("basic") // basic, verified, premium, elite

  lastCalculated  DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
}

model VerificationBadge {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  badgeType   String   // verified-email, github-connected, etc.
  earned      Boolean  @default(false)
  progress    Int      @default(0)
  earnedAt    DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, badgeType])
  @@index([userId])
}

// NextAuth models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Migrations

```bash
# Create migration
npx prisma migrate dev --name initial_schema

# Apply to production
npx prisma migrate deploy

# Generate client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## 🚀 Deployment Commands

### First-Time Deployment

```bash
# 1. Install dependencies
npm install

# 2. Build
npm run build

# 3. Deploy to Vercel
vercel --prod

# 4. Set environment variables in Vercel dashboard

# 5. Run migrations
npx prisma migrate deploy

# 6. Verify deployment
curl https://yourdomain.com/api/health
```

### Subsequent Deployments

```bash
# Automatic on git push to main!
git push origin main

# Or manual
vercel --prod
```

---

## 🔄 Background Workers

### Option 1: Vercel Cron (Simple)

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sync-github",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/calculate-scores",
      "schedule": "0 3 * * *"
    }
  ]
}
```

### Option 2: Separate Worker (Recommended)

```bash
# Deploy worker as separate service
cd apps/worker
vercel --prod

# Or use Railway.app for long-running workers
```

Worker process (`apps/worker/index.ts`):
```typescript
import { createSyncWorker } from '@/lib/queue/workers/sync-worker'
import { QueueManager } from '@/lib/queue/queue-manager'

async function main() {
  console.log('Starting worker...')

  // Initialize queue manager
  await QueueManager.getInstance().initialize()

  // Start workers
  const syncWorker = createSyncWorker()

  console.log('Worker running! Press Ctrl+C to exit.')
}

main().catch(console.error)

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  await QueueManager.getInstance().close()
  process.exit(0)
})
```

---

## 📊 Monitoring Setup

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### Posthog (Analytics)

```bash
npm install posthog-js
```

```typescript
// lib/analytics.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com'
  })
}

export { posthog }
```

### BullBoard (Queue Monitoring)

```bash
npm install @bull-board/api @bull-board/nextjs
```

```typescript
// app/admin/queues/route.ts
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { NextAdapter } from '@bull-board/nextjs'
import { getQueueManager } from '@/lib/queue/queue-manager'

const queueManager = getQueueManager()
const queues = Array.from(queueManager.getAllQueues().values())

const serverAdapter = new NextAdapter()

createBullBoard({
  queues: queues.map(q => new BullMQAdapter(q)),
  serverAdapter,
})

export const { GET, POST } = serverAdapter.registerPlugin()
```

Access at: `https://yourdomain.com/admin/queues`

---

## ✅ Pre-Launch Checklist

### Security
- [ ] All environment variables set
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevention (React escaping)
- [ ] CSRF tokens (NextAuth)

### Performance
- [ ] Database indexes created
- [ ] Images optimized (next/image)
- [ ] Code splitting enabled
- [ ] API responses cached
- [ ] CDN configured (automatic with Vercel)

### Functionality
- [ ] Authentication works
- [ ] Database migrations applied
- [ ] Email delivery tested
- [ ] File uploads working
- [ ] Background jobs running
- [ ] All APIs returning data

### Monitoring
- [ ] Sentry configured
- [ ] Analytics tracking
- [ ] Queue monitoring
- [ ] Error alerts set up
- [ ] Uptime monitoring

---

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
npx prisma db push

# Generate client
npx prisma generate
```

### Redis Connection Failed
```bash
# Test Redis
redis-cli -u $REDIS_URL PING

# Check Upstash dashboard for status
```

### Build Failed
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Worker Not Processing Jobs
```bash
# Check worker logs
vercel logs <deployment-url>

# Verify Redis connection
# Check queue health: /admin/queues
```

---

## 📈 Scaling Guide

### When to Scale

**Signs you need to scale:**
- API response time > 1 second
- Queue processing delayed > 5 minutes
- Database CPU > 70%
- Redis memory > 80%

### Scaling Strategies

**1. Database** (Neon):
- Upgrade to Pro plan ($19/month)
- Enable read replicas
- Add connection pooling

**2. Redis** (Upstash):
- Upgrade plan for more bandwidth
- Or switch to Upstash Redis Enterprise

**3. Workers**:
- Deploy multiple worker instances
- Use Railway.app or Render.com
- Scale horizontally (BullMQ supports this)

**4. CDN**:
- Enable Vercel Edge Network
- Use Image Optimization
- Configure ISR for dynamic pages

---

## 💰 Cost Breakdown

### Free Tier (First 3-6 months)
- Vercel: FREE (Hobby)
- Neon: FREE (3GB DB)
- Upstash: FREE (10k requests/day)
- SendGrid: FREE (100 emails/day)
- AWS S3: FREE first year (5GB)

**Total**: $0/month 🎉

### Growing (1,000 users)
- Vercel Pro: $20/month
- Neon Pro: $19/month
- Upstash Pro: $10/month
- SendGrid: $15/month (40k emails)
- S3: ~$5/month

**Total**: ~$70/month

### Scale (10,000+ users)
- Vercel Team: $50/month
- Neon Scale: $50/month
- Upstash: $50/month
- SendGrid: $90/month
- S3: $20/month
- Workers (Railway): $10/month

**Total**: ~$270/month

---

## 🎉 Launch!

```bash
# Final deployment
git add .
git commit -m "feat: launch SMATRX Career Platform 🚀"
git push origin main

# Verify
curl https://yourdomain.com/api/health

# Celebrate! 🎊
```

Your platform is now **LIVE**! 🚀

---

*Need help? Check the [API Integration Guide](./API_INTEGRATION_GUIDE.md)*
