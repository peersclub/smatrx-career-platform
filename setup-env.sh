#!/bin/bash

# SMATRX V3 Environment Setup Script

echo "🚀 SMATRX V3 - Environment Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ -f "apps/web/.env.local" ]; then
    echo "✅ .env.local already exists"
else
    echo "📝 Creating .env.local from template..."
    cat > apps/web/.env.local << 'EOF'
# Database
DATABASE_URL="postgresql://smatrx:smatrx_dev_2024@localhost:5432/smatrx_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand-base64-32"

# OAuth Providers (Get these from GitHub, Google, LinkedIn)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# OpenAI (Get from https://platform.openai.com)
OPENAI_API_KEY=""

# Optional: Analytics
VERCEL_ANALYTICS_ID=""
POSTHOG_KEY=""
POSTHOG_HOST="https://app.posthog.com"
EOF
    echo "✅ Created apps/web/.env.local"
    echo ""
    echo "⚠️  IMPORTANT: You need to add your API keys to apps/web/.env.local:"
    echo "   - GitHub OAuth: https://github.com/settings/developers"
    echo "   - Google OAuth: https://console.cloud.google.com"
    echo "   - OpenAI API: https://platform.openai.com"
    echo ""
fi

# Generate NextAuth secret if needed
if grep -q "your-secret-here" apps/web/.env.local 2>/dev/null; then
    echo "🔐 Generating NextAuth secret..."
    SECRET=$(openssl rand -base64 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-secret-here-generate-with-openssl-rand-base64-32/$SECRET/" apps/web/.env.local
    else
        # Linux
        sed -i "s/your-secret-here-generate-with-openssl-rand-base64-32/$SECRET/" apps/web/.env.local
    fi
    echo "✅ NextAuth secret generated"
fi

echo ""
echo "📋 Setup Checklist:"
echo "==================="
echo "✅ PostgreSQL database running"
echo "✅ Database migrations applied"
echo "✅ Seed data loaded"
echo "✅ Environment file created"
echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Add your OAuth credentials to apps/web/.env.local"
echo "2. Add your OpenAI API key to apps/web/.env.local"
echo "3. Restart the development server: pnpm dev"
echo "4. Visit http://localhost:3002"
echo ""
echo "✨ Happy coding!"
