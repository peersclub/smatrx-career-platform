# SMATRX V3 - Credibility-First Platform Implementation Roadmap

## 🎯 Vision
Transform SMATRX into a **verified-data-only career intelligence platform** where professionals showcase their authentic identity through aggregated data from trusted sources, receive AI-powered career guidance, and share credible public profiles.

---

## ✅ Phase 1: Foundation (COMPLETED)

### What We Built
1. **Enhanced Database Schema** ✅
   - 11 new models added to Prisma schema
   - Education records with verification tracking
   - Social media profile aggregation
   - Certifications with credential validation
   - Enhanced GitHub analytics
   - Credibility scoring system
   - AI career suggestions
   - Public profile settings
   - Profile analytics & views
   - Data source sync status
   - Verification requests
   - Learning resource recommendations

2. **Core Services** ✅
   - `credibility-scoring.ts` - Complete scoring algorithm (25 KB)
     - Education scoring (25% weight)
     - Experience scoring (20% weight)
     - Technical scoring (25% weight)
     - Social scoring (15% weight)
     - Certification scoring (15% weight)
     - Badge calculation system
     - Verification level determination

   - `career-recommendations.ts` - AI-powered suggestions (13 KB)
     - Skill aggregation from multiple sources
     - OpenAI GPT-4 Turbo integration
     - Resource recommendation engine
     - Readiness score calculation
     - Learning path generation

3. **API Routes** ✅
   - `/api/credibility/calculate` - GET & POST
   - `/api/career/recommendations` - GET, POST & PATCH

### Files Created
```
prisma/
├── migrations/add_credibility_platform_models.sql
├── schema.prisma (extended)
└── schema-extended.prisma (reference)

apps/web/lib/services/
├── credibility-scoring.ts
└── career-recommendations.ts

apps/web/app/api/
├── credibility/calculate/route.ts
└── career/recommendations/route.ts
```

---

## 🚀 Phase 2: Data Integration (NEXT - Weeks 1-4)

### Priority Tasks

#### 1. Social Media Integrations (Week 1-2)
**Twitter/X Integration**
- [ ] Set up Twitter OAuth 2.0 in NextAuth
- [ ] Create `/api/social/twitter/connect` endpoint
- [ ] Build Twitter data fetcher service
- [ ] Fetch follower count, engagement metrics
- [ ] Store in `SocialProfile` model
- [ ] Create sync scheduler

**Instagram Integration** (Optional - for creative professionals)
- [ ] Set up Instagram Graph API
- [ ] OAuth integration
- [ ] Fetch profile metrics
- [ ] Portfolio content analysis

**YouTube Integration** (Optional - for content creators)
- [ ] YouTube Data API v3 setup
- [ ] Subscriber & view metrics
- [ ] Channel analytics

#### 2. Enhanced GitHub Analytics (Week 2)
- [ ] Expand existing GitHub analyzer
- [ ] Calculate contribution consistency score
- [ ] Analyze code quality (basic metrics)
- [ ] Build contribution graph data
- [ ] Store in new `GitHubProfile` model
- [ ] Migrate from `SkillImport` to dedicated profile

#### 3. Certification Aggregation (Week 3)
**Coursera Integration**
- [ ] Coursera API setup (if available)
- [ ] Or implement certificate upload + OCR
- [ ] Parse certificate data
- [ ] Store in `Certification` model with verification

**LinkedIn Learning**
- [ ] Certificate scraping or manual upload
- [ ] Verification workflow

**Cloud Certifications** (AWS, Google Cloud, Azure)
- [ ] API verification (if available)
- [ ] Manual verification workflow
- [ ] Badge validation system

#### 4. Education Verification System (Week 4)
**DigiLocker Integration** (India)
- [ ] Research DigiLocker API
- [ ] OAuth integration
- [ ] Fetch verified academic records
- [ ] Store in `EducationRecord`

**Manual Verification Workflow**
- [ ] Transcript upload interface
- [ ] OCR for PDF transcripts (using Tesseract or similar)
- [ ] Admin review dashboard
- [ ] Verification badge system

### API Routes to Create
```
/api/social/twitter/connect     - POST
/api/social/instagram/connect   - POST
/api/social/youtube/connect     - POST
/api/social/sync                - POST (sync all social)

/api/github/sync-enhanced       - POST
/api/github/profile             - GET

/api/certifications/upload      - POST
/api/certifications/verify      - POST
/api/certifications/coursera    - POST

/api/education/upload           - POST
/api/education/digilocker       - POST
/api/education/verify           - POST
```

---

## 📊 Phase 3: Credibility & Intelligence (Weeks 5-8)

### 1. Credibility Dashboard (Week 5)
- [ ] Design credibility score visualization
- [ ] Build React components:
  - `CredibilityScoreCard.tsx`
  - `ScoreBreakdown.tsx`
  - `BadgeDisplay.tsx`
  - `VerificationProgress.tsx`
