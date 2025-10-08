# SMATRX V3 - AI-Powered Credibility-First Career Platform

> Transform your career with verified data, AI-powered insights, and a credible professional profile.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.3-2D3748)](https://prisma.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991)](https://openai.com/)

---

## 🎯 Vision

**The world's first credibility-first career intelligence platform** where professionals showcase their authentic identity through verified data from trusted sources. No manual entry for credentials - everything is fetched or verified.

### Core Principles

1. **Zero Manual Credential Entry** - All data fetched from reliable sources
2. **Verified-Only Data** - Build credible professional profiles
3. **AI-Powered Guidance** - Personalized career recommendations
4. **Multi-Source Intelligence** - Academic + Professional + Social + Technical
5. **Shareable Profiles** - Public URLs for job applications and networking

---

## ✨ Key Features

### 🏆 Credibility Scoring (0-100)
Comprehensive credibility score based on verified data:
- **Education** (25%) - Verified degrees, GPA, institution quality
- **Experience** (20%) - LinkedIn work history, years in industry
- **Technical** (25%) - GitHub contributions, code quality, consistency
- **Social** (15%) - Twitter/Instagram/YouTube influence and engagement
- **Certifications** (15%) - Verified learning credentials

**Verification Levels**: Basic → Verified → Premium → Elite

### 🤖 AI Career Advisor
- 5 personalized career path suggestions
- Skill gap analysis with priorities
- Specific learning resources (Coursera, Udemy, tools)
- Time-to-ready estimates
- Readiness scores (0-100%)

### 📊 Multi-Platform Data Aggregation
**Currently Integrated**:
- ✅ **GitHub** (commits, PRs, code quality, consistency, 1000+ line service) ⭐ NEW
- ✅ LinkedIn (professional experience)
- ✅ Twitter/X (followers, engagement, influence)
- ✅ Instagram (content, engagement, consistency)
- ✅ YouTube (subscribers, videos, engagement)

**Coming Soon**:
- ⏳ Education verification (DigiLocker, transcripts)
- ⏳ Certification uploads (Coursera, AWS, Google Cloud)
- ⏳ Additional social platforms (TikTok, Medium)

### 👤 Public Profiles (Phase 4)
- `smatrx.io/@username` URLs
- Shareable professional profiles
- Verification badges
- Privacy controls
- SEO-optimized
- PDF export for job applications

---

## 🏗️ Architecture

### Tech Stack

**Frontend**:
- Next.js 15.5.4 with App Router
- React 19
- TypeScript 5.0
- Tailwind CSS 4.0
- Radix UI Components

**Backend**:
- Next.js API Routes
- Prisma ORM 6.16.3
- PostgreSQL Database

**Authentication**:
- NextAuth.js v4
- Multi-provider OAuth (GitHub, Google, LinkedIn, Twitter)

**AI & Intelligence**:
- OpenAI GPT-4 Turbo (career recommendations)
- GPT-3.5 (content quality analysis)

**APIs Integrated**:
- GitHub REST API (via Octokit)
- Twitter API v2
- Instagram Graph API
- YouTube Data API v3

### Database Models

24 total models across:
- User authentication & profiles
- Skills and categories
- Career goals and roles
- Learning paths and progress
- Achievements and badges
- **Social profiles** (Twitter, Instagram, YouTube)
- **Education records** (verified degrees)
- **Certifications** (verified credentials)
- **Credibility scoring**
- **AI career suggestions**
- **Public profile settings**
- **Data sync status**

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/peersclub/smatrx-career-platform.git
   cd smatrx-career-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/smatrx_db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3002"
   NEXTAUTH_SECRET="your-secret-key-min-32-chars"

   # OAuth Providers (Phase 1)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   LINKEDIN_CLIENT_ID="your-linkedin-client-id"
   LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

   # Twitter OAuth 2.0 (Phase 2)
   TWITTER_CLIENT_ID="your-twitter-client-id"
   TWITTER_CLIENT_SECRET="your-twitter-client-secret"

   # AI Services
   OPENAI_API_KEY="sk-your-openai-api-key"
   ```

4. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb smatrx_db

   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:3002
   ```

---

## 📚 OAuth Setup Guides

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. **Homepage URL**: `http://localhost:3002`
4. **Callback URL**: `http://localhost:3002/api/auth/callback/github`
5. Copy Client ID and Client Secret to `.env.local`

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable APIs: YouTube Data API v3
4. Create OAuth 2.0 credentials
5. **Authorized redirect URI**: `http://localhost:3002/api/auth/callback/google`
6. Add scopes: `email`, `profile`, `youtube.readonly`
7. Copy Client ID and Client Secret to `.env.local`

### LinkedIn OAuth

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create new app
3. Add OAuth 2.0 settings
4. **Redirect URL**: `http://localhost:3002/api/auth/callback/linkedin`
5. Request scopes: `openid`, `profile`, `email`
6. Copy Client ID and Client Secret to `.env.local`

### Twitter OAuth 2.0

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create new Project and App
3. Enable OAuth 2.0 in User Authentication Settings
4. **App permissions**: Read
5. **Callback URL**: `http://localhost:3002/api/auth/callback/twitter`
6. **Website URL**: `http://localhost:3002`
7. Copy Client ID and Client Secret to `.env.local`

### Instagram (via Facebook)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app
3. Add Instagram Graph API
4. Configure OAuth settings
5. Request permissions: `instagram_basic`, `pages_read_engagement`
6. Add to `.env.local` as `INSTAGRAM_CLIENT_ID` and `INSTAGRAM_CLIENT_SECRET`

---

## 🎮 Usage

### 1. Sign Up & Connect Accounts

```bash
# Navigate to sign in page
http://localhost:3002/auth/signin

# Sign in with any provider
# Connect additional providers for complete profile
```

### 2. Sync Data from Social Platforms

```bash
# API endpoint to sync all platforms
curl -X POST http://localhost:3002/api/social/sync-all \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Response
{
  "success": true,
  "message": "Synced 3 platform(s) successfully",
  "credibilityScore": {
    "overallScore": 78,
    "socialScore": 75,
    "verificationLevel": "premium"
  }
}
```

### 3. Get Credibility Score

```bash
curl http://localhost:3002/api/credibility/calculate \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Response
{
  "success": true,
  "score": {
    "overallScore": 78,
    "educationScore": 85,
    "experienceScore": 70,
    "technicalScore": 82,
    "socialScore": 75,
    "certificationScore": 60,
    "verificationLevel": "premium",
    "badges": ["Active Developer", "Academic Excellence", "Multi-Platform Presence"]
  }
}
```

### 4. Get AI Career Recommendations

```bash
curl http://localhost:3002/api/career/recommendations \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Response
{
  "success": true,
  "recommendations": [
    {
      "role": "Senior Full Stack Developer",
      "readinessScore": 75,
      "estimatedTime": "4 months",
      "skillGaps": [
        { "skill": "Kubernetes", "priority": "critical" }
      ],
      "resources": [
        {
          "type": "course",
          "platform": "Coursera",
          "title": "Kubernetes for Developers",
          "cost": "$49"
        }
      ]
    }
  ]
}
```

---

## 📊 API Documentation

### Credibility Scoring

**GET** `/api/credibility/calculate`
- Get user's credibility score (cached)
- Query param: `?force=true` to recalculate

**POST** `/api/credibility/calculate`
- Force recalculation of credibility score

### Career Recommendations

**GET** `/api/career/recommendations`
- Get cached career suggestions
- Query param: `?regenerate=true` for fresh AI recommendations

**POST** `/api/career/recommendations`
- Generate new AI-powered career recommendations

**PATCH** `/api/career/recommendations`
- Update suggestion or resource status
- Body: `{ suggestionId, status }` or `{ resourceId, status }`

### Social Media Sync

**POST** `/api/social/github/sync` ⭐ NEW
- Sync GitHub profile data with advanced analytics

**POST** `/api/social/twitter/sync`
- Sync Twitter profile data

**POST** `/api/social/instagram/sync`
- Sync Instagram profile data

**POST** `/api/social/youtube/sync`
- Sync YouTube channel data

**POST** `/api/social/sync-all`
- Sync all connected platforms (GitHub, Twitter, Instagram, YouTube) + recalculate credibility

**GET** `/api/social/sync-all`
- Get sync status for all platforms

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Manual Testing Checklist

- [ ] Sign in with GitHub
- [ ] Sign in with Google
- [ ] Sign in with LinkedIn
- [ ] Sign in with Twitter
- [ ] **Sync GitHub data (NEW)**
- [ ] Sync Twitter data
- [ ] Sync Instagram data
- [ ] Sync YouTube data
- [ ] **Sync all platforms at once**
- [ ] Calculate credibility score
- [ ] Generate career recommendations
- [ ] View profile data in Prisma Studio

### Database Inspection

```bash
# Open Prisma Studio
npx prisma studio

# Navigate to http://localhost:5555
# Inspect SocialProfile, CredibilityScore, CareerSuggestion tables
```

---

## 📈 Project Progress

**Overall: 35% Complete** ⬆️ +5%

### ✅ Phase 1: Foundation (100%)
- [x] Database schema (24 models)
- [x] Credibility scoring service
- [x] AI career recommendation service
- [x] Core API endpoints
- [x] Authentication setup

### ✅ Phase 2: Data Integration (100%)
- [x] Twitter integration
- [x] Instagram integration
- [x] YouTube integration
- [x] **Enhanced GitHub analytics** ⭐ COMPLETE
- [x] Unified sync service
- [x] **Certification uploads** ⭐ COMPLETE
- [x] **Education verification** ⭐ COMPLETE

### ⏳ Phase 3: Credibility & Intelligence (0%)
- [ ] Credibility dashboard UI
- [ ] AI career planner UI
- [ ] Data sync automation
- [ ] Verification workflows

### ⏳ Phase 4: Public Profiles (0%)
- [ ] Profile builder
- [ ] Public profile pages (@username)
- [ ] Sharing features
- [ ] SEO optimization

### ⏳ Phase 5: UI/UX Polish (0%)
- [ ] Onboarding flow redesign
- [ ] Dashboard overhaul
- [ ] Mobile optimization
- [ ] Accessibility improvements

### ⏳ Phase 6: Launch (0%)
- [ ] Testing & QA
- [ ] Documentation
- [ ] Marketing site
- [ ] Beta launch

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write TypeScript with strict type checking
- Follow existing code patterns
- Add JSDoc comments for services
- Update documentation for new features
- Test thoroughly before submitting

---

## 📁 Project Structure

```
smatrx-career-platform/
├── apps/
│   └── web/                      # Next.js application
│       ├── app/                  # App Router pages
│       │   ├── api/              # API routes
│       │   │   ├── credibility/  # Credibility scoring
│       │   │   ├── career/       # Career recommendations
│       │   │   └── social/       # Social media sync
│       │   ├── auth/             # Authentication pages
│       │   ├── dashboard/        # User dashboard
│       │   └── onboarding/       # Onboarding flow
│       ├── components/           # React components
│       ├── lib/                  # Utilities & services
│       │   └── services/         # Business logic
│       │       ├── credibility-scoring.ts
│       │       ├── career-recommendations.ts
│       │       └── social-integrations/
│       │           ├── twitter.ts
│       │           ├── instagram.ts
│       │           └── youtube.ts
│       └── types/                # TypeScript types
├── prisma/
│   ├── schema.prisma             # Database schema (24 models)
│   └── migrations/               # Database migrations
├── packages/
│   ├── core/                     # Shared business logic
│   └── ui/                       # Shared UI components
├── docs/                         # Documentation
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── PHASE_1_SUMMARY.md
│   ├── PHASE_2_SETUP_GUIDE.md
│   ├── PHASE_2_COMPLETE_SUMMARY.md
│   └── GITHUB_INTEGRATION_GUIDE.md ⭐ NEW
└── README.md                     # This file
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL (macOS)
brew services restart postgresql

# Reset database
npx prisma db push --force-reset
```

### OAuth Errors

**"Callback URL mismatch"**
- Verify callback URLs in OAuth provider settings
- Must exactly match: `http://localhost:3002/api/auth/callback/{provider}`

**"Invalid client credentials"**
- Double-check Client ID and Secret in `.env.local`
- Regenerate credentials if needed

### API Rate Limits

**Twitter**: 500 requests per 15 minutes
**Instagram**: 200 calls per hour (Basic Display)
**YouTube**: 10,000 quota units per day

**Solution**: Implement caching and reduce sync frequency

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/peersclub/smatrx-career-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/peersclub/smatrx-career-platform/discussions)

