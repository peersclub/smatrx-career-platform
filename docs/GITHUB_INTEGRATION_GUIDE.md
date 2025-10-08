# GitHub Integration - Complete Guide

## Overview

The enhanced GitHub integration provides comprehensive analytics for developer credibility scoring. Unlike basic profile stats, this system analyzes **contribution patterns**, **code quality**, **consistency**, and **impact** to build a credible picture of a developer's capabilities.

---

## Key Features

### 1. **Contribution Consistency Analysis**
- Daily commit pattern tracking
- Streak calculation (longest & current)
- Activity distribution scoring
- Time-based metrics (30/90/365 days)

### 2. **Code Quality Metrics**
- Pull request success rate
- Issue resolution rate
- Code review participation
- Documentation practices (README, tests, docs)

### 3. **Language Proficiency**
- Bytes written per language
- Language diversity analysis
- Primary language identification
- Framework/tool detection

### 4. **Repository Impact**
- Star/fork count aggregation
- Repository ranking by impact
- Open source contribution tracking
- Community engagement metrics

### 5. **Overall Scoring** (0-100)
Weighted algorithm combining:
- Repository impact (25%)
- Commit activity (25%)
- Consistency (20%)
- Code quality (20%)
- Community engagement (10%)

---

## Architecture

### Service Layer
**File**: `apps/web/lib/services/social-integrations/github.ts` (1,000+ lines)

**Main Functions**:
```typescript
// Complete analytics pipeline
getGitHubAnalytics(accessToken): Promise<GitHubAnalytics>

// Individual analysis components
fetchGitHubUser(accessToken): Promise<GitHubUser>
fetchGitHubRepositories(accessToken): Promise<GitHubRepository[]>
analyzeCommitActivity(accessToken, username, repos): Promise<GitHubCommitActivity>
analyzeCodeQuality(accessToken, username, repos): Promise<GitHubCodeQuality>
analyzeLanguageStats(accessToken, repos): Promise<GitHubLanguageStats>

// Database sync
syncGitHubData(userId, accessToken): Promise<void>
saveGitHubProfile(userId, analytics): Promise<GitHubProfile>
```

### API Endpoints
**Base**: `/api/social/github/`

#### Sync Endpoint
```bash
POST /api/social/github/sync
Authorization: Session cookie

Response:
{
  "success": true,
  "message": "GitHub data synchronized successfully"
}
```

#### Status Endpoint
```bash
GET /api/social/github/sync

Response:
{
  "syncStatus": {
    "status": "completed",
    "lastSyncAt": "2025-10-08T14:30:00Z",
    "nextSyncAt": "2025-10-09T14:30:00Z"
  },
  "profile": {
    "username": "johndoe",
    "totalRepos": 45,
    "totalCommits": 2834,
    "totalPRs": 128,
    "totalIssues": 76,
    "totalStars": 1250,
    "contributionScore": 78,
    "consistencyScore": 85,
    "codeQualityScore": 72,
    "languagesUsed": {
      "TypeScript": 45.2,
      "Python": 28.7,
      "Go": 15.3,
      "Rust": 10.8
    },
    "topRepos": [...]
  },
  "isConnected": true
}
```

#### Unified Sync
```bash
POST /api/social/sync-all
# Now includes GitHub + Twitter + Instagram + YouTube
```

---

## Scoring Algorithms

### Contribution Score (0-100)

**Formula**:
```typescript
contributionScore =
  repositoryImpact (25 pts) +
  commitActivity (25 pts) +
  consistency (20 pts) +
  codeQuality (20 pts) +
  communityEngagement (10 pts)
```

**Breakdown**:

1. **Repository Impact** (25 points)
   ```typescript
   totalStars + totalForks
   logarithmicScore = log10(impact + 1) * 5
   // Prevents mega-repo bias
   ```

2. **Commit Activity** (25 points)
   ```typescript
   commitsLast365Days
   activityScore = log10(commits + 1) * 6
   // Logarithmic scaling for fairness
   ```

3. **Consistency** (20 points)
   ```typescript
   consistencyScore =
     frequencyScore (40%) +    // Days with activity / 365
     distributionScore (30%) +  // Low std dev = regular pattern
     recencyScore (30%)        // Days since last commit
   ```