- [ ] Create `/dashboard/credibility` page
- [ ] Real-time score updates
- [ ] Data completeness indicators

### 2. AI Career Planner (Week 6)
- [ ] Design career recommendation UI
- [ ] Build components:
  - `CareerPathCard.tsx`
  - `SkillGapAnalysis.tsx`
  - `ResourceRecommendations.tsx`
  - `ReadinessScore.tsx`
- [ ] Create `/career/planner` page
- [ ] Interactive skill gap visualization
- [ ] Resource filtering and bookmarking

### 3. Data Sync Automation (Week 7)
- [ ] Build background job system (BullMQ or similar)
- [ ] Create sync scheduler
- [ ] Implement sync frequency logic
- [ ] Error handling and retry logic
- [ ] Sync status notifications
- [ ] Manual sync triggers

### 4. Verification Workflows (Week 8)
- [ ] Admin verification dashboard
- [ ] Verification request UI for users
- [ ] Document upload system (AWS S3 or similar)
- [ ] Review and approval workflow
- [ ] Email notifications for verification status
- [ ] Verification badges on profile

---

## 🌐 Phase 4: Public Profiles (Weeks 9-12)

### 1. Profile Builder (Week 9)
- [ ] Username reservation system
- [ ] URL slug generation
- [ ] Public profile template
- [ ] Visibility settings UI
- [ ] Section customization
- [ ] Theme selection (professional, creative, minimal)

### 2. Profile Pages (Week 10)
- [ ] Build public profile route: `/p/[username]`
- [ ] Server-side rendering for SEO
- [ ] Profile components:
  - `ProfileHeader.tsx`
  - `CredibilityBadge.tsx`
  - `SkillsMatrix.tsx`
  - `CareerTimeline.tsx`
  - `SocialLinks.tsx`
  - `VerificationIndicators.tsx`
- [ ] Responsive design
- [ ] Print-friendly CSS for PDF export

### 3. Sharing Features (Week 11)
- [ ] Social media card generation (OG images)
- [ ] QR code generation
- [ ] PDF export functionality
- [ ] Share analytics tracking
- [ ] Copy link functionality
- [ ] Embed widget (optional)

### 4. SEO & Discovery (Week 12)
- [ ] Sitemap generation for public profiles
- [ ] Profile search functionality
- [ ] Directory/leaderboard (top credibility scores)
- [ ] Meta tags optimization
- [ ] Structured data (JSON-LD)
- [ ] Profile verification badge in search results

---

## 🎨 Phase 5: UI/UX Polish (Weeks 13-16)

### 1. Onboarding Flow (Week 13)
- [ ] Redesign onboarding with data source wizard
- [ ] Step-by-step data connection
- [ ] Progress indicators
- [ ] Gamification elements
- [ ] First-time user guidance

### 2. Dashboard Redesign (Week 14)
- [ ] Unified dashboard with all new features
- [ ] Data completeness widget
- [ ] Credibility score prominently displayed
- [ ] Career suggestions widget
- [ ] Recent activity feed
- [ ] Quick actions menu

### 3. Mobile Experience (Week 15)
- [ ] Responsive design audit
- [ ] Mobile-optimized components
- [ ] Touch-friendly interactions
- [ ] Mobile profile viewing
- [ ] Native app feel (PWA)

### 4. Performance & Accessibility (Week 16)
- [ ] Performance optimization
- [ ] Image optimization
- [ ] Lazy loading
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Lighthouse audit (score 90+)

---

## 🚢 Phase 6: Launch Preparation (Weeks 17-20)

### 1. Testing (Week 17)
- [ ] Unit tests for services
- [ ] Integration tests for API routes
- [ ] E2E tests for critical flows
- [ ] User acceptance testing
- [ ] Bug fixes

### 2. Documentation (Week 18)
- [ ] User documentation
- [ ] API documentation
- [ ] Admin guide
- [ ] Verification process guide
- [ ] FAQ section

### 3. Marketing Site (Week 19)
- [ ] Landing page design
- [ ] Feature showcase
- [ ] Pricing page (if premium features)
- [ ] About/Team page
- [ ] Blog setup
- [ ] Demo video

### 4. Beta Launch (Week 20)
- [ ] Invite beta users
- [ ] Feedback collection
- [ ] Metrics monitoring
- [ ] Bug fixing
- [ ] Performance monitoring
- [ ] Public launch preparation

---

## 📋 Quick Start Guide

### For Developers Starting Phase 2

1. **Install Dependencies**
   ```bash
   cd /Users/Victor/Projects/smatrx-career-platform
   pnpm install
   ```

2. **Set Up Database**
   ```bash
   # Push new schema to database
   pnpm db:push

   # Or create migration
   pnpm db:migrate
   ```

