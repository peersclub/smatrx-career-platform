# Phase 3 Architecture: Credibility & Intelligence UI

## Overview

Phase 3 (Weeks 5-8) focuses on building user-facing interfaces for credibility visualization, AI career planning, background sync automation, and verification workflows.

---

## Component Hierarchy

### 1. Credibility Dashboard (`/dashboard/credibility`)

```
CredibilityDashboard (Page)
├── CredibilityScoreCard
│   ├── ScoreCircle (animated circular progress)
│   ├── VerificationLevelBadge
│   └── ScoreHistory (mini chart)
│
├── ScoreBreakdownCard
│   ├── EducationScore (25%)
│   ├── ExperienceScore (20%)
│   ├── TechnicalScore (25%)
│   ├── SocialScore (15%)
│   └── CertificationScore (15%)
│
├── VerificationBadgesGrid
│   ├── ActiveDeveloper
│   ├── AcademicExcellence
│   ├── CertifiedProfessional
│   └── MultiPlatformPresence
│
├── DataCompletenessCard
│   ├── CompletenessProgress (0-100%)
│   ├── MissingDataList
│   └── QuickActions (connect platforms)
│
└── CredibilityInsightsCard
    ├── StrengthsSection
    ├── ImprovementAreas
    └── NextSteps
```

### 2. AI Career Planner (`/dashboard/career-planner`)

```
CareerPlannerDashboard (Page)
├── CurrentProfileCard
│   ├── SkillsSummary
│   ├── ExperienceLevel
│   └── CredibilityScore
│
├── CareerRecommendationsGrid
│   ├── RecommendationCard (x5)
│   │   ├── RoleTitle
│   │   ├── ReadinessScore (0-100%)
│   │   ├── TimeToReady
│   │   ├── SkillGaps
│   │   └── ActionButton
│
├── SkillGapAnalysisCard
│   ├── GapVisualization (radar chart)
│   ├── PriorityList
│   └── LearningResources
│
└── LearningPathCard
    ├── RecommendedCourses
    │   ├── CourseCard (Coursera, Udemy, etc.)
    │   ├── EstimatedCost
    │   └── EnrollButton
    └── RecommendedTools
        ├── ToolCard (Figma, AWS, etc.)
        └── GetStartedLink
```

### 3. Profile Data Management (`/dashboard/profile`)

```
ProfileDataDashboard (Page)
├── ConnectedPlatformsCard
│   ├── PlatformStatus (GitHub, Twitter, etc.)
│   ├── LastSyncTime
│   └── SyncButton
│
├── CertificationsCard
│   ├── CertificationsList
│   ├── AddCertificationButton
│   └── ExpiringAlert
│
├── EducationCard
│   ├── EducationList
│   ├── AddEducationButton
│   └── VerificationStatus
│
└── SyncHistoryCard
    ├── RecentSyncs
    ├── SyncAllButton
    └── AutoSyncSettings
```

---

## Component Specifications

### CredibilityScoreCard

**Purpose**: Display overall credibility score with visual impact

**Props**:
```typescript
interface CredibilityScoreCardProps {
  overallScore: number          // 0-100
  verificationLevel: string     // basic, verified, premium, elite
  previousScore?: number        // For trend
  lastUpdated: Date
}
```

**Features**:
- Animated circular progress (0→score)
- Color-coded by level (blue, green, purple, gold)
- Trend indicator (+/- change)
- Verification badge overlay
- Click to expand details

**Visual Design**:
```
┌─────────────────────────────────┐
│  Credibility Score              │
│                                 │
│         ╭─────╮                 │
│        │  78  │  ⭐ Premium     │
│         ╰─────╯                 │
│          /100                   │
│                                 │
│  ↑ +12 from last month          │
│  Last updated: 2 hours ago      │
└─────────────────────────────────┘
```

### ScoreBreakdownCard

**Purpose**: Show component scores with visual breakdown

