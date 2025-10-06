// Core type definitions for SMATRX V3

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillSource = 'linkedin' | 'github' | 'resume' | 'manual' | 'verified';
export type CareerStage = 'student' | 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  source: SkillSource;
  verified: boolean;
  verifiedAt?: Date;
  endorsements: number;
  yearsOfExperience: number;
  lastUsed?: Date;
  proficiencyScore: number; // 0-100
  marketDemand: MarketDemand;
  relatedSkills: string[];
  projects?: ProjectEvidence[];
  certifications?: Certification[];
}

export interface SkillCategory {
  id: string;
  name: string;
  parent?: string;
  industry: string[];
  trending: boolean;
  averageSalary: SalaryRange;
}

export interface MarketDemand {
  score: number; // 0-100
  trend: 'declining' | 'stable' | 'growing' | 'exploding';
  jobCount: number;
  averageSalary: number;
  topEmployers: string[];
  lastUpdated: Date;
}

export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  skills: UserSkill[];
  goals: CareerGoal[];
  progress: ProgressRecord[];
  achievements: Achievement[];
  connections: Connection[];
  subscription: Subscription;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  headline?: string;
  location?: Location;
  currentRole?: string;
  currentCompany?: string;
  careerStage: CareerStage;
  yearsOfExperience: number;
  education: Education[];
  workHistory: WorkExperience[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface UserSkill extends Skill {
  userId: string;
  addedAt: Date;
  confidence: number; // 0-100
  validated: boolean;
  validationMethod?: ValidationMethod;
  evidence: SkillEvidence[];
}

export interface SkillEvidence {
  type: 'project' | 'certification' | 'endorsement' | 'assessment' | 'work';
  source: string;
  url?: string;
  date: Date;
  details: Record<string, any>;
}

export interface CareerGoal {
  id: string;
  userId: string;
  targetRole: string;
  targetCompany?: string;
  targetSalary?: SalaryRange;
  targetDate: Date;
  motivation: string;
  requiredSkills: RequiredSkill[];
  currentReadiness: number; // 0-100
  estimatedTimeToReady: number; // days
  status: 'active' | 'paused' | 'achieved' | 'abandoned';
}

export interface RequiredSkill {
  skill: Skill;
  importance: 'nice-to-have' | 'important' | 'critical' | 'must-have';
  currentLevel?: SkillLevel;
  targetLevel: SkillLevel;
  gap?: SkillGap;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gapSize: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedLearningTime: number; // hours
  recommendedResources: LearningResource[];
  marketUrgency: number; // 0-100
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'video' | 'article' | 'project' | 'bootcamp' | 'certification';
  provider: string;
  url: string;
  duration: number; // hours
  difficulty: SkillLevel;
  cost: Cost;
  rating: number;
  completionRate: number;
  skills: string[];
  prerequisites: string[];
  outcomes: string[];
}

export interface ProgressRecord {
  id: string;
  userId: string;
  date: Date;
  type: 'skill_added' | 'skill_improved' | 'goal_progress' | 'achievement' | 'milestone';
  details: Record<string, any>;
  impact: ProgressImpact;
}

export interface ProgressImpact {
  readinessChange: number;
  newOpportunities: number;
  salaryImpact?: number;
  confidenceBoost: number;
}

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  earnedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  shareableUrl?: string;
}

export interface CareerMatch {
  role: JobRole;
  company?: Company;
  matchScore: number; // 0-100
  readinessScore: number; // 0-100
  salaryRange: SalaryRange;
  matchedSkills: MatchedSkill[];
  missingSkills: RequiredSkill[];
  estimatedTimeToReady: number; // days
  growthPotential: GrowthPotential;
  applicationTips: string[];
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  industry: string;
  level: CareerStage;
  requiredSkills: RequiredSkill[];
  preferredSkills: RequiredSkill[];
  responsibilities: string[];
  qualifications: string[];
  averageSalary: number;
  demandLevel: MarketDemand;
}

export interface LearningPath {
  id: string;
  userId: string;
  goal: CareerGoal;
  milestones: Milestone[];
  currentMilestone: number;
  totalDuration: number; // hours
  completionRate: number;
  lastActivity: Date;
  effectiveness: number; // 0-100
  adjustments: PathAdjustment[];
}

export interface Milestone {
  id: string;
  order: number;
  title: string;
  description: string;
  skills: string[];
  resources: LearningResource[];
  duration: number; // hours
  deadline?: Date;
  completed: boolean;
  completedAt?: Date;
  feedback?: MilestoneFeedback;
}

// Additional supporting types
export type ValidationMethod = 'quiz' | 'project' | 'peer-review' | 'certification' | 'work-sample';
export type AchievementType = 'skill' | 'learning' | 'career' | 'community' | 'streak';

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
  currency: string;
}

export interface Location {
  city: string;
  state?: string;
  country: string;
  remote: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  skills: string[];
  achievements: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  culture: string[];
  benefits: string[];
  techStack?: string[];
}

export interface GrowthPotential {
  careerProgression: string[];
  salaryGrowth: number; // percentage
  skillDevelopment: string[];
  industryOutlook: 'declining' | 'stable' | 'growing';
}

export interface Cost {
  amount: number;
  currency: string;
  type: 'free' | 'one-time' | 'subscription' | 'pay-per-course';
}

export interface ProjectEvidence {
  name: string;
  url?: string;
  description: string;
  skills: string[];
  impact?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  dateIssued: Date;
  expiryDate?: Date;
  verificationUrl?: string;
}

export interface Connection {
  userId: string;
  connectedUserId: string;
  type: 'mentor' | 'mentee' | 'peer' | 'colleague';
  establishedAt: Date;
  interactionCount: number;
  lastInteraction?: Date;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  startDate: Date;
  endDate?: Date;
  features: string[];
}

export interface PathAdjustment {
  date: Date;
  reason: string;
  changes: string[];
  impact: 'minor' | 'moderate' | 'major';
}

export interface MilestoneFeedback {
  rating: number;
  comments: string;
  suggestions: string[];
}

export interface MatchedSkill {
  skill: Skill;
  requirement: RequiredSkill;
  matchLevel: 'exact' | 'exceeds' | 'partial' | 'transferable';
}
