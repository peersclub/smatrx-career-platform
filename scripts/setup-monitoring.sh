#!/bin/bash

# ==================================
# Monitoring & Analytics Setup
# ==================================
# Automates setup of monitoring and analytics services
# Usage: ./scripts/setup-monitoring.sh
# ==================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_header() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

# Check if jq is installed
check_jq() {
    if ! command -v jq >/dev/null 2>&1; then
        print_warning "jq not installed. Some features may not work."
        print_info "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    fi
}

# Setup Sentry
setup_sentry() {
    print_header "Setting Up Sentry Error Tracking"

    echo "Sentry provides real-time error tracking and performance monitoring."
    echo ""
    echo "Steps to set up Sentry:"
    echo "  1. Go to https://sentry.io and create an account (free tier available)"
    echo "  2. Create a new project (select Next.js)"
    echo "  3. Copy your DSN from the project settings"
    echo ""

    read -p "Do you have a Sentry DSN? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Sentry DSN: " sentry_dsn
        read -p "Enter your Sentry Organization slug: " sentry_org
        read -p "Enter your Sentry Project slug: " sentry_project

        # Add to .env.local
        {
            echo ""
            echo "# Sentry Configuration"
            echo "SENTRY_DSN=\"$sentry_dsn\""
            echo "SENTRY_ORG=\"$sentry_org\""
            echo "SENTRY_PROJECT=\"$sentry_project\""
        } >> .env.local

        print_success "Sentry configuration added to .env.local"

        # Install Sentry SDK
        print_info "Installing Sentry SDK..."
        pnpm add @sentry/nextjs

        print_success "Sentry setup complete!"
        print_info "Run: pnpm sentry:init to complete integration"
    else
        print_info "Skipping Sentry setup"
        print_info "You can set it up later by running this script again"
    fi
}

# Setup PostHog
setup_posthog() {
    print_header "Setting Up PostHog Analytics"

    echo "PostHog provides product analytics, feature flags, and session recordings."
    echo ""
    echo "Steps to set up PostHog:"
    echo "  1. Go to https://posthog.com and create an account (generous free tier)"
    echo "  2. Create a new project"
    echo "  3. Copy your Project API Key from Project Settings"
    echo ""

    read -p "Do you have a PostHog API key? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your PostHog API Key: " posthog_key
        read -p "Enter your PostHog Host (or press Enter for default): " posthog_host

        posthog_host=${posthog_host:-https://app.posthog.com}

        # Add to .env.local
        {
            echo ""
            echo "# PostHog Configuration"
            echo "NEXT_PUBLIC_POSTHOG_KEY=\"$posthog_key\""
            echo "NEXT_PUBLIC_POSTHOG_HOST=\"$posthog_host\""
        } >> .env.local

        print_success "PostHog configuration added to .env.local"

        # Install PostHog SDK
        print_info "Installing PostHog SDK..."
        pnpm add posthog-js

        print_success "PostHog setup complete!"
    else
        print_info "Skipping PostHog setup"
    fi
}

# Setup BullBoard (Queue Monitoring)
setup_bullboard() {
    print_header "Setting Up BullBoard (Queue Monitoring)"

    echo "BullBoard provides a web UI to monitor BullMQ queues."
    echo ""

    read -p "Do you want to install BullBoard? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing BullBoard..."
        pnpm add @bull-board/api @bull-board/nextjs

        print_success "BullBoard installed!"
        print_info "Access BullBoard at: /api/admin/queues (after deployment)"

        print_warning "Remember to add authentication to the BullBoard route!"
    else
        print_info "Skipping BullBoard setup"
    fi
}

# Setup Vercel Analytics
setup_vercel_analytics() {
    print_header "Setting Up Vercel Analytics"

    echo "Vercel Analytics provides web vitals and performance monitoring."
    echo "It's automatically enabled when deployed to Vercel."
    echo ""

    read -p "Do you want to enable Vercel Analytics? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing Vercel Analytics..."
        pnpm add @vercel/analytics

        {
            echo ""
            echo "# Vercel Analytics"
            echo "NEXT_PUBLIC_VERCEL_ANALYTICS=\"true\""
        } >> .env.local

        print_success "Vercel Analytics enabled!"
        print_info "Import and use <Analytics /> component in your layout"
    else
        print_info "Skipping Vercel Analytics setup"
    fi
}

# Setup Uptime Monitoring
setup_uptime_monitoring() {
    print_header "Setting Up Uptime Monitoring"

    echo "Recommended uptime monitoring services:"
    echo "  1. BetterUptime (https://betteruptime.com) - Free tier: 10 monitors"
    echo "  2. UptimeRobot (https://uptimerobot.com) - Free tier: 50 monitors"
    echo "  3. Checkly (https://checklyhq.com) - API monitoring + browser checks"
    echo ""

    read -p "Have you set up uptime monitoring? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success "Great! Make sure to monitor these endpoints:"
        echo "  - / (homepage)"
        echo "  - /api/health (health check)"
        echo "  - /api/credibility (API endpoint)"
    else
        print_warning "Consider setting up uptime monitoring for production"
    fi
}

# Create health check endpoint
create_health_check() {
    print_header "Creating Health Check Endpoint"

    local health_check_dir="apps/web/app/api/health"
    local health_check_file="$health_check_dir/route.ts"

    if [ -f "$health_check_file" ]; then
        print_info "Health check endpoint already exists"
        return
    fi

    mkdir -p "$health_check_dir"

    cat > "$health_check_file" << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Health Check Endpoint
 * Used by uptime monitoring services to verify the application is running
 *
 * Checks:
 * - API is responding
 * - Database connection is working
 * - Redis connection is working (if configured)
 */
export async function GET(request: NextRequest) {
  const checks = {
    api: 'ok',
    database: 'unknown',
    redis: 'unknown',
    timestamp: new Date().toISOString()
  }

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch (error) {
    checks.database = 'error'
  }

  // Check Redis connection (if queue is configured)
  try {
    // Uncomment when queue is set up:
    // const queue = getQueue(QUEUE_NAMES.SYNC)
    // await queue.client.ping()
    // checks.redis = 'ok'
    checks.redis = 'not_configured'
  } catch (error) {
    checks.redis = 'error'
  }

  const allHealthy = checks.database === 'ok' && checks.api === 'ok'

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      checks
    },
    {
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    }
  )
}
EOF

    print_success "Health check endpoint created at /api/health"
}

