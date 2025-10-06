# SMATRX V3 - AI-Powered Career Development Platform

> Transform your career with AI-driven skill analysis, personalized learning paths, and industry insights.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://prisma.io/)

## 🚀 Overview

SMATRX V3 is a comprehensive career development platform that helps professionals discover, analyze, and develop their skills through AI-powered insights. Built with modern web technologies, it provides personalized career guidance, skill gap analysis, and learning recommendations.

### ✨ Key Features

- **🔐 Multi-Provider Authentication** - GitHub, LinkedIn, Google OAuth
- **📊 AI-Powered Skill Analysis** - OpenAI integration for intelligent insights
- **📈 Career Progress Tracking** - Visual dashboards and metrics
- **🎯 Personalized Learning Paths** - Custom recommendations based on goals
- **🔍 Skill Verification System** - Industry expert validation
- **📱 Responsive Design** - Mobile-first approach
- **⚡ Real-time Updates** - Live progress tracking

## 🏗️ Architecture

### Monorepo Structure
```
smatrx-v3/
├── apps/
│   └── web/                 # Next.js web application
├── packages/
│   ├── core/               # Business logic & types
│   └── ui/                 # Shared UI components
├── prisma/                 # Database schema & migrations
└── docs/                   # Documentation
```

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v4
- **AI/ML**: OpenAI API
- **UI Components**: Custom design system with shadcn/ui
- **State Management**: Zustand, React Query
- **Build Tools**: Turbo, pnpm, tsup

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/smatrx-v3.git
   cd smatrx-v3
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/smatrx_db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3002"
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
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL with Docker
   docker run --name smatrx-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=smatrx_db -p 5432:5432 -d postgres:15
   
   # Run migrations
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3002](http://localhost:3002)

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🎯 Core Features

### 1. Onboarding Flow
- **Guided Setup**: Step-by-step profile completion
- **Progress Tracking**: Visual progress bar with completion percentage
- **Skill Import**: Connect GitHub, LinkedIn, and upload resumes
- **Career Goals**: Define aspirations and target roles
- **Preferences**: Work location, salary, and availability

### 2. Skill Analysis
- **Multi-Source Import**: GitHub repositories, LinkedIn profiles, resume parsing
- **AI-Powered Insights**: OpenAI analysis of skills and proficiency
- **Skill Gap Analysis**: Identify areas for improvement
- **Market Demand**: Industry trends and salary insights
- **Verification System**: Industry expert validation

### 3. Career Development
- **Personalized Roadmaps**: Custom learning paths
- **Progress Tracking**: Visual metrics and achievements
- **Goal Setting**: Career milestones and timelines
- **Industry Insights**: Market trends and opportunities

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:push         # Push schema changes
pnpm db:migrate      # Run migrations
pnpm db:studio       # Open Prisma Studio

# Code Quality
pnpm lint            # Run ESLint
pnpm format          # Format code with Prettier
pnpm type-check      # TypeScript type checking
```

### Project Structure

```
apps/web/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── onboarding/        # Onboarding flow
│   └── skills/            # Skills management
├── components/            # React components
├── lib/                   # Utilities and configurations
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `NEXTAUTH_SECRET` | NextAuth secret key | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | ✅ |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | ✅ |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth client secret | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |

### Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts and authentication
- **Profile**: Extended user profile information
- **Skill**: Skills database with categories
- **UserSkill**: User-skill relationships with proficiency
- **SkillImport**: Import history and status
- **CareerGoal**: User career objectives

## 🚀 Deployment

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t smatrx-v3 .

# Run container
docker run -p 3002:3002 smatrx-v3
```

### Environment Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your hosting platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/smatrx-v3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/smatrx-v3/discussions)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Team collaboration tools
- [ ] Integration with more platforms
- [ ] Advanced analytics dashboard

---

Built with ❤️ by the SMATRX team