**Props**:
```typescript
interface ScoreBreakdownCardProps {
  breakdown: {
    education: { score: number; weight: number }
    experience: { score: number; weight: number }
    technical: { score: number; weight: number }
    social: { score: number; weight: number }
    certifications: { score: number; weight: number }
  }
}
```

**Features**:
- Horizontal stacked bar chart
- Hover tooltips with details
- Click to drill down
- Animated transitions
- Color-coded segments

**Visual Design**:
```
┌─────────────────────────────────┐
│  Score Breakdown                │
│                                 │
│  Education (25%)      85/100 ▓▓▓│
│  Experience (20%)     70/100 ▓▓ │
│  Technical (25%)      78/100 ▓▓▓│
│  Social (15%)         65/100 ▓▓ │
│  Certifications (15%) 92/100 ▓▓▓│
│                                 │
│  [View Details →]               │
└─────────────────────────────────┘
```

### VerificationBadgeComponent

**Purpose**: Display earned verification badges

**Props**:
```typescript
interface VerificationBadgeProps {
  badge: {
    id: string
    name: string
    description: string
    icon: string
    earned: boolean
    progress?: number  // 0-100 if not earned
  }
}
```

**Badge Types**:
1. **Active Developer** ⚡
   - Criteria: GitHub commits > 500 in last year
   - Icon: Lightning bolt
   - Color: Blue

2. **Academic Excellence** 🎓
   - Criteria: GPA > 3.5 OR top institution
   - Icon: Graduation cap
   - Color: Gold

3. **Certified Professional** ✅
   - Criteria: 3+ verified certifications
   - Icon: Checkmark shield
   - Color: Green

4. **Multi-Platform Presence** 🌐
   - Criteria: 3+ social platforms connected
   - Icon: Globe
   - Color: Purple

5. **Code Quality Champion** 💎
   - Criteria: Code quality score > 80
   - Icon: Diamond
   - Color: Cyan

6. **Consistent Contributor** 📅
   - Criteria: Consistency score > 80
   - Icon: Calendar
   - Color: Orange

**Visual Design**:
```
┌─────────────────────────────────┐
│  Verification Badges            │
│                                 │
│  ⚡ Active Developer    (Earned)│
│  🎓 Academic Excellence (Earned)│
│  ✅ Certified Professional      │
│     └─ 2/3 certifications       │
│  🌐 Multi-Platform (Earned)     │
│  💎 Code Quality Champion       │
│     └─ 72/80 score needed      │
│  📅 Consistent Contributor      │
│     └─ 65/80 score needed      │
└─────────────────────────────────┘
```

### DataCompletenessCard

**Purpose**: Show profile completion percentage

**Props**:
```typescript
interface DataCompletenessCardProps {
  completeness: number           // 0-100
  missingData: Array<{
    category: string
    items: string[]
    priority: 'critical' | 'important' | 'optional'
  }>
}
```

**Completeness Calculation**:
```typescript
completeness =
  (hasEducation ? 20 : 0) +
  (hasCertifications ? 20 : 0) +
  (hasGitHub ? 20 : 0) +
  (hasSocial ? 20 : 0) +
  (hasExperience ? 20 : 0)
```

**Visual Design**:
```
┌─────────────────────────────────┐
│  Profile Completeness           │
│                                 │
│  ▓▓▓▓▓▓▓▓░░░░ 65%              │
│                                 │
│  Missing (Priority):            │
│  🔴 Add certifications          │
│  🟡 Connect Instagram           │
│  ⚪ Add work experience         │
│                                 │
│  [Complete Profile →]           │
└─────────────────────────────────┘
```

### RecommendationCard

**Purpose**: Display AI-generated career recommendations

**Props**:
```typescript
interface RecommendationCardProps {
  recommendation: {
    id: string
    role: string
    readinessScore: number
    estimatedTime: string
    skillGaps: Array<{
      skill: string
      priority: 'critical' | 'important' | 'nice-to-have'
    }>
    resources: Array<{
      type: 'course' | 'tool' | 'certification'
      name: string
      platform: string
      cost?: string
    }>
  }
}
```