3. **Environment Variables**
   Add to `apps/web/.env`:
   ```env
   # Existing
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="http://localhost:3002"
   NEXTAUTH_SECRET="..."
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   LINKEDIN_CLIENT_ID="..."
   LINKEDIN_CLIENT_SECRET="..."
   OPENAI_API_KEY="..."

   # New (to be added)
   TWITTER_CLIENT_ID="..."
   TWITTER_CLIENT_SECRET="..."
   INSTAGRAM_CLIENT_ID="..."
   INSTAGRAM_CLIENT_SECRET="..."
   YOUTUBE_API_KEY="..."
   AWS_S3_BUCKET="..." # For document uploads
   AWS_ACCESS_KEY_ID="..."
   AWS_SECRET_ACCESS_KEY="..."
   ```

4. **Start Development**
   ```bash
   pnpm dev
   ```

5. **Test Existing Features**
   ```bash
   # Get credibility score
   curl http://localhost:3002/api/credibility/calculate \
     -H "Cookie: next-auth.session-token=..."

   # Get career recommendations
   curl http://localhost:3002/api/career/recommendations \
     -H "Cookie: next-auth.session-token=..."
   ```

---

## 🔧 Technical Architecture

### Service Layer Structure
```
apps/web/lib/services/
├── credibility-scoring.ts      ✅ Done
├── career-recommendations.ts   ✅ Done
├── social-integrations/
│   ├── twitter.ts             ⏳ Next
│   ├── instagram.ts           ⏳ Next
│   └── youtube.ts             ⏳ Next
├── github-analytics.ts        ⏳ Next
├── certification-parser.ts    ⏳ Next
├── education-verifier.ts      ⏳ Next
├── data-sync-scheduler.ts     ⏳ Next
└── profile-generator.ts       ⏳ Next
```

### API Route Structure
```
apps/web/app/api/
├── credibility/
│   ├── calculate/route.ts     ✅ Done
│   └── badges/route.ts        ⏳ Next
├── career/
│   ├── recommendations/route.ts ✅ Done
│   └── resources/route.ts     ⏳ Next
├── social/
│   ├── twitter/...            ⏳ Next
│   ├── instagram/...          ⏳ Next
│   └── youtube/...            ⏳ Next
├── github/
│   └── sync-enhanced/route.ts ⏳ Next
├── certifications/
│   └── upload/route.ts        ⏳ Next
├── education/
│   └── verify/route.ts        ⏳ Next
└── profile/
    └── [username]/route.ts    ⏳ Next
```

---

## 📊 Success Metrics

### Technical Metrics
- [ ] All 11 new models in production
- [ ] Credibility scoring <500ms
- [ ] AI recommendations <3s
- [ ] 95%+ uptime
- [ ] Lighthouse score 90+

### User Metrics
- [ ] 80%+ users connect 3+ data sources
- [ ] Average credibility score > 60
- [ ] 50%+ users enable public profile
- [ ] 1000+ profile views in first month
- [ ] 70%+ users bookmark AI recommendations

### Business Metrics
- [ ] 100 beta users
- [ ] 1000 registered users (3 months)
- [ ] 10,000 registered users (6 months)
- [ ] 50%+ weekly active users
- [ ] <5% churn rate

---

## 🎯 Priority Matrix

### Must Have (P0)
1. Social media integrations (Twitter, LinkedIn enhancer)
2. Enhanced GitHub analytics
3. Credibility dashboard
4. Public profile pages
5. Basic verification workflow

### Should Have (P1)
1. Certification upload & parsing
2. Education verification (DigiLocker)
3. AI career planner UI
4. Data sync automation
5. SEO optimization

### Nice to Have (P2)
1. Instagram/YouTube integrations
2. Custom domains for profiles
3. Profile analytics dashboard
4. Admin verification dashboard
5. Profile embed widgets

---

## 🤝 Next Steps

**Immediate Actions:**
1. Review this roadmap with team
2. Set up Twitter OAuth credentials
3. Create GitHub project board for Phase 2
4. Design mockups for credibility dashboard
5. Set up testing environment

**This Week:**
1. Implement Twitter integration
2. Test credibility scoring with real data
3. Create first UI component for credibility display
4. Write API documentation

**This Month (Phase 2):**
1. Complete all social integrations
2. Enhanced GitHub analytics
3. Certification system
4. Basic education verification

---

## 📝 Notes

- **Database Migration**: Test schema changes in development first
- **API Rate Limits**: Be mindful of GitHub, Twitter API limits
- **Cost Monitoring**: OpenAI API usage for career recommendations
- **Data Privacy**: Ensure GDPR compliance for European users
- **Security**: Implement rate limiting on public APIs
- **Backup Strategy**: Daily database backups before launch

---

**Status**: Phase 1 Complete ✅ | Phase 2 Ready to Start 🚀
**Last Updated**: 2025-10-08
**Next Review**: Start of Phase 2
