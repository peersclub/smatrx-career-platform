# Phase 1 MVP - AI Course Recommendations Implementation

## ✅ COMPLETED (January 9, 2025)

### 🎯 Overview
Successfully implemented AI-powered course recommendations using OpenAI GPT-4, integrated into Credably's Career Planner and Dashboard.

---

## 📂 Files Created

### 1. **API Endpoint**
**File:** `/apps/web/app/api/learning/recommendations/route.ts`
- **POST /api/learning/recommendations** - Generate new course recommendations
  - Input: `{ skillGaps, targetRole, currentLevel }`
  - Output: 5-8 personalized courses from Coursera, Udemy, LinkedIn Learning, etc.
  - Uses GPT-4 for intelligent analysis
  - Caches results in database (`LearningPath` table)
  
- **GET /api/learning/recommendations** - Retrieve cached recommendations
  - Returns most recent learning path
  - Faster load times for repeat visits

**Key Features:**
- ✅ OpenAI GPT-4 integration
- ✅ User profile context (current skills, experience, target role)
- ✅ Structured JSON output parsing
- ✅ Database caching
- ✅ Error handling

### 2. **UI Components**

#### `CourseRecommendationCard.tsx`
**Path:** `/apps/web/components/learning/CourseRecommendationCard.tsx`

**Features:**
- Beautiful card design with hover effects
- Provider logos (Coursera, Udemy, LinkedIn Learning, etc.)
- Course metadata: Duration, Difficulty, Rating, Skills Covered
- Save/Bookmark functionality
- "Start Course" CTA opens in new tab
- Animated entrance (Framer Motion)

**Props:**
```typescript
{
  course: {
    title: string
    provider: string
    url: string
    duration: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    skillsCovered: string[]
    rating: number
    description: string
    estimatedCompletionWeeks: number
  }
  index: number
  onSave?: (course) => void
  onStart?: (course) => void
  isSaved?: boolean
}
```

#### `CourseRecommendations.tsx`
**Path:** `/apps/web/components/learning/CourseRecommendations.tsx`

**Features:**
- Smart loading: Tries cached first, generates if none
- Loading state with spinner and messages
- Error state with retry button
- Empty state with skill gaps preview
- Grid layout for courses (responsive)
- Refresh button to regenerate

**Props:**
```typescript
{
  skillGaps?: string[]
  targetRole?: string
  currentLevel?: string
}
```

### 3. **Database Migration**
**File:** `prisma/migrations/20251009132812_add_learning_path_recommendations/`

**Schema Changes:**
```prisma
model LearningPath {
  // ... existing fields
  name              String
  targetRole        String?
  estimatedDuration Int?
  status            String @default("not_started")
  recommendations   Json?  // NEW: Stores course JSON
  // ... rest
}
```

### 4. **Integration Points**

#### Career Planner - Learning Tab
**File:** `/apps/web/app/dashboard/career-planner/career-planner-client.tsx`

**Changes:**
- Added `CourseRecommendations` import
- Integrated as primary feature in Learning section
- Passes skill gaps from mock data
- Divider separates AI recommendations from curated paths

#### Dashboard - Quick Actions
**File:** `/apps/web/app/dashboard/dashboard-content.tsx`

**Changes:**
- Added "AI Course Finder" card (5th quick action)
- Highlighted with purple gradient background
- Links directly to Learning tab (`?section=learning`)
- Sparkles icon for AI branding

---

## 🧠 AI Prompt Engineering

### System Prompt
```
You are a career development advisor for Credably, a platform helping 
professionals advance their careers.

User Context:
- Current Role: {profile.title}
- Years of Experience: {profile.yearsExperience}
- Target Role: {targetRole}
- Current Level: {currentLevel}
- Current Skills: {currentSkills}
- Skill Gaps to Fill: {skillGaps}

Task: Recommend 5-8 specific online courses that:
1. Must be from reputable platforms: Coursera, Udemy, LinkedIn Learning, 
   Pluralsight, edX, or freeCodeCamp
2. Must directly address one or more skill gaps
3. Must match the user's experience level
4. Should have high ratings (4.5+)
5. Include practical, hands-on learning
6. Provide a realistic URL format

Return ONLY valid JSON (no markdown).
```

### Response Format
```json
{
  "courses": [
    {
      "title": "Course title",
      "provider": "Platform name",
      "url": "https://actual-or-realistic-url.com",
      "duration": "X hours/weeks",
      "difficulty": "Beginner|Intermediate|Advanced",
      "skillsCovered": ["skill1", "skill2"],
      "rating": 4.7,
      "description": "Brief 1-2 sentence description",
      "estimatedCompletionWeeks": 4
    }
  ]
}
```

---

## 🚀 User Flow

### From Dashboard
1. User logs in → sees Dashboard
2. Sees "AI Course Finder" in Quick Actions (purple highlight)
3. Clicks → navigates to Career Planner Learning tab
4. CourseRecommendations component loads
5. Shows info card with skill gaps preview
6. Clicks "Get Recommendations"
7. Component tries to load cached recommendations
8. If none, generates new ones via OpenAI
9. Displays 5-8 course cards in grid
10. User can:
    - Save courses (bookmark icon)
    - Start course (opens provider URL)
    - Refresh recommendations

### From Career Planner
1. User navigates to Career Planner
2. Clicks "Learning Paths" tab
3. Sees CourseRecommendations at top
4. (Same flow as above from step 5)

---

## 💰 Cost Analysis