4. **Code Quality** (20 points)
   ```typescript
   qualityScore =
     prSuccessRate * 20% +          // Merged PRs / Total PRs
     issueResolutionRate * 15% +    // Closed issues / Total issues
     codeReviewParticipation * 20% + // Number of PR reviews
     collaborationScore * 15% +     // Comments on PRs/issues
     documentationPractices * 30%   // README + tests + docs
   ```

5. **Community Engagement** (10 points)
   ```typescript
   totalPRs + totalIssues
   engagementScore = log10(contributions + 1) * 3
   ```

### Consistency Score (0-100)

**Three-Factor Model**:
```typescript
consistencyScore =
  frequencyScore (40%) +     // How often?
  distributionScore (30%) +  // How regular?
  recencyScore (30%)         // How recent?
```

**Frequency Score**:
```typescript
daysWithActivity / 365 * 100
// 40 points max
```

**Distribution Score**:
```typescript
gaps = [days between commits]
avgGap = mean(gaps)
stdDev = standardDeviation(gaps)
coefficientOfVariation = stdDev / avgGap

distributionScore = 30 - (coefficientOfVariation * 10)
// Lower CV = more regular = higher score
// 30 points max
```

**Recency Score**:
```typescript
daysSinceLastCommit
recencyScore = 30 - daysSinceLastCommit
// 30 points max (0 if committed today)
```

### Code Quality Score (0-100)

**Five-Factor Model**:
```typescript
qualityScore =
  prSuccessRate * 20 +           // PR merge rate
  issueResolutionRate * 15 +     // Issue closure rate
  codeReviewScore * 20 +         // Review participation
  collaborationScore * 15 +      // Comment activity
  documentationScore * 30        // Docs practices
```

**PR Success Rate**:
```typescript
mergedPRs / totalPRs * 20
// 20 points max
```

**Issue Resolution Rate**:
```typescript
closedIssues / totalIssues * 15
// 15 points max
```

**Code Review Score**:
```typescript
min(20, numberOfReviews * 2)
// 20 points max
```

**Collaboration Score**:
```typescript
(commentsOnPRs + commentsOnIssues) * 0.5
// 15 points max
```

**Documentation Score**:
```typescript
readmePercentage * 10 +    // % repos with README
testPercentage * 10 +      // % repos with tests
docsPercentage * 10        // % repos with /docs
// 30 points max
```

---

## Database Schema

### GitHubProfile Model
```prisma
model GitHubProfile {
  id                 String   @id @default(cuid())
  userId             String   @unique
  username           String
  profileUrl         String?

  // Counts
  totalRepos         Int      @default(0)
  totalCommits       Int      @default(0)
  totalPRs           Int      @default(0)
  totalIssues        Int      @default(0)
  totalStars         Int      @default(0)

  // Languages (JSON: { "TypeScript": 45.2, "Python": 28.7 })
  languagesUsed      Json     @default("{}")

  // Scores
  contributionScore  Float?
  consistencyScore   Float?
  codeQualityScore   Float?

  // Rich data
  topRepos           Json?    // Top 10 repos by stars
  contributionGraph  Json?    // Daily commit counts

  // Metadata
  lastFetchedAt      DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([username])
}
```

**Sample Data**:
```json
{
  "id": "clx123...",
  "userId": "user_abc",
  "username": "johndoe",
  "profileUrl": "https://github.com/johndoe",
  "totalRepos": 45,
  "totalCommits": 2834,
  "totalPRs": 128,
  "totalIssues": 76,
  "totalStars": 1250,
  "languagesUsed": {
    "TypeScript": 45.2,
    "Python": 28.7,
    "Go": 15.3,
    "Rust": 10.8
  },
  "contributionScore": 78,
  "consistencyScore": 85,
  "codeQualityScore": 72,
  "topRepos": [
    {
      "name": "awesome-project",
      "description": "A really cool project",
      "language": "TypeScript",
      "stars": 850,
      "forks": 120,
      "url": "https://github.com/johndoe/awesome-project"
    }
  ],
  "contributionGraph": [
    { "date": "2025-10-07", "count": 5 },
    { "date": "2025-10-06", "count": 3 },
    { "date": "2025-10-05", "count": 8 }
  ]
}
```

---

## Integration with Credibility Score

### Technical Score Contribution (25% of overall)

GitHub data feeds into the **Technical Score** component:

