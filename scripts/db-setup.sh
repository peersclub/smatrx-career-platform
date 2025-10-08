#!/bin/bash

# ==================================
# Database Setup & Migration Helper
# ==================================
# Automates database setup for development and production
# Usage: ./scripts/db-setup.sh [command]
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

# Check if DATABASE_URL is set
check_database_url() {
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL environment variable is not set"
        echo "Please set DATABASE_URL in your .env file or environment"
        exit 1
    fi
    print_success "DATABASE_URL is configured"
}

# Initialize Prisma (first-time setup)
init_prisma() {
    print_header "Initializing Prisma"

    if [ ! -f "prisma/schema.prisma" ]; then
        print_info "Creating Prisma schema..."
        pnpm prisma init
        print_success "Prisma initialized"
    else
        print_info "Prisma schema already exists"
    fi
}

# Generate Prisma Client
generate_client() {
    print_header "Generating Prisma Client"

    print_info "Running prisma generate..."
    pnpm prisma generate

    print_success "Prisma Client generated successfully"
}

# Create a new migration
create_migration() {
    print_header "Creating New Migration"

    read -p "Enter migration name: " migration_name

    if [ -z "$migration_name" ]; then
        print_error "Migration name cannot be empty"
        exit 1
    fi

    print_info "Creating migration: $migration_name"
    pnpm prisma migrate dev --name "$migration_name"

    print_success "Migration created successfully"
}

# Run pending migrations
run_migrations() {
    print_header "Running Migrations"

    check_database_url

    print_info "Applying pending migrations..."
    pnpm prisma migrate deploy

    print_success "All migrations applied successfully"
}

# Reset database (DESTRUCTIVE)
reset_database() {
    print_header "Reset Database"

    print_warning "⚠️  WARNING: This will DELETE ALL DATA in your database!"
    read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation

    if [ "$confirmation" != "yes" ]; then
        print_info "Database reset cancelled"
        exit 0
    fi

    print_info "Resetting database..."
    pnpm prisma migrate reset --force

    print_success "Database reset completed"
}

# Seed database with sample data
seed_database() {
    print_header "Seeding Database"

    check_database_url

    if [ -f "prisma/seed.ts" ]; then
        print_info "Running seed script..."
        pnpm prisma db seed
        print_success "Database seeded successfully"
    else
        print_warning "No seed script found at prisma/seed.ts"
        print_info "You can create one to populate initial data"
    fi
}

# Check database connection
check_connection() {
    print_header "Checking Database Connection"

    check_database_url

    print_info "Testing connection..."

    if pnpm prisma db execute --stdin <<< "SELECT 1;" &>/dev/null; then
        print_success "Database connection successful"
    else
        print_error "Failed to connect to database"
        print_info "Please check your DATABASE_URL"
        exit 1
    fi
}

# Open Prisma Studio
open_studio() {
    print_header "Opening Prisma Studio"

    check_database_url

    print_info "Starting Prisma Studio..."
    print_info "Studio will open at http://localhost:5555"

    pnpm prisma studio
}

# Show migration status
migration_status() {
    print_header "Migration Status"

    check_database_url

    pnpm prisma migrate status
}

# Backup database (for Postgres)
backup_database() {
    print_header "Database Backup"

    check_database_url

    # Extract database info from DATABASE_URL
    # Format: postgresql://user:password@host:port/database
    local db_url="$DATABASE_URL"

    print_info "Creating backup..."

    local backup_file="backup-$(date +%Y%m%d-%H%M%S).sql"

    # Use pg_dump if available
    if command -v pg_dump >/dev/null 2>&1; then
        pg_dump "$db_url" > "$backup_file"
        print_success "Backup created: $backup_file"
    else
        print_warning "pg_dump not found. Install PostgreSQL client tools to use this feature."
        print_info "Alternatively, use your database provider's backup feature"
    fi
}

# Validate schema
validate_schema() {
    print_header "Validating Prisma Schema"

    print_info "Checking schema..."
    pnpm prisma validate

    print_success "Schema is valid"
}

# Format schema file
format_schema() {
    print_header "Formatting Prisma Schema"

    print_info "Formatting schema.prisma..."
    pnpm prisma format

    print_success "Schema formatted"
}

# Show help
show_help() {
    echo "SMATRX Database Setup & Migration Helper"
    echo ""
    echo "Usage: ./scripts/db-setup.sh [command]"
    echo ""
    echo "Commands:"
    echo "  init              - Initialize Prisma (first-time setup)"
    echo "  generate          - Generate Prisma Client"
    echo "  migrate           - Run pending migrations"
    echo "  create            - Create a new migration"
    echo "  reset             - Reset database (DESTRUCTIVE)"
    echo "  seed              - Seed database with sample data"
    echo "  check             - Check database connection"
    echo "  studio            - Open Prisma Studio"
    echo "  status            - Show migration status"
    echo "  backup            - Create database backup"
    echo "  validate          - Validate Prisma schema"
    echo "  format            - Format Prisma schema file"
    echo "  help              - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/db-setup.sh migrate"
    echo "  ./scripts/db-setup.sh create"
    echo "  ./scripts/db-setup.sh seed"
    echo ""
}

# Main function
main() {
    local command="${1:-help}"

    case "$command" in
        init)
            init_prisma
            ;;
        generate)
            generate_client
            ;;
        migrate)
            run_migrations
            ;;
        create)
            create_migration
            ;;
        reset)
            reset_database
            ;;
        seed)
            seed_database
            ;;
        check)
            check_connection
            ;;
        studio)
            open_studio
            ;;
        status)
            migration_status
            ;;
        backup)
            backup_database
            ;;
        validate)
            validate_schema
            ;;
        format)
            format_schema
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
