#!/bin/bash

# ==================================
# Development Environment Setup
# ==================================
# Automates local development environment setup
# Usage: ./scripts/dev-setup.sh
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

# Check Node.js version
check_node_version() {
    print_header "Checking Node.js Version"

    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is not installed"
        echo "Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi

    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js version must be 18 or higher (current: $(node -v))"
        exit 1
    fi

    print_success "Node.js $(node -v) installed"
}

# Install pnpm if not installed
check_pnpm() {
    print_header "Checking pnpm"

    if ! command -v pnpm >/dev/null 2>&1; then
        print_warning "pnpm not found. Installing..."
        npm install -g pnpm
        print_success "pnpm installed"
    else
        print_success "pnpm $(pnpm -v) installed"
    fi
}

# Check Docker (optional for local Redis/Postgres)
check_docker() {
    print_header "Checking Docker (Optional)"

    if command -v docker >/dev/null 2>&1; then
        print_success "Docker installed"

        if docker ps >/dev/null 2>&1; then
            print_success "Docker daemon is running"
        else
            print_warning "Docker is installed but not running"
            print_info "Start Docker Desktop to use local database and Redis"
        fi
    else
        print_warning "Docker not installed"
        print_info "You can use cloud services (Neon, Upstash) instead of local Docker"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"

    print_info "Running pnpm install..."
    pnpm install

    print_success "Dependencies installed"
}

# Setup environment file
setup_env_file() {
    print_header "Setting Up Environment File"

    if [ -f ".env.local" ]; then
        print_warning ".env.local already exists"
        read -p "Do you want to overwrite it? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing .env.local"
            return
        fi
    fi

    print_info "Copying .env.example to .env.local..."
    cp .env.example .env.local

    print_success ".env.local created"
    print_warning "Remember to fill in your actual API keys and credentials!"
}

# Generate NextAuth secret
generate_nextauth_secret() {
    print_header "Generating NextAuth Secret"

    if command -v openssl >/dev/null 2>&1; then
        local secret=$(openssl rand -base64 32)

        # Update .env.local if it exists
        if [ -f ".env.local" ]; then
            # Check if NEXTAUTH_SECRET exists
            if grep -q "NEXTAUTH_SECRET=" .env.local; then
                # Replace placeholder
                if grep -q 'NEXTAUTH_SECRET="your-super-secret-key' .env.local; then
                    sed -i.bak "s|NEXTAUTH_SECRET=\"your-super-secret-key.*\"|NEXTAUTH_SECRET=\"$secret\"|" .env.local
                    rm -f .env.local.bak
                    print_success "NextAuth secret generated and added to .env.local"
                else
                    print_info "NEXTAUTH_SECRET already has a custom value"
                fi
            fi
        fi

        print_info "Generated secret: $secret"
    else
        print_warning "openssl not found. Please generate a secret manually:"
        print_info "Run: openssl rand -base64 32"
    fi
}

# Start local services with Docker
start_local_services() {
    print_header "Starting Local Services (Docker)"

    if ! command -v docker >/dev/null 2>&1; then
        print_warning "Docker not installed. Skipping local services."
        return
    fi

    if ! docker ps >/dev/null 2>&1; then
        print_error "Docker daemon is not running"
        return
    fi

    if [ ! -f "docker-compose.yml" ]; then
        print_info "Creating docker-compose.yml for local development..."

        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: smatrx-postgres
    environment:
      POSTGRES_USER: smatrx
      POSTGRES_PASSWORD: smatrx_dev_password
      POSTGRES_DB: smatrx_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U smatrx"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: smatrx-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
EOF
        print_success "docker-compose.yml created"
    fi

    print_info "Starting PostgreSQL and Redis..."
    docker-compose up -d

    print_info "Waiting for services to be ready..."
    sleep 5

    print_success "Local services started"
    print_info "PostgreSQL: localhost:5432"
    print_info "Redis: localhost:6379"
}

# Setup Prisma
setup_prisma() {
    print_header "Setting Up Prisma"

    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Skipping Prisma setup."
        return
    fi

    print_info "Generating Prisma Client..."
    pnpm prisma generate

    print_info "Checking database connection..."
    if pnpm prisma db execute --stdin <<< "SELECT 1;" &>/dev/null; then
        print_success "Database connection successful"

        read -p "Do you want to run migrations now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Running migrations..."
            pnpm prisma migrate dev
            print_success "Migrations completed"
        fi
    else
        print_warning "Could not connect to database"
        print_info "Make sure DATABASE_URL is set correctly in .env.local"
    fi
}

# Create initial admin user (optional)
create_admin_user() {
    print_header "Create Admin User (Optional)"

    read -p "Do you want to create an admin user? (y/n) " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi

    read -p "Enter admin email: " admin_email
    read -s -p "Enter admin password: " admin_password
    echo

    # Create a seed script if it doesn't exist
    if [ ! -f "prisma/seed-admin.ts" ]; then
        cat > prisma/seed-admin.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@smatrx.io'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('Admin user created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
EOF
    fi

    ADMIN_EMAIL="$admin_email" ADMIN_PASSWORD="$admin_password" pnpm tsx prisma/seed-admin.ts

    print_success "Admin user created: $admin_email"
}

# Display next steps
show_next_steps() {
    print_header "Setup Complete! 🎉"

    echo "Your development environment is ready!"
    echo ""
    echo "Next steps:"
    echo ""
    echo "  1. Fill in API keys in .env.local:"
    echo "     - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET"
    echo "     - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
    echo "     - LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET"
    echo "     - OPENAI_API_KEY (if using AI features)"
    echo ""
    echo "  2. Start the development server:"
    echo "     ${GREEN}pnpm dev${NC}"
    echo ""
    echo "  3. Open your browser:"
    echo "     ${BLUE}http://localhost:3000${NC}"
    echo ""
    echo "Useful commands:"
    echo "  - ${BLUE}pnpm dev${NC}           - Start dev server"
    echo "  - ${BLUE}pnpm build${NC}         - Build for production"
    echo "  - ${BLUE}pnpm lint${NC}          - Run linter"
    echo "  - ${BLUE}pnpm test${NC}          - Run tests"
    echo "  - ${BLUE}pnpm prisma studio${NC} - Open Prisma Studio"
    echo ""
    print_success "Happy coding! 🚀"
}

# Main setup flow
main() {
    print_header "SMATRX Career Platform - Development Setup"

    check_node_version
    check_pnpm
    check_docker
    install_dependencies
    setup_env_file
    generate_nextauth_secret

    read -p "Do you want to start local services (PostgreSQL, Redis) with Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_local_services
    fi

    setup_prisma
    show_next_steps
}

# Run main function
main "$@"