**Visual Design**:
```
┌─────────────────────────────────┐
│  Senior Full Stack Developer    │
│                                 │
│  Readiness: 75% ▓▓▓▓▓▓▓▓░░     │
│  Time: ~4 months                │
│                                 │
│  Skill Gaps:                    │
│  🔴 Kubernetes (critical)       │
│  🟡 Docker (important)          │
│                                 │
│  Recommended:                   │
│  📚 Kubernetes Course (Udemy)   │
│  🛠️ Docker Desktop              │
│                                 │
│  [View Details]  [Start Learning]│
└─────────────────────────────────┘
```

---

## State Management

### React Query for Server State

```typescript
// Fetch credibility score
const { data: credibility } = useQuery({
  queryKey: ['credibility', userId],
  queryFn: () => fetch('/api/credibility/calculate').then(r => r.json()),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000 // 30 minutes
})

// Fetch career recommendations
const { data: recommendations } = useQuery({
  queryKey: ['career-recommendations', userId],
  queryFn: () => fetch('/api/career/recommendations').then(r => r.json()),
  staleTime: 60 * 60 * 1000 // 1 hour
})

// Sync all platforms
const syncMutation = useMutation({
  mutationFn: () => fetch('/api/social/sync-all', { method: 'POST' }),
  onSuccess: () => {
    queryClient.invalidateQueries(['credibility'])
  }
})
```

### Local State with Zustand

```typescript
// UI state store
interface DashboardStore {
  selectedTab: 'overview' | 'breakdown' | 'history'
  isLoading: boolean
  error: string | null
  setSelectedTab: (tab: string) => void
}

const useDashboardStore = create<DashboardStore>((set) => ({
  selectedTab: 'overview',
  isLoading: false,
  error: null,
  setSelectedTab: (tab) => set({ selectedTab: tab })
}))
```

---

## Animation Strategy

### Framer Motion Animations

**Score Counter Animation**:
```typescript
<motion.span
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <AnimatedCounter from={0} to={score} />
</motion.span>
```

**Card Entry Animation**:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
>
  <Card>...</Card>
</motion.div>
```

**Progress Bar Animation**:
```typescript
<motion.div
  className="bg-purple-600"
  initial={{ width: 0 }}
  animate={{ width: `${percentage}%` }}
  transition={{ duration: 1, ease: "easeOut" }}
/>
```

---

## API Integration

### Credibility Dashboard APIs

```typescript
// Get credibility score
GET /api/credibility/calculate

// Get score history
GET /api/credibility/history?days=30

// Get badges
GET /api/credibility/badges

// Get completeness
GET /api/credibility/completeness
```

### Career Planner APIs

```typescript
// Get recommendations
GET /api/career/recommendations

// Update recommendation status
PATCH /api/career/recommendations
Body: { suggestionId, status: 'interested' | 'not-interested' | 'completed' }

// Update resource status
PATCH /api/career/recommendations
Body: { resourceId, status: 'enrolled' | 'completed' }
```

### Profile Data APIs

```typescript
// Get all certifications
GET /api/certifications?score=true

// Get all education
GET /api/education?score=true

// Get sync status
GET /api/social/sync-all

// Trigger sync
POST /api/social/sync-all
```

---

## Responsive Design

### Breakpoints (Tailwind)
```typescript
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Layout Strategy

**Mobile** (<768px):
- Single column
- Stacked cards
- Collapsible sections
- Bottom sheet for details

**Tablet** (768-1024px):
- 2-column grid
- Side drawer for navigation
- Modal for details

**Desktop** (>1024px):
- 3-column grid
- Fixed sidebar
- Inline expansion for details

---

## Performance Optimization

### Code Splitting
```typescript
// Lazy load dashboard pages
const CredibilityDashboard = lazy(() => import('./CredibilityDashboard'))
const CareerPlanner = lazy(() => import('./CareerPlanner'))
```

### Virtual Scrolling
```typescript
// For long lists (certifications, recommendations)
import { useVirtualizer } from '@tanstack/react-virtual'
```

