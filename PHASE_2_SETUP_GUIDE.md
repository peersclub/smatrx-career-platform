# Phase 2 Setup Guide - Social Media Integrations

## 🎯 Overview

Phase 2 focuses on integrating social media platforms (Twitter, Instagram, YouTube) to fetch verified data and enhance credibility scoring.

**Status**: Twitter Integration ✅ Complete | Instagram & YouTube ⏳ Next

---

## ✅ What's Ready

### 1. Twitter/X Integration (COMPLETE)

#### Files Created:
```
apps/web/lib/services/social-integrations/
└── twitter.ts (15 KB, 500+ lines)

apps/web/lib/auth.ts
└── Updated with TwitterProvider

apps/web/app/api/social/twitter/sync/
└── route.ts (GET & POST endpoints)
```

#### Features:
- ✅ OAuth 2.0 with PKCE authentication
- ✅ Profile data fetching (followers, tweets, verified status)
- ✅ Engagement rate calculation
- ✅ Influence score algorithm (0-100)
- ✅ Optional AI content quality analysis
- ✅ Automatic sync status tracking
- ✅ Database storage in `SocialProfile` model

---

## 🚀 Getting Started with Twitter Integration

### Step 1: Create Twitter App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new Project and App
3. Navigate to **App Settings** → **User authentication settings**
4. Configure OAuth 2.0:
   - **App permissions**: Read
   - **Type of App**: Web App
   - **Callback URL**: `http://localhost:3002/api/auth/callback/twitter`
   - **Website URL**: `http://localhost:3002`
5. Save your **Client ID** and **Client Secret**

### Step 2: Configure Environment Variables

Add to your `.env.local`:

```env
# Twitter OAuth 2.0
TWITTER_CLIENT_ID="your_client_id_here"
TWITTER_CLIENT_SECRET="your_client_secret_here"

# Optional: For AI content analysis
OPENAI_API_KEY="sk-your-openai-key"
```

### Step 3: Test the Integration

1. **Start the development server**:
   ```bash
   cd /Users/Victor/Projects/smatrx-career-platform
   pnpm dev
   ```

2. **Sign in with Twitter**:
   - Navigate to `http://localhost:3002/auth/signin`
   - Click "Sign in with Twitter"
   - Authorize the app

3. **Trigger Twitter sync**:
   ```bash
   # Via API
   curl -X POST http://localhost:3002/api/social/twitter/sync \
     -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
   ```

4. **Check sync status**:
   ```bash
   curl http://localhost:3002/api/social/twitter/sync \
     -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
   ```

---

## 📊 How Twitter Data Affects Credibility Score

The Twitter integration contributes to the **Social Score** (15% of overall credibility):

### Calculation Formula:

```typescript
// Follower score (logarithmic, max 35 points)
followerScore = min(35, log10(followers + 1) * 7)

// Engagement score (max 25 points)
engagementRate = (avgLikes + avgRetweets) / followers * 100
engagementScore = min(25, engagementRate * 2.5)

// Follower-to-following ratio (max 15 points)
ratio = followers / following
ratioScore = min(15, log10(ratio + 1) * 10)

// Verification bonus (max 15 points)
verificationScore = 10 (blue check) | 12 (business) | 15 (government)

// Account age (max 5 points, 1 per year)
ageScore = min(5, years_since_creation)

// Listed count (how many lists user is on, max 5 points)
listedScore = min(5, log10(listed_count + 1) * 2)

// Total influence score
influenceScore = sum of all scores (max 100)
```

### Example Calculations:

**User A (Micro-Influencer)**:
- Followers: 10,000
- Following: 500
- Engagement: 2%
- Verified: Blue check
- Account age: 3 years
- Listed: 50 lists

```
Follower score: log10(10000) * 7 = 28 points
Engagement score: 2 * 2.5 = 5 points
Ratio score: log10(20) * 10 = 13 points
Verification: 10 points
Age: 3 points
Listed: log10(50) * 2 = 3.4 points
Total: 62.4 / 100
```

**User B (Established Professional)**:
- Followers: 100,000
- Following: 1,000
- Engagement: 1.5%
- Verified: Business
- Account age: 8 years
- Listed: 200 lists

```
Follower score: log10(100000) * 7 = 35 points (capped)
Engagement score: 1.5 * 2.5 = 3.75 points
Ratio score: log10(100) * 10 = 20 points (capped at 15)
Verification: 12 points
Age: 5 points (capped)
Listed: log10(200) * 2 = 4.6 points
Total: 75.35 / 100
```

---

## 🔧 Technical Details

### Twitter API Endpoints Used

1. **GET /2/users/me** - Fetch user profile
   - Fields: id, username, name, profile_image_url, verified, description

2. **GET /2/users/:id** - Fetch metrics
   - Fields: public_metrics (followers, following, tweets, listed)

3. **GET /2/users/:id/tweets** - Fetch recent tweets
   - For engagement analysis (likes, retweets, replies)

### Data Flow

```
User Auth (Twitter OAuth 2.0)
         ↓
   Get Access Token
         ↓
   Store in Account table
         ↓
   Trigger Sync (API call)
         ↓
   Fetch Twitter Data (via twitter.ts service)
         ↓
   Calculate Metrics (engagement, influence)
         ↓
   Optional AI Content Analysis (OpenAI)
         ↓
   Save to SocialProfile table
         ↓
   Update DataSourceSync status
         ↓
   Recalculate Credibility Score
```

