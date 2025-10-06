# Database Schema Documentation

## Overview

SMATRX V3 uses PostgreSQL as the primary database with Prisma ORM for type-safe database operations. The schema is designed to support user authentication, skill management, career tracking, and AI-powered insights.

## Database Connection

```typescript
// Connection string format
DATABASE_URL="postgresql://username:password@localhost:5432/smatrx_db"
```

## Schema Models

### User Management

#### User
Core user account information from NextAuth.js.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  profile       Profile?
  skills        UserSkill[]
  imports       SkillImport[]
  goals         CareerGoal[]
  achievements  Achievement[]
}
```

**Fields:**
- `id`: Unique user identifier
- `name`: User's display name
- `email`: User's email address (optional for OAuth)
- `emailVerified`: Email verification timestamp
- `image`: Profile image URL
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

#### Account
OAuth provider account information.

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  refresh_token_expires_in Int?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

**Fields:**
- `id`: Unique account identifier
- `userId`: Reference to User
- `type`: OAuth type (oauth)
- `provider`: OAuth provider (github, linkedin, google)
- `providerAccountId`: Provider's user ID
- `refresh_token`: OAuth refresh token
- `access_token`: OAuth access token
- `expires_at`: Token expiration timestamp
- `refresh_token_expires_in`: Refresh token expiration

#### Session
User session management.

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### Profile Management

#### Profile
Extended user profile information.

```prisma
model Profile {
  id             String    @id @default(cuid())
  userId         String    @unique
  bio            String?
  title          String?
  company        String?
  location       String?
  linkedinUrl    String?
  githubUrl      String?
  websiteUrl     String?
  yearsExperience Int?
  careerStage    String?   // student, entry, mid, senior, lead, executive
  industries     String[]
  languages      String[]
  availability   String?   // full-time, part-time, contract, freelance
  remotePreference String? // remote, hybrid, onsite
  salaryExpectation Json?  // { min, max, currency }
  targetRole     String?
  careerTimeline String?   // immediate, 3months, 6months, 1year, exploring
  willingToRelocate Boolean @default(false)
  preferredLocations String[]
  onboardingCompleted Boolean @default(false)
  onboardingCompletedAt DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Fields:**
- `bio`: User's professional bio
- `title`: Current job title
- `company`: Current company
- `location`: Geographic location
- `yearsExperience`: Years of professional experience
- `careerStage`: Current career level
- `industries`: Array of industry interests
- `languages`: Spoken languages
- `availability`: Work availability preference
- `remotePreference`: Remote work preference
- `salaryExpectation`: Salary range and currency
- `targetRole`: Aspirational job title
- `careerTimeline`: When looking to make career changes
- `willingToRelocate`: Relocation willingness
- `preferredLocations`: Preferred work locations
- `onboardingCompleted`: Onboarding completion status

### Skills Management

#### Skill
Master skills database.

```prisma
model Skill {
  id           String         @id @default(cuid())
  name         String         @unique
  slug         String         @unique
  description  String?
  categoryId   String
  tags         String[]
  marketDemand String?        // high, medium, low
  averageSalary Json?         // { min, max, currency, region }
  growthTrend  Float?         // percentage growth
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  // Relations
  category     SkillCategory  @relation(fields: [categoryId], references: [id])
  userSkills   UserSkill[]
  imports      SkillImport[]
}
```

**Fields:**
- `name`: Skill name (e.g., "React", "Python")
- `slug`: URL-friendly identifier
- `description`: Skill description
- `categoryId`: Reference to skill category
- `tags`: Array of skill tags
- `marketDemand`: Current market demand level
- `averageSalary`: Salary information by region
- `growthTrend`: Growth percentage over time

#### SkillCategory
Skill categorization.

```prisma
model SkillCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  color       String?  // hex color code
  icon        String?  // icon identifier
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  skills      Skill[]
}
```

**Common Categories:**
- Programming Languages
- Frameworks & Libraries
- Databases
- Cloud Platforms
- DevOps Tools
- Design Tools
- Soft Skills

#### UserSkill
User-skill relationships with proficiency data.

```prisma
model UserSkill {
  id               String    @id @default(cuid())
  userId           String
  skillId          String
  level            String    // beginner, intermediate, advanced, expert
  proficiencyScore Int?      // 0-100
  yearsExperience  Int?
  lastUsed         DateTime?
  verified         Boolean   @default(false)
  verifiedAt       DateTime?
  verifiedBy       String?   // verifier user ID
  source           String    // github, linkedin, resume, manual, verified
  evidence         Json?     // supporting evidence
  createdAt        DateTime  @default(now())
  updatedAt        DateTime @updatedAt

  // Relations
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill            Skill     @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@unique([userId, skillId])
}
```

**Fields:**
- `level`: Proficiency level
- `proficiencyScore`: Numerical proficiency (0-100)
- `yearsExperience`: Years of experience with skill
- `lastUsed`: Last time skill was used
- `verified`: Whether skill is verified by expert
- `source`: How skill was acquired/imported
- `evidence`: Supporting documentation

### Import Management

#### SkillImport
Track skill import processes.

```prisma
model SkillImport {
  id          String    @id @default(cuid())
  userId      String
  source      String    // github, linkedin, resume
  status      String    // pending, processing, completed, failed
  progress    Int?      // 0-100
  message     String?   // current status message
  results     Json?     // import results data
  error       String?   // error message if failed
  startedAt   DateTime  @default(now())
  completedAt DateTime?

  // Relations
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  skills      Skill[]   @relation("ImportSkills")

  @@index([userId])
  @@index([status])
}
```

**Status Values:**
- `pending`: Import queued
- `processing`: Currently importing
- `completed`: Successfully completed
- `failed`: Import failed

### Career Development

#### CareerGoal
User career objectives and milestones.

```prisma
model CareerGoal {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String?
  type        String    // skill, role, certification, project
  targetDate  DateTime?
  status      String    // active, completed, paused, cancelled
  priority    String    // low, medium, high
  progress    Int       @default(0) // 0-100
  createdAt   DateTime  @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Achievement
User achievements and milestones.

```prisma
model Achievement {
  id          String    @id @default(cuid())
  userId      String
  type        String    // skill, certification, project, milestone
  title       String
  description String?
  points      Int       @default(0)
  badge       String?   // badge image URL
  earnedAt    DateTime  @default(now())

  // Relations
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Analytics

#### SkillAnalysis
AI-powered skill analysis results.

```prisma
model SkillAnalysis {
  id          String    @id @default(cuid())
  userId      String
  analysisType String   // profile, gap, recommendation
  data        Json      // analysis results
  confidence  Float?    // AI confidence score
  createdAt   DateTime  @default(now())

  // Relations
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Database Indexes

### Performance Indexes

```sql
-- User lookups
CREATE INDEX idx_user_email ON "User"("email");
CREATE INDEX idx_user_created_at ON "User"("createdAt");

-- Skill searches
CREATE INDEX idx_skill_name ON "Skill"("name");
CREATE INDEX idx_skill_category ON "Skill"("categoryId");
CREATE INDEX idx_skill_tags ON "Skill" USING GIN("tags");

-- User skills
CREATE INDEX idx_user_skill_user ON "UserSkill"("userId");
CREATE INDEX idx_user_skill_skill ON "UserSkill"("skillId");
CREATE INDEX idx_user_skill_level ON "UserSkill"("level");
CREATE INDEX idx_user_skill_verified ON "UserSkill"("verified");

-- Import tracking
CREATE INDEX idx_import_user ON "SkillImport"("userId");
CREATE INDEX idx_import_status ON "SkillImport"("status");
CREATE INDEX idx_import_source ON "SkillImport"("source");

-- Career goals
CREATE INDEX idx_goal_user ON "CareerGoal"("userId");
CREATE INDEX idx_goal_status ON "CareerGoal"("status");
CREATE INDEX idx_goal_priority ON "CareerGoal"("priority");
```

## Data Relationships

### Entity Relationship Diagram

```
User (1) ←→ (1) Profile
User (1) ←→ (*) UserSkill
User (1) ←→ (*) SkillImport
User (1) ←→ (*) CareerGoal
User (1) ←→ (*) Achievement

Skill (1) ←→ (*) UserSkill
SkillCategory (1) ←→ (*) Skill

SkillImport (*) ←→ (*) Skill (many-to-many)
```

### Key Relationships

1. **User ↔ Profile**: One-to-one relationship
2. **User ↔ UserSkill**: One-to-many relationship
3. **Skill ↔ UserSkill**: One-to-many relationship
4. **SkillCategory ↔ Skill**: One-to-many relationship
5. **User ↔ SkillImport**: One-to-many relationship

## Data Validation

### Prisma Validation Rules

```prisma
model User {
  email String? @unique
  // Email must be unique if provided
}

model Profile {
  yearsExperience Int?
  // Must be between 0 and 50
  @@map("profiles")
}

model UserSkill {
  proficiencyScore Int?
  // Must be between 0 and 100
  level String
  // Must be one of: beginner, intermediate, advanced, expert
}
```

### Application-Level Validation

```typescript
// Example validation in API routes
const validateProfile = (data: any) => {
  if (data.yearsExperience && (data.yearsExperience < 0 || data.yearsExperience > 50)) {
    throw new Error('Years of experience must be between 0 and 50');
  }
  
  if (data.careerStage && !['student', 'entry', 'mid', 'senior', 'lead', 'executive'].includes(data.careerStage)) {
    throw new Error('Invalid career stage');
  }
};
```

## Migration Strategy

### Schema Changes

1. **Add new fields**: Use `ALTER TABLE` with default values
2. **Remove fields**: Create migration to drop columns
3. **Change types**: Create new column, migrate data, drop old column
4. **Add indexes**: Use `CREATE INDEX CONCURRENTLY` for production

### Example Migration

```sql
-- Add new onboarding fields
ALTER TABLE "Profile" ADD COLUMN "targetRole" TEXT;
ALTER TABLE "Profile" ADD COLUMN "careerTimeline" TEXT;
ALTER TABLE "Profile" ADD COLUMN "willingToRelocate" BOOLEAN DEFAULT false;
ALTER TABLE "Profile" ADD COLUMN "preferredLocations" TEXT[] DEFAULT '{}';
ALTER TABLE "Profile" ADD COLUMN "onboardingCompleted" BOOLEAN DEFAULT false;
ALTER TABLE "Profile" ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);
```

## Backup and Recovery

### Backup Strategy

1. **Full backups**: Weekly automated backups
2. **Incremental backups**: Daily differential backups
3. **Point-in-time recovery**: Transaction log backups
4. **Cross-region replication**: For disaster recovery

### Backup Commands

```bash
# Full database backup
pg_dump -h localhost -U username -d smatrx_db > backup.sql

# Restore from backup
psql -h localhost -U username -d smatrx_db < backup.sql

# Schema-only backup
pg_dump -h localhost -U username -d smatrx_db --schema-only > schema.sql
```

## Performance Optimization

### Query Optimization

1. **Use indexes**: On frequently queried columns
2. **Limit results**: Use pagination for large datasets
3. **Select specific fields**: Avoid `SELECT *`
4. **Use joins efficiently**: Prefer explicit joins over subqueries

### Example Optimized Queries

```sql
-- Get user skills with category information
SELECT 
  us.id,
  us.level,
  us.proficiencyScore,
  s.name as skillName,
  sc.name as categoryName
FROM "UserSkill" us
JOIN "Skill" s ON us."skillId" = s.id
JOIN "SkillCategory" sc ON s."categoryId" = sc.id
WHERE us."userId" = $1
ORDER BY us."proficiencyScore" DESC;

-- Get skills by category with counts
SELECT 
  sc.name as category,
  COUNT(us.id) as skillCount,
  AVG(us."proficiencyScore") as avgProficiency
FROM "SkillCategory" sc
LEFT JOIN "Skill" s ON sc.id = s."categoryId"
LEFT JOIN "UserSkill" us ON s.id = us."skillId" AND us."userId" = $1
GROUP BY sc.id, sc.name
ORDER BY skillCount DESC;
```

## Security Considerations

### Data Protection

1. **Encryption**: Sensitive data encrypted at rest
2. **Access control**: Role-based permissions
3. **Audit logging**: Track all data modifications
4. **Data retention**: Automatic cleanup of old data

### Privacy Compliance

1. **GDPR compliance**: Right to deletion, data portability
2. **Data anonymization**: Remove PII from analytics
3. **Consent tracking**: Track user consent for data processing
4. **Data minimization**: Only collect necessary data

## Monitoring and Maintenance

### Database Monitoring

1. **Performance metrics**: Query execution times, connection counts
2. **Storage monitoring**: Disk usage, growth trends
3. **Error tracking**: Failed queries, connection errors
4. **Backup verification**: Ensure backups are successful

### Maintenance Tasks

1. **Index maintenance**: Rebuild fragmented indexes
2. **Statistics updates**: Keep query planner statistics current
3. **Vacuum operations**: Clean up dead tuples
4. **Connection pooling**: Monitor and tune connection limits