# Setup log aggregation
setup_logging() {
    print_header "Log Aggregation Setup"

    echo "Recommended logging services:"
    echo "  1. Datadog (https://datadoghq.com) - Full observability platform"
    echo "  2. Logtail (https://logtail.com) - Simple log management"
    echo "  3. Better Stack Logs (https://betterstack.com/logs) - Modern logging"
    echo ""

    print_info "For now, logs are available in:"
    echo "  - Vercel dashboard (Functions > Logs)"
    echo "  - Sentry (if configured)"
    echo ""

    read -p "Have you set up log aggregation? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success "Excellent! Centralized logging is crucial for debugging."
    else
        print_info "Vercel provides basic logging out of the box"
    fi
}

# Generate monitoring checklist
generate_checklist() {
    print_header "Generating Monitoring Checklist"

    local checklist_file="docs/MONITORING_CHECKLIST.md"

    cat > "$checklist_file" << 'EOF'
# Monitoring & Observability Checklist

## Error Tracking
- [ ] Sentry configured and receiving errors
- [ ] Error alerts configured (Slack/Email)
- [ ] Source maps uploaded for stack traces
- [ ] Performance monitoring enabled

## Analytics
- [ ] PostHog tracking events
- [ ] User identification working
- [ ] Feature flags configured (if using)
- [ ] Session recordings enabled (optional)

## Uptime Monitoring
- [ ] Homepage monitored
- [ ] Health check endpoint monitored (/api/health)
- [ ] Critical API endpoints monitored
- [ ] Alert notifications configured

## Queue Monitoring
- [ ] BullBoard dashboard accessible
- [ ] Queue metrics being tracked
- [ ] Failed job alerts configured
- [ ] Queue workers running

## Performance
- [ ] Vercel Analytics enabled
- [ ] Web Vitals tracked
- [ ] API response times monitored
- [ ] Database query performance tracked

## Logs
- [ ] Application logs centralized
- [ ] Log retention configured
- [ ] Log search working
- [ ] Critical log alerts set up

## Infrastructure
- [ ] Database backups automated
- [ ] Redis backup/persistence configured
- [ ] S3 bucket monitoring enabled
- [ ] SSL certificate expiry monitoring

## Alerts
- [ ] On-call rotation set up
- [ ] Alert escalation policies defined
- [ ] Runbooks created for common issues
- [ ] Status page configured (optional)

## Security
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Vulnerability scanning enabled
- [ ] Dependency updates automated (Dependabot)

## Testing in Production
- [ ] Feature flags for gradual rollouts
- [ ] A/B testing configured (optional)
- [ ] Canary deployments set up (optional)
- [ ] Rollback procedure documented
EOF

    print_success "Monitoring checklist created at $checklist_file"
}

# Main menu
show_menu() {
    print_header "SMATRX Monitoring Setup"

    echo "Select services to set up:"
    echo ""
    echo "  1) Sentry (Error Tracking)"
    echo "  2) PostHog (Analytics)"
    echo "  3) BullBoard (Queue Monitoring)"
    echo "  4) Vercel Analytics"
    echo "  5) Create Health Check Endpoint"
    echo "  6) Uptime Monitoring Info"
    echo "  7) Logging Setup Info"
    echo "  8) Generate Monitoring Checklist"
    echo "  9) Setup All"
    echo "  0) Exit"
    echo ""
    read -p "Enter your choice: " choice

    case $choice in
        1) setup_sentry ;;
        2) setup_posthog ;;
        3) setup_bullboard ;;
        4) setup_vercel_analytics ;;
        5) create_health_check ;;
        6) setup_uptime_monitoring ;;
        7) setup_logging ;;
        8) generate_checklist ;;
        9)
            setup_sentry
            setup_posthog
            setup_bullboard
            setup_vercel_analytics
            create_health_check
            generate_checklist
            print_success "All monitoring services configured!"
            ;;
        0)
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            show_menu
            ;;
    esac

    echo ""
    read -p "Setup another service? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        show_menu
    fi
}

# Main function
main() {
    check_jq
    show_menu
}

# Run main function
main "$@"
