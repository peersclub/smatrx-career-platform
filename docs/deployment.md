# Deployment Guide

## Overview

This guide covers deploying SMATRX V3 to various platforms and environments. The application is built with Next.js and can be deployed to any platform that supports Node.js applications.

## Prerequisites

- Node.js 18+ installed
- Database (PostgreSQL) configured
- Environment variables set up
- Domain name (for production)

## Environment Setup

### Required Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

### Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE smatrx_production;
   CREATE USER smatrx_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE smatrx_production TO smatrx_user;
   ```

2. **Run migrations**
   ```bash
   pnpm db:migrate
   ```

3. **Seed initial data** (optional)
   ```bash
   pnpm db:seed
   ```

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings

#### 2. Environment Variables

Add all required environment variables in the Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate values
3. Set environment (Production, Preview, Development)

#### 3. Build Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### 4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Railway

Railway provides easy deployment with built-in PostgreSQL.

#### 1. Connect Repository

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Connect GitHub repository
4. Add PostgreSQL service

#### 2. Environment Variables

Set environment variables in Railway dashboard:

```bash
# Railway will auto-generate DATABASE_URL
# Set other variables manually
NEXTAUTH_URL="https://your-app.railway.app"
NEXTAUTH_SECRET="your-secret"
# ... other variables
```

#### 3. Deploy

Railway automatically deploys on git push to main branch.

### DigitalOcean App Platform

#### 1. Create App

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Configure build settings

#### 2. Build Configuration

```yaml
# .do/app.yaml
name: smatrx-v3
services:
- name: web
  source_dir: /
  github:
    repo: your-username/smatrx-v3
    branch: main
  run_command: pnpm start
  build_command: pnpm build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
databases:
- name: postgres
  engine: PG
  version: "15"
```

#### 3. Deploy

```bash
# Install doctl
snap install doctl

# Deploy
doctl apps create --spec .do/app.yaml
```

### AWS (ECS + RDS)

#### 1. Create RDS Database

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier smatrx-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20
```

#### 2. Build Docker Image

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 3. Deploy to ECS

```bash
# Build and push image
docker build -t smatrx-v3 .
docker tag smatrx-v3:latest your-account.dkr.ecr.region.amazonaws.com/smatrx-v3:latest
docker push your-account.dkr.ecr.region.amazonaws.com/smatrx-v3:latest

# Create ECS service
aws ecs create-service \
  --cluster your-cluster \
  --service-name smatrx-v3 \
  --task-definition smatrx-v3:1 \
  --desired-count 1
```

### Docker Deployment

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/smatrx_db
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=smatrx_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### 3. Deploy

```bash
# Build and run
docker-compose up -d

# Or with Docker
docker build -t smatrx-v3 .
docker run -p 3000:3000 smatrx-v3
```

## Production Checklist

### Security

- [ ] Environment variables secured
- [ ] Database credentials encrypted
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] CORS configured
- [ ] Input validation enabled

### Performance

- [ ] CDN configured
- [ ] Image optimization enabled
- [ ] Caching headers set
- [ ] Database indexes optimized
- [ ] Monitoring configured
- [ ] Error tracking enabled

### Monitoring

- [ ] Application monitoring (Sentry, LogRocket)
- [ ] Database monitoring
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Error alerting
- [ ] Log aggregation

### Backup

- [ ] Database backups automated
- [ ] Backup retention policy
- [ ] Disaster recovery plan
- [ ] Data export functionality
- [ ] Point-in-time recovery

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3002
DATABASE_URL=postgresql://localhost:5432/smatrx_dev
```

### Staging

```env
NODE_ENV=production
NEXTAUTH_URL=https://staging.smatrx.com
DATABASE_URL=postgresql://staging-db:5432/smatrx_staging
```

### Production

```env
NODE_ENV=production
NEXTAUTH_URL=https://smatrx.com
DATABASE_URL=postgresql://prod-db:5432/smatrx_production
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run tests
      run: pnpm test
    
    - name: Build application
      run: pnpm build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - pnpm install
    - pnpm test
    - pnpm lint

build:
  stage: build
  image: node:18
  script:
    - pnpm install
    - pnpm build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK_URL
  only:
    - main
```

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000-3002:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/smatrx_db
    deploy:
      replicas: 3
    depends_on:
      - db

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

### Load Balancer Configuration

```nginx
# nginx.conf
upstream app {
    server app_1:3000;
    server app_2:3000;
    server app_3:3000;
}

server {
    listen 80;
    server_name smatrx.com;
    
    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Common Issues

#### Database Connection

```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Test connection from app
node -e "console.log(process.env.DATABASE_URL)"
```

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

#### Memory Issues

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

### Debugging

#### Enable Debug Logging

```env
DEBUG=*
NEXTAUTH_DEBUG=true
```

#### Database Queries

```typescript
// Enable Prisma query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

#### Performance Monitoring

```typescript
// Add performance monitoring
import { performance } from 'perf_hooks';

const start = performance.now();
// ... operation
const end = performance.now();
console.log(`Operation took ${end - start} milliseconds`);
```

## Maintenance

### Database Maintenance

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Application Updates

```bash
# Zero-downtime deployment
docker-compose up -d --no-deps app
docker-compose restart nginx

# Rollback if needed
docker-compose down
docker-compose up -d
```

### Monitoring Commands

```bash
# Check application health
curl -f http://localhost:3000/api/health || exit 1

# Check database connectivity
psql $DATABASE_URL -c "SELECT 1;" || exit 1

# Check disk space
df -h

# Check memory usage
free -h
```