### Database Schema

```typescript
model SocialProfile {
  id              String   @id @default(cuid())
  userId          String
  platform        String   // 'twitter'
  username        String
  profileUrl      String?
  verified        Boolean  @default(false)
  followerCount   Int?
  followingCount  Int?
  engagementRate  Float?
  contentScore    Float?   // AI-assessed (0-100)
  influenceScore  Float?   // Calculated (0-100)
  lastFetchedAt   DateTime
  metrics         Json     // Additional platform data

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, platform])
}

model DataSourceSync {
  id            String    @id @default(cuid())
  userId        String
  source        String    // 'twitter'
  status        String    // 'pending', 'syncing', 'completed', 'failed'
  lastSyncAt    DateTime?
  nextSyncAt    DateTime?
  syncFrequency String    // 'daily'
  error         String?

  @@unique([userId, source])
}
```

---

## 🧪 Testing Checklist

- [ ] Twitter OAuth flow works
- [ ] Access token is stored correctly
- [ ] Sync API endpoint returns 200
- [ ] Data is saved to `SocialProfile` table
- [ ] Sync status is tracked in `DataSourceSync`
- [ ] Credibility score updates after sync
- [ ] Error handling works (invalid token, API limits)
- [ ] Re-sync updates existing data (not duplicates)

---

## 🐛 Troubleshooting

### Issue: "Twitter account not connected"
**Solution**: User needs to sign in with Twitter first via NextAuth

### Issue: "Failed to fetch Twitter data"
**Possible causes**:
1. Invalid access token (user needs to re-authenticate)
2. Twitter API rate limit reached (wait 15 minutes)
3. Twitter API credentials invalid (check .env)

### Issue: Engagement rate showing as 0
**Cause**: User has no recent tweets or very low engagement
**Solution**: This is expected for inactive accounts

### Issue: Content score not calculating
**Cause**: OPENAI_API_KEY not set in environment
**Solution**: Add OpenAI API key or skip content analysis (it's optional)

---

## 📈 Next Steps

### Week 2: Instagram Integration

**Files to Create**:
```
apps/web/lib/services/social-integrations/
└── instagram.ts

apps/web/app/api/social/instagram/sync/
└── route.ts
```

**Setup Requirements**:
1. Create Facebook Developer account
2. Create Facebook App
3. Enable Instagram Graph API
4. Request `instagram_basic` and `instagram_manage_insights` permissions
5. Add Instagram OAuth to NextAuth config

**API Endpoints**:
- GET `/me` - User profile
- GET `/me/media` - User posts
- GET `/{media-id}/insights` - Post insights (likes, comments, reach)

---

### Week 2: YouTube Integration

**Files to Create**:
```
apps/web/lib/services/social-integrations/
└── youtube.ts

apps/web/app/api/social/youtube/sync/
└── route.ts
```

**Setup Requirements**:
1. Enable YouTube Data API v3 in Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add YouTube OAuth to NextAuth config

**API Endpoints**:
- GET `/channels` - Channel info
- GET `/channels/statistics` - Subscriber count, views
- GET `/search` - Recent videos
- GET `/videos` - Video details and engagement

---

## 🔐 Security Considerations

1. **Access Token Storage**: Tokens are encrypted by NextAuth in the database
2. **Scope Minimization**: Only request `tweet.read` and `users.read` scopes
3. **Rate Limiting**: Implement rate limiting on sync endpoints (max 10 syncs/hour per user)
4. **Token Refresh**: Twitter OAuth 2.0 tokens expire; implement refresh logic
5. **Error Handling**: Never expose API keys or tokens in error messages

---

## 📊 Monitoring & Analytics

### Metrics to Track:
- Number of users with Twitter connected
- Average Twitter influence score
- Sync success rate
- API error rate
- Sync duration (should be <5s)

### Database Queries:

```sql
-- Users with Twitter connected
SELECT COUNT(*) FROM "SocialProfile" WHERE platform = 'twitter';

-- Average influence score
SELECT AVG("influenceScore") FROM "SocialProfile" WHERE platform = 'twitter';

-- Failed syncs in last 24h
SELECT COUNT(*) FROM "DataSourceSync"
WHERE source = 'twitter' AND status = 'failed'
AND "createdAt" > NOW() - INTERVAL '24 hours';

-- Top Twitter influencers
SELECT u.name, sp.username, sp."influenceScore", sp."followerCount"
FROM "SocialProfile" sp
JOIN "User" u ON u.id = sp."userId"
WHERE sp.platform = 'twitter'
ORDER BY sp."influenceScore" DESC
LIMIT 10;
```

---

## 🎓 Learning Resources

- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [NextAuth.js Twitter Provider](https://next-auth.js.org/providers/twitter)
- [OAuth 2.0 PKCE Flow](https://oauth.net/2/pkce/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)

---

**Phase 2 Progress**: Twitter ✅ | Instagram ⏳ | YouTube ⏳
**Next Action**: Set up Twitter Developer account and test integration
**Est. Time**: 1-2 hours for setup and testing

---

*Last Updated: 2025-10-08*
*Project: SMATRX V3 - Credibility-First Career Intelligence Platform*
