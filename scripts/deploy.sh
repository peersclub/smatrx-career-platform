#!/bin/bash

# ==================================
# SMATRX Career Platform - Deployment Script
# ==================================
# This script automates the deployment process to production
# Run with: ./scripts/deploy.sh [environment]
# ==================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-production}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}===================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verify prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    local missing_deps=()

    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi

    if ! command_exists pnpm; then
        missing_deps+=("pnpm")
    fi

    if ! command_exists vercel; then
        print_warning "Vercel CLI not found. Installing..."
        pnpm install -g vercel
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi

    print_success "All prerequisites installed"
}

# Verify environment variables
check_environment() {
    print_header "Checking Environment Configuration"

    local required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "REDIS_URL"
    )

    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_warning "Missing environment variables: ${missing_vars[*]}"
        print_info "Set these in your Vercel dashboard or .env.production file"

        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "All required environment variables are set"
    fi
}

# Run tests
run_tests() {
    print_header "Running Tests"

    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        print_info "Running test suite..."
        pnpm test || {
            print_error "Tests failed"
            read -p "Continue deployment anyway? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        }
        print_success "Tests passed"
    else
        print_warning "No tests configured"
    fi
}

# Build the application
build_application() {
    print_header "Building Application"

    print_info "Installing dependencies..."
    pnpm install --frozen-lockfile

    print_info "Running Prisma generate..."
    pnpm prisma generate

    print_info "Building Next.js application..."
    pnpm build

    print_success "Build completed successfully"
}

# Run database migrations
run_migrations() {
    print_header "Running Database Migrations"

    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set, skipping migrations"
        return
    fi

    print_info "Running Prisma migrations..."
    pnpm prisma migrate deploy

    print_success "Migrations completed"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_header "Deploying to Vercel"

    local vercel_args=""

    if [ "$ENVIRONMENT" = "production" ]; then
        vercel_args="--prod"
        print_info "Deploying to PRODUCTION"
    else
        print_info "Deploying to PREVIEW"
    fi

    print_info "Running Vercel deployment..."
    vercel deploy $vercel_args

    print_success "Deployment completed"
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment"

    print_info "Checking deployment URL..."

    # Get the deployment URL from Vercel
    local deployment_url=$(vercel inspect --json | jq -r '.url' 2>/dev/null)

    if [ -z "$deployment_url" ]; then
        print_warning "Could not retrieve deployment URL"
        return
    fi

    print_info "Deployment URL: https://$deployment_url"

    # Check if deployment is accessible
    if command_exists curl; then
        print_info "Checking if deployment is live..."
        if curl -s -f -o /dev/null "https://$deployment_url"; then
            print_success "Deployment is accessible"
        else
            print_warning "Deployment URL is not responding yet (may take a few moments)"
        fi
    fi
}

# Run post-deployment tasks
post_deployment() {
    print_header "Post-Deployment Tasks"

    print_info "Running post-deployment checks..."

    # Check if health endpoint exists
    if [ -f "apps/web/app/api/health/route.ts" ]; then
        print_success "Health check endpoint exists"
    else
        print_warning "No health check endpoint found"
    fi

    # Check if monitoring is configured
    if [ -n "$SENTRY_DSN" ]; then
        print_success "Sentry monitoring configured"
    else
        print_warning "Sentry monitoring not configured"
    fi

    # Check if analytics is configured
    if [ -n "$NEXT_PUBLIC_POSTHOG_KEY" ]; then
        print_success "PostHog analytics configured"
    else
        print_warning "PostHog analytics not configured"
    fi
}

# Display deployment summary
show_summary() {
    print_header "Deployment Summary"

    echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
    echo ""
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo ""
    echo "Next steps:"
    echo "  1. Verify the deployment at your production URL"
    echo "  2. Check error monitoring in Sentry (if configured)"
    echo "  3. Monitor queue health at /api/admin/queue-health"
    echo "  4. Test critical user flows"
    echo ""
    print_success "All done! 🚀"
}

# Main deployment flow
main() {
    print_header "SMATRX Career Platform - Deployment"

    echo "Environment: $ENVIRONMENT"
    echo "Project: $PROJECT_ROOT"
    echo ""

    # Change to project directory
    cd "$PROJECT_ROOT"

    # Run deployment steps
    check_prerequisites
    check_environment
    run_tests
    build_application
    run_migrations
    deploy_to_vercel
    verify_deployment
    post_deployment
    show_summary
}

# Handle script errors
trap 'print_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"
