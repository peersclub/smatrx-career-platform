# SMATRX Deployment & Management Scripts

This directory contains automation scripts for deploying, managing, and monitoring the SMATRX Career Platform.

---

## 📜 Available Scripts

### 🚀 `deploy.sh` - Production Deployment

Automates the complete deployment process to production.

**Usage:**
```bash
./scripts/deploy.sh [environment]
```

**What it does:**
1. ✓ Checks prerequisites (Node.js, pnpm, Vercel CLI)
2. ✓ Validates environment variables
3. ✓ Runs test suite
4. ✓ Builds the application
5. ✓ Runs database migrations
6. ✓ Deploys to Vercel
7. ✓ Verifies deployment
8. ✓ Runs post-deployment checks

**Examples:**
```bash
# Deploy to production
./scripts/deploy.sh production

# Deploy to preview environment
./scripts/deploy.sh
```

---

### 🗄️ `db-setup.sh` - Database Management

Interactive database setup and migration helper.

**Usage:**
```bash
./scripts/db-setup.sh [command]
```

**Available Commands:**

| Command | Description |
|---------|-------------|
| `init` | Initialize Prisma (first-time setup) |
| `generate` | Generate Prisma Client |
| `migrate` | Run pending migrations |
| `create` | Create a new migration |
| `reset` | Reset database (⚠️ DESTRUCTIVE) |
| `seed` | Seed database with sample data |
| `check` | Check database connection |
| `studio` | Open Prisma Studio |
| `status` | Show migration status |
| `backup` | Create database backup |
| `validate` | Validate Prisma schema |
| `format` | Format Prisma schema file |
| `help` | Show help message |

**Examples:**
```bash
# Run pending migrations
./scripts/db-setup.sh migrate

# Create a new migration
./scripts/db-setup.sh create

# Open Prisma Studio
./scripts/db-setup.sh studio

# Check database connection
./scripts/db-setup.sh check
```

---

### 📊 `setup-monitoring.sh` - Monitoring Setup

Interactive setup wizard for monitoring and analytics services.

**Usage:**
```bash
./scripts/setup-monitoring.sh
```

**Services Configured:**
1. **Sentry** - Error tracking and performance monitoring
2. **PostHog** - Product analytics and feature flags
3. **BullBoard** - Queue monitoring dashboard
4. **Vercel Analytics** - Web vitals and performance
5. **Health Check Endpoint** - Creates `/api/health`

**What it does:**
- Guides you through service setup
- Adds credentials to `.env.local`
- Installs required packages
- Creates monitoring endpoints
- Generates monitoring checklist

**Interactive Menu:**
```
1) Sentry (Error Tracking)
2) PostHog (Analytics)
3) BullBoard (Queue Monitoring)
4) Vercel Analytics
5) Create Health Check Endpoint
6) Uptime Monitoring Info
7) Logging Setup Info
8) Generate Monitoring Checklist
9) Setup All
0) Exit
```

---

### 🛠️ `dev-setup.sh` - Development Environment Setup

One-command setup for local development environment.

**Usage:**
```bash
./scripts/dev-setup.sh
```

**What it does:**
1. ✓ Checks Node.js version (18+)
2. ✓ Installs pnpm if missing
3. ✓ Checks Docker availability
4. ✓ Installs project dependencies
5. ✓ Creates `.env.local` from template
6. ✓ Generates NextAuth secret
7. ✓ Starts local PostgreSQL and Redis (optional)
8. ✓ Sets up Prisma and runs migrations
9. ✓ Creates admin user (optional)

**Perfect for:**
- New developers joining the project
- Setting up on a new machine
- Resetting development environment

---

## 🎯 Quick Start Guides

### First-Time Setup (New Developer)

```bash
# 1. Clone the repository
git clone <repository-url>
cd smatrx-career-platform

# 2. Run development setup
./scripts/dev-setup.sh

# 3. Start the development server
pnpm dev

# 4. Open http://localhost:3000
```

---

### Deploying to Production

```bash
# 1. Ensure all tests pass
pnpm test
pnpm lint

# 2. Review the production checklist
cat docs/PRODUCTION_CHECKLIST.md

# 3. Run deployment script
./scripts/deploy.sh production

# 4. Monitor deployment
# Check Vercel dashboard, Sentry, and uptime monitor
```

---

### Database Operations

```bash
# Create a new migration
./scripts/db-setup.sh create

# Apply migrations to production
DATABASE_URL="postgresql://..." ./scripts/db-setup.sh migrate

# Backup production database
DATABASE_URL="postgresql://..." ./scripts/db-setup.sh backup

# Open Prisma Studio to view data
./scripts/db-setup.sh studio
```

---

## 🔐 Environment Variables

All scripts respect environment variables from:
1. `.env.local` (development)
2. `.env.production` (production)
3. Environment-specific variables
4. Vercel dashboard (for deployments)

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `REDIS_URL` - Redis connection string

See `.env.example` for complete list.

---

## 📋 Pre-Deployment Checklist

Before running `deploy.sh`, ensure:

- [ ] All tests passing (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] No TypeScript errors (`pnpm tsc --noEmit`)
- [ ] Environment variables set in Vercel
- [ ] Database migrations reviewed
- [ ] Monitoring configured (Sentry, PostHog)
- [ ] Reviewed `docs/PRODUCTION_CHECKLIST.md`

---

## 🐛 Troubleshooting

### "Command not found: pnpm"
```bash
npm install -g pnpm
```

### "Command not found: vercel"
```bash
pnpm install -g vercel
```

### "Database connection failed"
Check your `DATABASE_URL` in `.env.local`:
```bash
./scripts/db-setup.sh check
```

### "Permission denied"
Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### "Docker not running"
Start Docker Desktop or use cloud services (Neon, Upstash) instead.

---

## 🔄 CI/CD Integration

These scripts can be integrated into CI/CD pipelines:

**GitHub Actions Example:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: ./scripts/deploy.sh production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 📚 Related Documentation

- [Production Checklist](../docs/PRODUCTION_CHECKLIST.md)
- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)
- [API Integration Guide](../docs/API_INTEGRATION_GUIDE.md)
- [Phase 3 Architecture](../docs/PHASE_3_ARCHITECTURE.md)

---

## 💡 Tips & Best Practices

1. **Always test locally first**
   ```bash
   pnpm build
   pnpm start
   ```

2. **Use migrations for schema changes**
   ```bash
   ./scripts/db-setup.sh create
   ```

3. **Monitor after deployment**
   - Check Sentry for errors
   - Review Vercel deployment logs
   - Test critical user flows

4. **Backup before major changes**
   ```bash
   ./scripts/db-setup.sh backup
   ```

5. **Keep environments in sync**
   - Development: `.env.local`
   - Production: Vercel dashboard

---

## 🤝 Contributing

When adding new scripts:

1. Follow the existing naming convention
2. Add colored output (see existing scripts)
3. Include error handling (`set -e`)
4. Make scripts executable (`chmod +x`)
5. Update this README
6. Test on clean environment

---

## 📞 Support

For issues with scripts:

1. Check script output for error messages
2. Review related documentation
3. Check environment variables
4. Ensure all prerequisites installed
5. Open GitHub issue if needed

---

**Last Updated**: 2025
**Version**: 1.0
**Status**: Production Ready ✅
