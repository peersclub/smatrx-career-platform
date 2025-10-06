# API Documentation

## Overview

SMATRX V3 provides a RESTful API built with Next.js API routes. All endpoints are prefixed with `/api` and return JSON responses.

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. Include the session cookie in your requests.

```typescript
// Example authenticated request
const response = await fetch('/api/skills', {
  headers: {
    'Cookie': 'next-auth.session-token=your-session-token'
  }
});
```

## Base URL

- **Development**: `http://localhost:3002/api`
- **Production**: `https://your-domain.com/api`

## Endpoints

### Authentication

#### `GET /api/auth/[...nextauth]`
NextAuth.js authentication handler.

**Response**: Redirects to OAuth providers or returns session data.

---

### User Profile

#### `GET /api/profile`
Get current user's profile information.

**Headers**: `Cookie: next-auth.session-token`

**Response**:
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://avatar-url.com"
  },
  "profile": {
    "bio": "Software Engineer",
    "title": "Senior Developer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "yearsExperience": 5,
    "careerStage": "senior",
    "industries": ["Technology", "Finance"],
    "languages": ["English", "Spanish"],
    "availability": "full-time",
    "remotePreference": "hybrid",
    "salaryExpectation": {
      "min": 100000,
      "max": 150000,
      "currency": "USD"
    }
  }
}
```

#### `POST /api/profile`
Update user profile information.

**Headers**: 
- `Cookie: next-auth.session-token`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "name": "John Doe",
  "profile": {
    "bio": "Updated bio",
    "title": "Senior Software Engineer",
    "company": "New Company",
    "location": "New York, NY",
    "yearsExperience": 6,
    "careerStage": "senior",
    "industries": ["Technology", "Healthcare"],
    "languages": ["English", "French"],
    "availability": "full-time",
    "remotePreference": "remote",
    "salaryExpectation": {
      "min": 120000,
      "max": 180000,
      "currency": "USD"
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### Skills Management

#### `GET /api/skills`
Get user's skills with analysis.

**Headers**: `Cookie: next-auth.session-token`

**Response**:
```json
{
  "skills": [
    {
      "id": "skill-id",
      "name": "React",
      "category": "Frontend",
      "level": "advanced",
      "proficiencyScore": 85,
      "verified": false,
      "source": "github",
      "yearsExperience": 3,
      "lastUsed": "2024-01-15T00:00:00.000Z"
    }
  ],
  "insights": {
    "totalSkills": 15,
    "verifiedSkills": 3,
    "averageProficiency": 72,
    "topCategories": ["Frontend", "Backend", "DevOps"]
  }
}
```

#### `POST /api/skills/import`
Import skills from external sources.

**Headers**: 
- `Cookie: next-auth.session-token`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "source": "github" // or "linkedin", "resume"
}
```

**Response**:
```json
{
  "importId": "import-id",
  "status": "started",
  "message": "Import process initiated"
}
```

#### `GET /api/skills/import/[importId]`
Check import progress.

**Headers**: `Cookie: next-auth.session-token`

**Response**:
```json
{
  "id": "import-id",
  "source": "github",
  "status": "processing", // "pending", "processing", "completed", "failed"
  "progress": 75,
  "message": "Analyzing repositories...",
  "results": {
    "languagesFound": 8,
    "frameworksFound": 12,
    "reposAnalyzed": 25
  },
  "startedAt": "2024-01-15T10:00:00.000Z",
  "completedAt": null,
  "error": null
}
```

#### `POST /api/skills/analyze`
Analyze text for skills using AI.

**Headers**: 
- `Cookie: next-auth.session-token`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "type": "text-analysis",
  "data": {
    "text": "I have 5 years of experience with React, Node.js, and Python...",
    "context": "resume"
  }
}
```

**Response**:
```json
{
  "skills": [
    {
      "name": "React",
      "confidence": 0.95,
      "level": "advanced",
      "category": "Frontend"
    },
    {
      "name": "Node.js",
      "confidence": 0.88,
      "level": "intermediate",
      "category": "Backend"
    }
  ],
  "summary": "Strong frontend and backend development skills detected"
}
```

#### `POST /api/skills/insights`
Generate AI-powered career insights.

**Headers**: 
- `Cookie: next-auth.session-token`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "skills": [
    {
      "name": "React",
      "level": "advanced",
      "proficiencyScore": 85
    }
  ]
}
```