---

## 🗺️ Roadmap

### Q1 2025
- [x] Core platform foundation
- [x] Social media integrations (Twitter, Instagram, YouTube)
- [ ] Enhanced GitHub analytics
- [ ] Certification system

### Q2 2025
- [ ] Credibility dashboard UI
- [ ] AI career planner interface
- [ ] Public profile system
- [ ] Background sync automation

### Q3 2025
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] API marketplace

### Q4 2025
- [ ] Enterprise features
- [ ] White-label solutions
- [ ] Integration marketplace
- [ ] 100K+ users

---

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Database by [Prisma](https://prisma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- UI components by [Radix UI](https://www.radix-ui.com/)

---

## 📊 Stats

- **Code**: ~8,900+ lines of TypeScript ⬆️ +1,700
- **Models**: 24 database models
- **APIs**: 17 production endpoints ⬆️ +4
- **Integrations**: 5 platforms (GitHub, LinkedIn, Twitter, Instagram, YouTube)
- **Services**: 8 comprehensive services (certification, education, GitHub, Twitter, Instagram, YouTube, credibility, career)
- **Documentation**: 30,000+ words ⬆️ +8,000
- **Progress**: 35% complete ⬆️ +5%

---

**Built with ❤️ by the SMATRX Team**

**Status**: 🚀 Active Development | Phase 2 Complete
**Version**: 3.0.0 (Credibility-First Platform)
**Last Updated**: 2025-10-08

---

*Transform your career with verified data and AI-powered insights.*
