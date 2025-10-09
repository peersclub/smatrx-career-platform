# ChatGPT Apps SDK Integration Plan for Credably

## 🎯 Executive Summary

Integrate ChatGPT's Apps SDK (built on Model Context Protocol - MCP) to provide intelligent course recommendations from Coursera, Udemy, LinkedIn Learning, and other platforms directly within Credably's Learning Paths feature.

---

## 📋 What ChatGPT Apps SDK Offers

### Current Capabilities (2024-2025)
- **Apps in ChatGPT**: Users can interact with services like Coursera directly in ChatGPT
- **Apps SDK**: Built on Model Context Protocol (MCP) for creating custom apps
- **Interactive Elements**: Maps, playlists, presentations, course catalogs
- **Currently in Preview**: SDK accepting submissions for review

### Key Partners Already Integrated
✅ Coursera
✅ Khan Academy
✅ Udemy (planned)
- LinkedIn Learning
- Pluralsight
- edX

---

## 🏗️ Architecture Design

### Option 1: Direct ChatGPT API Integration (Recommended for MVP)
```
User Skill Gap → AI Analysis → Course Recommendations → Display in Credably
```

**Pros:**
- Faster to implement
- Full control over UX
- No dependency on Apps SDK preview approval
- Can use existing OpenAI API

**Cons:**
- Need to maintain course database/API connections
- More backend work

### Option 2: ChatGPT Apps SDK Integration (Future Enhancement)
```
Credably ↔ MCP Server ↔ ChatGPT Apps ↔ Course Providers
```

**Pros:**
- Leverages existing ChatGPT-Coursera integration
- Real-time course updates
- Access to multiple platforms

**Cons:**
- SDK still in preview
- Need approval from OpenAI
- Less UX control

---

## 🎨 Proposed User Experience

### 1. **Skill Gap Analysis Page**
```
Current State:
- User has skill gaps identified
- See "Missing Skills" list

Enhanced State:
- Click "Get Learning Path" button
- AI analyzes skill gap + user profile
- Returns personalized courses
```

### 2. **Learning Path Recommendations**
```
Display:
- Course Title
- Provider (Coursera, Udemy, etc.)
- Duration
- Difficulty Level
- Rating
- Estimated Time to Complete Skill Gap
- Direct enrollment link
```

### 3. **Integration Points in Credably**
- ✅ Career Planner → "Learning" tab
- ✅ Skill Gap Analysis cards
- ✅ Dashboard → "Quick Actions"
- ✅ Profile → "Recommended Courses" section

---

## 🔧 Technical Implementation Plan

### Phase 1: MVP with OpenAI API (2-3 weeks)

#### Step 1: Backend API Endpoint
**File:** `/apps/web/app/api/learning/recommendations/route.ts`

```typescript
import { OpenAI } from 'openai';

// Analyze skill gaps and recommend courses
POST /api/learning/recommendations
Body: {
  userId: string,
  skillGaps: string[],
  targetRole: string,
  currentLevel: string
}

Response: {
  courses: [
    {
      title: string,
      provider: string,
      url: string,
      duration: string,
      difficulty: string,
      skillsCovered: string[],
      rating: number
    }
  ]
}
```

#### Step 2: Course Database Integration
**Options:**
1. **Coursera API** (if available)
2. **Udemy Affiliate API**
3. **Web scraping + caching**
4. **Manual curated database** (start small)

#### Step 3: AI Prompt Engineering
```
System Prompt:
"You are a career advisor for Credably. Given a user's skill gaps, 
current skills, and target role, recommend specific courses that:
1. Fill the skill gaps efficiently
2. Are from reputable platforms
3. Match the user's experience level
4. Have high ratings
5. Provide practical, hands-on learning

Return as structured JSON."
```

#### Step 4: UI Components
**New Components:**
- `CourseRecommendationCard.tsx`
- `LearningPathTimeline.tsx`
- `CourseModal.tsx` (detailed view)

**Update Existing:**
- Career Planner Learning Tab
- Dashboard Quick Actions

### Phase 2: ChatGPT Apps SDK Integration (Future - Q2 2025)

#### When SDK Exits Preview:
1. **Apply for OpenAI Apps Program**
   - Submit Credably app for review
   - Get approved for integration

2. **Build MCP Server**
   - Set up Model Context Protocol server
   - Connect to Credably backend
   - Enable ChatGPT to query our skill data

3. **Two-way Integration**
   - Users chat with "Credably GPT" in ChatGPT
   - ChatGPT apps embedded in Credably
   - Seamless cross-platform experience

---

## 📊 Data Flow