### Per Recommendation Request:
- **GPT-4 API Call:**
  - Input: ~500 tokens (user context + prompt)
  - Output: ~1000 tokens (8 courses × ~125 tokens)
  - Cost: ~$0.015 per request (GPT-4 pricing)

### Caching Benefits:
- First request: $0.015
- Subsequent requests: $0 (served from cache)
- Refresh button: $0.015

### Monthly Projections:
- 100 users × 2 requests/month = **$3/month**
- 1,000 users × 2 requests/month = **$30/month**
- 10,000 users × 2 requests/month = **$300/month**

**Much lower than initial $50-100/month estimate!**

---

## 🔒 Security & Privacy

### Implemented:
- ✅ Authentication check (NextAuth session required)
- ✅ User ID validation
- ✅ No PII sent to OpenAI (only skill names, role titles)
- ✅ Error handling (try/catch blocks)
- ✅ Response validation (JSON parsing)

### TODO (Future Enhancements):
- ☐ Rate limiting (prevent abuse)
- ☐ Request throttling (max N per hour)
- ☐ Course URL validation
- ☐ Analytics tracking (course clicks, enrollments)

---

## 🎨 Design System Compliance

### Color Palette:
- ✅ Grayscale base (gray-800, gray-700, gray-400)
- ✅ Purple accent (purple-400, purple-600 for CTAs)
- ✅ White text for headings
- ✅ No emojis (using Lucide icons)

### Components:
- ✅ Consistent with Career Planner design
- ✅ Card-based layout
- ✅ Hover effects (border-purple-500)
- ✅ Rounded corners (rounded-lg, rounded-xl)
- ✅ Animations (Framer Motion)

---

## 📊 Testing Checklist

### Manual Testing:
- ☐ Load Dashboard → Click "AI Course Finder"
- ☐ Career Planner → Learning tab
- ☐ Click "Get Recommendations"
- ☐ Verify loading state shows
- ☐ Verify courses display (5-8 cards)
- ☐ Test "Save" button (icon fills)
- ☐ Test "Start Course" button (opens URL)
- ☐ Test "Refresh" button (regenerates)
- ☐ Test error state (disconnect DB)
- ☐ Test cached state (reload page)

### API Testing:
```bash
# Test POST (generate)
curl -X POST http://localhost:3002/api/learning/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "skillGaps": ["React", "TypeScript"],
    "targetRole": "Senior Frontend Developer",
    "currentLevel": "Intermediate"
  }'

# Test GET (cached)
curl http://localhost:3002/api/learning/recommendations
```

### Edge Cases:
- ☐ No skill gaps provided (uses default)
- ☐ Invalid OpenAI response (error handling)
- ☐ Database connection failure (graceful degradation)
- ☐ User not logged in (401 redirect)

---

## 🚀 Deployment Steps

1. **Environment Variables:**
   ```bash
   # Verify OPENAI_API_KEY is set
   echo $OPENAI_API_KEY
   ```

2. **Database Migration:**
   ```bash
   pnpm prisma migrate deploy
   ```

3. **Build & Start:**
   ```bash
   pnpm build
   pnpm start
   ```

4. **Verify:**
   - Navigate to `http://localhost:3002/dashboard`
   - Click "AI Course Finder"
   - Generate recommendations
   - Verify courses display

---

## 📈 Next Steps (Future Phases)

### Phase 1.5 - Enhancements (1 week)
- [ ] Add course provider APIs (live data)
  - Coursera API integration
  - Udemy Affiliate API
  - LinkedIn Learning (if available)
- [ ] Track course enrollments (analytics)
- [ ] Save courses to user profile
- [ ] Email course recommendations

### Phase 2 - ChatGPT Apps SDK (Q2 2025)
- [ ] Apply for OpenAI Apps Program
- [ ] Build MCP server
- [ ] Two-way integration (ChatGPT ↔ Credably)
- [ ] "Chat with AI advisor" feature

### Phase 3 - Advanced Features
- [ ] Course completion tracking
- [ ] Skill validation post-completion
- [ ] Learning streaks & gamification
- [ ] Peer learning groups
- [ ] Mentor matching

---

## 📝 Known Issues

1. **Mock Data:** Currently using mock skill gaps from Career Planner data
   - **Fix:** Connect to real user skill analysis (already in DB)

2. **Course URLs:** Generated URLs may not always be accurate
   - **Fix:** Integrate live course provider APIs

3. **No Persistence:** Saved courses don't persist yet
   - **Fix:** Add `SavedCourse` table or use JSON field

---

## 🎉 Success Metrics

### Immediate KPIs:
- Course recommendation click-through rate: **Target 30%+**
- Time to first recommendation: **Target < 10 seconds**
- User satisfaction: **Target 4.5/5 stars**

### Long-term KPIs:
- Course enrollment rate: **Target 10%+**
- Skill gap reduction: **Track before/after**
- Monthly active users using AI recommendations: **Target 50%+**

---

## 🙏 Credits

- **OpenAI GPT-4:** Intelligent course analysis
- **Framer Motion:** Smooth animations
- **Lucide React:** Beautiful icons
- **Tailwind CSS:** Rapid styling
- **Prisma:** Database ORM

---

## 📞 Support

For questions or issues:
1. Check `/CHATGPT_APPS_INTEGRATION_PLAN.md` for full context
2. Review API logs: `apps/web/app/api/learning/recommendations/route.ts`
3. Test with curl commands above

---

**Status:** ✅ MVP Complete - Ready for Testing
**Date:** January 9, 2025
**Version:** 1.0.0