**Response**:
```json
{
  "skillStrength": {
    "score": 78,
    "label": "Strong",
    "description": "You have a solid foundation in modern web technologies"
  },
  "topSkills": [
    {
      "name": "React",
      "category": "Frontend",
      "marketDemand": "high",
      "growthTrend": 15
    }
  ],
  "careerReadiness": {
    "score": 72,
    "readyFor": ["Senior Frontend Developer", "Full Stack Engineer"],
    "gaps": ["DevOps", "Testing"]
  },
  "recommendations": [
    {
      "type": "skill",
      "title": "Learn Docker",
      "description": "Containerization is essential for modern development",
      "priority": "high"
    }
  ]
}
```

---

### Resume Processing

#### `POST /api/resume/upload-simple`
Upload and analyze resume file.

**Headers**: `Cookie: next-auth.session-token`

**Request**: `multipart/form-data`
- `file`: Resume file (PDF or TXT)

**Response**:
```json
{
  "success": true,
  "skills": [
    {
      "name": "JavaScript",
      "confidence": 0.92,
      "level": "advanced"
    }
  ],
  "analysis": {
    "totalSkills": 12,
    "categories": ["Programming", "Frameworks", "Tools"],
    "experience": "5+ years"
  }
}
```

---

### Onboarding

#### `POST /api/onboarding/complete`
Mark onboarding as completed.

**Headers**: `Cookie: next-auth.session-token`

**Response**:
```json
{
  "success": true,
  "message": "Onboarding completed successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request data",
  "details": {
    "field": "email",
    "issue": "Invalid email format"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- **Authentication endpoints**: No limit
- **Profile endpoints**: 100 requests per hour
- **Skills endpoints**: 50 requests per hour
- **AI analysis endpoints**: 20 requests per hour

## Webhooks

### Skill Import Completion

When a skill import completes, a webhook is triggered:

**URL**: `POST /api/webhooks/import-complete`

**Payload**:
```json
{
  "importId": "import-id",
  "userId": "user-id",
  "source": "github",
  "status": "completed",
  "results": {
    "skillsImported": 15,
    "newSkills": 8,
    "updatedSkills": 7
  }
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class SMATRXClient {
  constructor(private baseUrl: string, private sessionToken: string) {}

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/api/profile`, {
      headers: {
        'Cookie': `next-auth.session-token=${this.sessionToken}`
      }
    });
    return response.json();
  }

  async importSkills(source: 'github' | 'linkedin' | 'resume') {
    const response = await fetch(`${this.baseUrl}/api/skills/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.session-token=${this.sessionToken}`
      },
      body: JSON.stringify({ source })
    });
    return response.json();
  }
}
```

### Python

```python
import requests

class SMATRXClient:
    def __init__(self, base_url: str, session_token: str):
        self.base_url = base_url
        self.session_token = session_token
        self.session = requests.Session()
        self.session.cookies.set('next-auth.session-token', session_token)

    def get_profile(self):
        response = self.session.get(f"{self.base_url}/api/profile")
        return response.json()

    def import_skills(self, source: str):
        response = self.session.post(
            f"{self.base_url}/api/skills/import",
            json={"source": source}
        )
        return response.json()
```

## Testing

### Postman Collection

Import our Postman collection for easy API testing:

[Download Collection](./postman/SMATRX-V3-API.postman_collection.json)

### cURL Examples

```bash
# Get user profile
curl -X GET "http://localhost:3002/api/profile" \
  -H "Cookie: next-auth.session-token=your-token"

# Import skills from GitHub
curl -X POST "http://localhost:3002/api/skills/import" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-token" \
  -d '{"source": "github"}'

# Analyze text for skills
curl -X POST "http://localhost:3002/api/skills/analyze" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-token" \
  -d '{
    "type": "text-analysis",
    "data": {
      "text": "I have experience with React and Node.js",
      "context": "resume"
    }
  }'
```