### MVP Flow (Phase 1)
```
1. User clicks "Get Recommendations" on Skill Gap card
2. Frontend → /api/learning/recommendations
3. Backend:
   - Fetch user profile + skills + gaps
   - Query OpenAI with structured prompt
   - Query course APIs (Coursera, Udemy)
   - Match & rank courses
4. Return recommendations
5. Display in LearningPathCard
6. User clicks → External course page (affiliate link)
```

### Future Flow (Phase 2 with Apps SDK)
```
1. User in Career Planner
2. Click "Ask AI for Learning Path"
3. Opens ChatGPT Apps modal (in-app)
4. User chats: "I need to learn React for Senior Frontend role"
5. ChatGPT Apps:
   - Accesses Credably user context via MCP
   - Queries Coursera app directly
   - Returns interactive course cards
6. User enrolls without leaving Credably
```

---

## 💰 Cost & Resource Estimates

### Phase 1 (MVP)
- **Development:** 2-3 weeks (1 developer)
- **OpenAI API Costs:** ~$0.002 per recommendation (GPT-4)
  - 1000 recommendations = $2
  - Expected: $50-100/month initially
- **Course API Costs:**
  - Coursera: Free tier available
  - Udemy Affiliate: Free
- **Total:** ~$100-200/month

### Phase 2 (Apps SDK)
- **Development:** 3-4 weeks
- **OpenAI Apps Review:** 2-4 weeks
- **Additional Costs:** TBD (based on Apps SDK pricing)

---

## 🎯 Success Metrics

### Phase 1 KPIs
- **Course Click-Through Rate:** Target 30%+
- **Course Enrollment Rate:** Target 10%+
- **User Satisfaction:** Target 4.5/5 stars
- **Skill Gap Reduction:** Track before/after

### Phase 2 KPIs
- **In-App Engagement:** Session duration
- **ChatGPT Integration Usage:** % of users
- **Course Completion:** Track via APIs

---

## 🚀 Recommended Next Steps

### Immediate Actions:
1. ✅ **Review this plan** - Get your approval
2. **Set up OpenAI API** - Use existing key or create new project
3. **Choose MVP approach:**
   - Option A: Curated course database (faster, limited)
   - Option B: Live API integration (slower, scalable)
4. **Design UI mockups** - LearningPathCard component

### Week 1:
- Set up `/api/learning/recommendations` endpoint
- Create course recommendation prompt
- Test with sample data

### Week 2:
- Integrate course provider APIs
- Build UI components
- Connect to Career Planner

### Week 3:
- Testing & refinement
- Deploy to production
- Monitor usage & feedback

---

## 🔒 Security & Privacy

### Considerations:
- ✅ Don't send PII to OpenAI (hash user IDs)
- ✅ Cache recommendations (reduce API calls)
- ✅ Rate limiting (prevent abuse)
- ✅ User consent for AI recommendations
- ✅ Data retention policy

---

## 💡 Alternative Approaches

### If ChatGPT Apps SDK Not Available:
1. **Build our own recommendation engine:**
   - Use open-source LLMs (Llama, Mistral)
   - Host on our infrastructure
   - More control, higher upfront cost

2. **Partner directly with course providers:**
   - Coursera for Business API
   - Udemy Business
   - LinkedIn Learning API

3. **Hybrid approach:**
   - Use OpenAI for analysis
   - Pre-curated course database
   - Manual curation + AI ranking

---

## 📚 Resources & Documentation

- **OpenAI Apps SDK:** https://openai.com/index/introducing-apps-in-chatgpt/
- **Model Context Protocol:** https://modelcontextprotocol.io/
- **Coursera API:** https://tech.coursera.org/app-platform/
- **Udemy Affiliate:** https://www.udemy.com/affiliate/

---

## ✅ Decision Points

### For You to Decide:

1. **Phase 1 vs Wait for SDK?**
   - ☐ Start with Phase 1 MVP (recommended)
   - ☐ Wait for Apps SDK full release

2. **Course Database Approach?**
   - ☐ Curated database (faster, 100-200 courses)
   - ☐ Live API integration (scalable, all courses)
   - ☐ Hybrid (curated + API for search)

3. **Budget Approval?**
   - ☐ $100-200/month for Phase 1
   - ☐ Additional for Phase 2 if needed

4. **Timeline?**
   - ☐ Start immediately (2-3 weeks to MVP)
   - ☐ Plan for Q1 2025
   - ☐ Wait for Apps SDK exit preview

---

## 🎬 Conclusion

**Recommendation:** Start with **Phase 1 MVP** using OpenAI API + course provider APIs.

**Why?**
- ✅ Faster time to market (2-3 weeks)
- ✅ Full control over UX
- ✅ Apps SDK still in preview
- ✅ Can migrate to Apps SDK later
- ✅ Lower initial cost

**Next Step:** Get your approval on approach, then I'll start building! 🚀

---

Generated: $(date)