```typescript
// From credibility-scoring.ts

async function calculateTechnicalScore(userId: string): Promise<ScoreComponent> {
  const githubProfile = await prisma.gitHubProfile.findUnique({
    where: { userId }
  })

  if (!githubProfile) {
    return { score: 0, breakdown: {} }
  }

  // GitHub contributes to technical credibility
  const githubScore =
    (githubProfile.contributionScore || 0) * 0.4 +
    (githubProfile.consistencyScore || 0) * 0.3 +
    (githubProfile.codeQualityScore || 0) * 0.3

  return {
    score: githubScore,
    breakdown: {
      contributions: githubProfile.contributionScore,
      consistency: githubProfile.consistencyScore,
      quality: githubProfile.codeQualityScore,
      languages: Object.keys(githubProfile.languagesUsed).length,
      repos: githubProfile.totalRepos
    }
  }
}
```

### Overall Credibility Formula

```typescript
credibilityScore =
  educationScore * 0.25 +
  experienceScore * 0.20 +
  technicalScore * 0.25 +    // ← GitHub contributes here
  socialScore * 0.15 +
  certificationScore * 0.15
```

---

## Setup Instructions

### 1. GitHub OAuth Configuration

**Create GitHub OAuth App**:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - **Application name**: SMATRX Career Platform
   - **Homepage URL**: `http://localhost:3002` (dev) or `https://smatrx.io` (prod)
   - **Callback URL**: `http://localhost:3002/api/auth/callback/github`
4. Click "Register application"
5. Copy **Client ID** and generate **Client Secret**

**Add to `.env.local`**:
```env
# GitHub OAuth
GITHUB_CLIENT_ID="Iv1.abc123def456"
GITHUB_CLIENT_SECRET="abc123def456ghi789jkl012mno345pqr678stu"
```

### 2. Install Dependencies

```bash
pnpm install @octokit/rest
```

### 3. Run Database Migration

The GitHubProfile model should already exist in your schema. If not:

```bash
npx prisma db push
npx prisma generate
```

### 4. Test the Integration

```bash
# Start dev server
pnpm dev

# 1. Sign in with GitHub
# Visit: http://localhost:3002/auth/signin
# Click "Sign in with GitHub"

# 2. Sync GitHub data
curl -X POST http://localhost:3002/api/social/github/sync \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# 3. Check sync status
curl http://localhost:3002/api/social/github/sync \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# 4. Sync all platforms
curl -X POST http://localhost:3002/api/social/sync-all \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

## API Rate Limits

**GitHub API Limits**:
- **Authenticated**: 5,000 requests/hour
- **Unauthenticated**: 60 requests/hour

**Our Usage**:
- Profile fetch: 1 request
- Repositories: ~1-2 requests (depends on pagination)
- Language stats: 1 request per repo
- Commit activity: 1-3 requests
- Events: 1 request

**Total per sync**: ~50-150 requests (depending on repo count)

**Recommendation**: Sync once per day (handled automatically via DataSourceSync model)

---

## Performance Optimization

### 1. **Pagination Handling**
```typescript
// Efficient pagination
let page = 1
let hasMore = true

while (hasMore) {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    per_page: 100,
    page,
    sort: 'updated'
  })

  repos.push(...data)
  hasMore = data.length === 100
  page++
}
```

### 2. **Parallel Requests**
```typescript
// Fetch multiple repos in parallel
const languagePromises = repos.map(repo =>
  octokit.repos.listLanguages({ owner, repo: repo.name })
)
const results = await Promise.all(languagePromises)
```

### 3. **Caching Strategy**
- Store results in GitHubProfile table
- Only recalculate if `lastFetchedAt` > 24 hours
- Use DataSourceSync for sync orchestration

### 4. **Selective Analysis**
```typescript
// Only analyze top 10 repos for detailed stats
const topRepos = repositories
  .filter(r => !r.isFork)
  .sort((a, b) => b.stars - a.stars)
  .slice(0, 10)