### Memoization
```typescript
const MemoizedScoreCard = memo(ScoreCard, (prev, next) => {
  return prev.score === next.score
})
```

---

## Testing Strategy

### Component Tests (Jest + Testing Library)
```typescript
describe('CredibilityScoreCard', () => {
  it('displays score correctly', () => {
    render(<CredibilityScoreCard score={78} />)
    expect(screen.getByText('78')).toBeInTheDocument()
  })

  it('shows verification level badge', () => {
    render(<CredibilityScoreCard level="premium" />)
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })
})
```

### Integration Tests
```typescript
describe('Credibility Dashboard', () => {
  it('fetches and displays credibility data', async () => {
    render(<CredibilityDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/Credibility Score/i)).toBeInTheDocument()
    })
  })
})
```

---

## Accessibility (a11y)

### ARIA Labels
```typescript
<div role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
  {score}/100
</div>
```

### Keyboard Navigation
```typescript
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>
  View Details
</button>
```

### Screen Reader Support
```typescript
<span className="sr-only">
  Your credibility score is {score} out of 100, which is {level} level
</span>
```

---

## File Structure

```
apps/web/
├── app/
│   └── dashboard/
│       ├── credibility/
│       │   └── page.tsx                      # Main credibility dashboard
│       ├── career-planner/
│       │   └── page.tsx                      # Career planner dashboard
│       └── profile/
│           └── page.tsx                      # Profile data management
│
├── components/
│   ├── credibility/
│   │   ├── CredibilityScoreCard.tsx         # Score display
│   │   ├── ScoreBreakdownCard.tsx           # Component breakdown
│   │   ├── VerificationBadges.tsx           # Badge grid
│   │   ├── DataCompletenessCard.tsx         # Completion meter
│   │   └── CredibilityInsights.tsx          # AI insights
│   │
│   ├── career-planner/
│   │   ├── CurrentProfileCard.tsx           # User profile summary
│   │   ├── RecommendationCard.tsx           # Career suggestion card
│   │   ├── SkillGapAnalysis.tsx             # Gap visualization
│   │   └── LearningPathCard.tsx             # Resources
│   │
│   ├── profile/
│   │   ├── ConnectedPlatforms.tsx           # Platform status
│   │   ├── CertificationsList.tsx           # Certification management
│   │   ├── EducationList.tsx                # Education management
│   │   └── SyncHistory.tsx                  # Sync tracking
│   │
│   └── ui/                                   # Shared UI components
│       ├── AnimatedCounter.tsx
│       ├── CircularProgress.tsx
│       ├── RadarChart.tsx
│       └── TimelineChart.tsx
│
└── lib/
    ├── hooks/
    │   ├── useCredibility.ts                # Credibility query hook
    │   ├── useCareerRecommendations.ts      # Recommendations hook
    │   └── useSyncStatus.ts                 # Sync status hook
    │
    └── utils/
        ├── credibility-helpers.ts           # Score formatting
        ├── badge-helpers.ts                 # Badge logic
        └── chart-helpers.ts                 # Chart data prep
```

---

## Development Timeline

### Week 5: Core Dashboard
- Day 1-2: CredibilityScoreCard + ScoreBreakdownCard
- Day 3-4: VerificationBadges + DataCompletenessCard
- Day 5: Dashboard layout + routing

### Week 6: Career Planner
- Day 1-2: RecommendationCard + CurrentProfileCard
- Day 3-4: SkillGapAnalysis + LearningPathCard
- Day 5: Career planner layout + integration

### Week 7: Background Automation
- Day 1-2: BullMQ setup + job definitions
- Day 3-4: Automatic sync scheduler
- Day 5: Email notification system

### Week 8: Verification Workflows
- Day 1-2: Admin verification dashboard
- Day 3-4: Document upload + review system
- Day 5: Badge awarding + notifications

---

**Status**: 📋 Architecture Complete
**Next**: 🎨 Begin UI Component Development
**Target**: Phase 3 completion by Week 8