```

---

## Error Handling

### Common Errors

**1. Rate Limit Exceeded**
```typescript
try {
  await syncGitHubData(userId, accessToken)
} catch (error) {
  if (error.status === 403 && error.message.includes('rate limit')) {
    // Store error and retry after reset time
    await prisma.dataSourceSync.update({
      where: { userId_source: { userId, source: 'github' } },
      data: {
        status: 'failed',
        error: 'Rate limit exceeded. Will retry after reset.',
        nextSyncAt: new Date(error.response.headers['x-ratelimit-reset'] * 1000)
      }
    })
  }
}
```

**2. Invalid Access Token**
```typescript
if (error.status === 401) {
  // Token expired or invalid
  return NextResponse.json({
    error: 'GitHub token invalid',
    message: 'Please reconnect your GitHub account',
    action: 'reconnect_github'
  }, { status: 401 })
}
```

**3. Empty Repository List**
```typescript
if (repositories.length === 0) {
  // User has no repos
  await saveGitHubProfile(userId, {
    ...analytics,
    contributionScore: 0,
    consistencyScore: 0,
    codeQualityScore: 0
  })
}
```

---

## Testing Checklist

### Manual Testing

- [ ] Sign in with GitHub OAuth
- [ ] Verify GitHub account connection in database
- [ ] Trigger GitHub sync via API
- [ ] Check sync status updates in DataSourceSync table
- [ ] Verify GitHubProfile data in database
- [ ] Test with account having:
  - [ ] 0 repositories
  - [ ] 1-10 repositories
  - [ ] 50+ repositories
  - [ ] Mix of public/private repos
  - [ ] Forked repos
- [ ] Verify contribution score calculation
- [ ] Verify consistency score calculation
- [ ] Verify code quality score calculation
- [ ] Test unified sync endpoint
- [ ] Verify credibility score recalculation
- [ ] Check rate limit handling

### Database Verification

```bash
# Open Prisma Studio
npx prisma studio

# Navigate to GitHubProfile table
# Check fields:
# - username
# - totalRepos, totalCommits, totalStars
# - contributionScore, consistencyScore, codeQualityScore
# - languagesUsed (JSON)
# - topRepos (JSON)
# - contributionGraph (JSON)
```

---

## Example Use Cases

### 1. Developer Portfolio Verification
```typescript
// Fetch GitHub profile for credibility
const profile = await prisma.gitHubProfile.findUnique({
  where: { userId: 'user_123' }
})

// Display on public profile
if (profile.contributionScore >= 70) {
  badge = 'Active Developer ⭐'
}
```

### 2. Job Application Enhancement
```typescript
// Export GitHub stats for resume
{
  "github": {
    "username": "johndoe",
    "stats": {
      "repos": 45,
      "commits": 2834,
      "stars": 1250,
      "languages": ["TypeScript", "Python", "Go"]
    },
    "scores": {
      "contribution": 78,
      "consistency": 85,
      "quality": 72
    }
  }
}
```

### 3. Skill Verification
```typescript
// Verify language proficiency from actual code
const languages = profile.languagesUsed
// { "TypeScript": 45.2, "Python": 28.7, "Go": 15.3 }

// Can claim expertise in languages with >20% usage
```

---

## Future Enhancements

### Phase 3 (Weeks 5-8)
- [ ] Real-time sync with GitHub webhooks
- [ ] Contribution heatmap visualization
- [ ] Language proficiency badges
- [ ] Repository showcase on public profile

### Phase 4 (Weeks 9-12)
- [ ] GitHub Actions integration (CI/CD score)
- [ ] Code review quality analysis
- [ ] OSS project impact scoring
- [ ] Collaboration network graph

### Phase 5 (Weeks 13-16)
- [ ] Machine learning for code quality prediction
- [ ] Automated skill extraction from code
- [ ] Project complexity analysis
- [ ] Technical writing assessment (README quality)

---

## Troubleshooting

### Sync Fails with "Not Found"
- Check GitHub OAuth scopes include `repo` and `read:user`
- Verify access token is still valid
- Ensure user has public repositories

### Zero Contribution Score
- User may have no public repositories
- Check if repositories are forks only
- Verify recent activity exists

### Language Stats Empty
- Repositories may not have language tags
- Check if repos have actual code files
- Verify GitHub language detection is working

### Consistency Score is Low
- Irregular commit patterns
- Large gaps between commits
- Recent inactivity

---

## Support & Resources

- **GitHub API Documentation**: https://docs.github.com/en/rest
- **Octokit SDK**: https://github.com/octokit/rest.js
- **OAuth Scopes**: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps

---

**Last Updated**: 2025-10-08
**Version**: 1.0.0
**Status**: Production Ready ✅
