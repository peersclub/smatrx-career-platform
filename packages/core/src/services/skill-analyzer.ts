import { 
  Skill, 
  UserSkill, 
  SkillGap, 
  CareerGoal, 
  CareerMatch,
  RequiredSkill,
  SkillLevel,
  MarketDemand,
  MatchedSkill
} from '../types';

export class SkillAnalyzer {
  /**
   * Analyzes user skills against market demand and career goals
   */
  async analyzeSkills(
    userSkills: UserSkill[],
    careerGoals: CareerGoal[],
    marketData: MarketDemand[]
  ): Promise<SkillAnalysis> {
    const skillProfile = this.createSkillProfile(userSkills);
    const marketAlignment = this.calculateMarketAlignment(userSkills, marketData);
    const careerReadiness = await this.assessCareerReadiness(userSkills, careerGoals);
    const gaps = this.identifySkillGaps(userSkills, careerGoals);
    const recommendations = this.generateRecommendations(gaps, marketData);

    return {
      profile: skillProfile,
      marketAlignment,
      careerReadiness,
      gaps,
      recommendations,
      insights: this.generateInsights(skillProfile, marketAlignment, gaps)
    };
  }

  private createSkillProfile(skills: UserSkill[]): SkillProfile {
    const categories = this.categorizeSkills(skills);
    const strengths = this.identifyStrengths(skills);
    const weaknesses = this.identifyWeaknesses(skills);
    const verifiedCount = skills.filter(s => s.verified).length;

    return {
      totalSkills: skills.length,
      verifiedSkills: verifiedCount,
      verificationRate: (verifiedCount / skills.length) * 100,
      averageProficiency: this.calculateAverageProficiency(skills),
      topSkills: this.getTopSkills(skills, 5),
      skillsByCategory: categories,
      strengths,
      weaknesses,
      uniqueSkills: this.identifyUniqueSkills(skills),
      overallLevel: this.calculateOverallLevel(skills)
    };
  }

  private calculateMarketAlignment(
    skills: UserSkill[], 
    marketData: MarketDemand[]
  ): MarketAlignment {
    const inDemandSkills = skills.filter(skill => {
      const demand = marketData.find(m => m.score > 70);
      return demand && skill.marketDemand.score > 70;
    });

    const trendingSkills = skills.filter(skill => 
      skill.marketDemand.trend === 'growing' || 
      skill.marketDemand.trend === 'exploding'
    );

    const outdatedSkills = skills.filter(skill => 
      skill.marketDemand.trend === 'declining'
    );

    return {
      alignmentScore: this.calculateAlignmentScore(skills, marketData),
      inDemandSkills,
      trendingSkills,
      outdatedSkills,
      marketOpportunities: this.findMarketOpportunities(skills, marketData),
      salaryPotential: this.calculateSalaryPotential(skills)
    };
  }

  private async assessCareerReadiness(
    skills: UserSkill[],
    goals: CareerGoal[]
  ): Promise<CareerReadiness[]> {
    return Promise.all(goals.map(async goal => {
      const requiredSkills = goal.requiredSkills;
      const matchedSkills = this.matchSkills(skills, requiredSkills);
      const readinessScore = this.calculateReadinessScore(matchedSkills, requiredSkills);
      const timeToReady = this.estimateTimeToReady(skills, requiredSkills);

      return {
        goal,
        readinessScore,
        matchedSkills,
        missingSkills: this.identifyMissingSkills(skills, requiredSkills),
        timeToReady,
        nextSteps: this.generateNextSteps(skills, requiredSkills),
        confidenceLevel: this.calculateConfidence(readinessScore)
      };
    }));
  }

  private identifySkillGaps(
    userSkills: UserSkill[],
    goals: CareerGoal[]
  ): SkillGap[] {
    const allRequiredSkills = goals.flatMap(g => g.requiredSkills);
    const gaps: SkillGap[] = [];

    allRequiredSkills.forEach(required => {
      const userSkill = userSkills.find(s => s.name === required.skill.name);
      
      if (!userSkill || this.getSkillLevelScore(userSkill.level) < this.getSkillLevelScore(required.targetLevel)) {
        gaps.push({
          skill: required.skill.name,
          currentLevel: userSkill ? this.getSkillLevelScore(userSkill.level) : 0,
          requiredLevel: this.getSkillLevelScore(required.targetLevel),
          gapSize: this.calculateGapSize(userSkill?.level, required.targetLevel),
          priority: this.calculatePriority(required.importance, required.skill.marketDemand),
          estimatedLearningTime: this.estimateLearningTime(userSkill?.level, required.targetLevel),
          recommendedResources: [], // Will be populated by recommendation engine
          marketUrgency: required.skill.marketDemand.score
        });
      }
    });

    return this.prioritizeGaps(gaps);
  }

  private generateRecommendations(
    gaps: SkillGap[],
    marketData: MarketDemand[]
  ): SkillRecommendation[] {
    return gaps.map(gap => {
      const learningPath = this.createLearningPath(gap);
      const alternativeSkills = this.findAlternativeSkills(gap.skill, marketData);
      const quickWins = this.identifyQuickWins(gap);

      return {
        gap,
        learningPath,
        alternativeSkills,
        quickWins,
        estimatedROI: this.calculateSkillROI(gap, marketData),
        priority: gap.priority,
        timeInvestment: gap.estimatedLearningTime
      };
    });
  }

  private generateInsights(
    profile: SkillProfile,
    alignment: MarketAlignment,
    gaps: SkillGap[]
  ): SkillInsight[] {
    const insights: SkillInsight[] = [];

    // Strength insights
    if (profile.strengths.length > 0) {
      insights.push({
        type: 'strength',
        title: 'Your Superpowers',
        description: `You excel in ${profile.strengths.slice(0, 3).join(', ')}. These skills put you in the top 20% of professionals.`,
        actionable: true,
        actions: ['Leverage these in job applications', 'Mentor others in these areas']
      });
    }

    // Market alignment insights
    if (alignment.alignmentScore > 80) {
      insights.push({
        type: 'opportunity',
        title: 'Market-Ready Skills',
        description: `Your skills are highly aligned with market demand. You're ready for ${alignment.marketOpportunities.length} new opportunities.`,
        actionable: true,
        actions: ['Apply to matching roles', 'Negotiate higher salary']
      });
    }

    // Gap insights
    const criticalGaps = gaps.filter(g => g.priority === 'critical');
    if (criticalGaps.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Critical Skills Missing',
        description: `You're missing ${criticalGaps.length} critical skills for your career goals. Focus on these first.`,
        actionable: true,
        actions: criticalGaps.map(g => `Learn ${g.skill} (${g.estimatedLearningTime}h)`)
      });
    }

    return insights;
  }

  // Helper methods
  private getSkillLevelScore(level?: SkillLevel): number {
    const scores = {
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 100
    };
    return level ? scores[level] : 0;
  }

  private calculateGapSize(current?: SkillLevel, target?: SkillLevel): number {
    const currentScore = this.getSkillLevelScore(current);
    const targetScore = this.getSkillLevelScore(target);
    return targetScore - currentScore;
  }

  private calculatePriority(
    importance: RequiredSkill['importance'],
    marketDemand: MarketDemand
  ): SkillGap['priority'] {
    const importanceScore = {
      'nice-to-have': 1,
      'important': 2,
      'critical': 3,
      'must-have': 4
    }[importance];

    const demandScore = marketDemand.score / 25; // 0-4 range

    const totalScore = importanceScore + demandScore;

    if (totalScore >= 7) return 'critical';
    if (totalScore >= 5) return 'high';
    if (totalScore >= 3) return 'medium';
    return 'low';
  }

  private estimateLearningTime(current?: SkillLevel, target?: SkillLevel): number {
    const gapSize = this.calculateGapSize(current, target);
    // Rough estimate: 40 hours per 25-point gap
    return Math.ceil(gapSize / 25) * 40;
  }

  private categorizeSkills(skills: UserSkill[]): Record<string, UserSkill[]> {
    return skills.reduce((acc, skill) => {
      const category = skill.category.name;
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, UserSkill[]>);
  }

  private identifyStrengths(skills: UserSkill[]): string[] {
    return skills
      .filter(s => s.proficiencyScore >= 80 && s.verified)
      .sort((a, b) => b.proficiencyScore - a.proficiencyScore)
      .slice(0, 5)
      .map(s => s.name);
  }

  private identifyWeaknesses(skills: UserSkill[]): string[] {
    return skills
      .filter(s => s.proficiencyScore < 50)
      .sort((a, b) => a.proficiencyScore - b.proficiencyScore)
      .slice(0, 5)
      .map(s => s.name);
  }

  private calculateAverageProficiency(skills: UserSkill[]): number {
    if (skills.length === 0) return 0;
    const total = skills.reduce((sum, skill) => sum + skill.proficiencyScore, 0);
    return Math.round(total / skills.length);
  }

  private getTopSkills(skills: UserSkill[], count: number): UserSkill[] {
    return skills
      .sort((a, b) => b.proficiencyScore - a.proficiencyScore)
      .slice(0, count);
  }

  private identifyUniqueSkills(skills: UserSkill[]): string[] {
    // In real implementation, would compare against market averages
    return skills
      .filter(s => s.marketDemand.score < 30 && s.proficiencyScore > 70)
      .map(s => s.name);
  }

  private calculateOverallLevel(skills: UserSkill[]): SkillLevel {
    const avgProficiency = this.calculateAverageProficiency(skills);
    if (avgProficiency >= 75) return 'expert';
    if (avgProficiency >= 50) return 'advanced';
    if (avgProficiency >= 25) return 'intermediate';
    return 'beginner';
  }

  private calculateAlignmentScore(skills: UserSkill[], marketData: MarketDemand[]): number {
    // Complex calculation based on skill demand, trends, and user proficiency
    let score = 0;
    let weight = 0;

    skills.forEach(skill => {
      const demand = skill.marketDemand;
      const skillWeight = demand.score / 100;
      const trendMultiplier = {
        'declining': 0.5,
        'stable': 1,
        'growing': 1.5,
        'exploding': 2
      }[demand.trend];

      score += skill.proficiencyScore * skillWeight * trendMultiplier;
      weight += skillWeight;
    });

    return weight > 0 ? Math.round(score / weight) : 0;
  }

  private findMarketOpportunities(
    skills: UserSkill[],
    marketData: MarketDemand[]
  ): MarketOpportunity[] {
    // Find high-demand skills user doesn't have
    const userSkillNames = new Set(skills.map(s => s.name));
    
    return marketData
      .filter(demand => 
        demand.score > 80 && 
        demand.trend !== 'declining' &&
        !userSkillNames.has(demand.score.toString()) // Simplified, would map to skill name
      )
      .map(demand => ({
        skill: demand.score.toString(), // Simplified
        demandScore: demand.score,
        averageSalary: demand.averageSalary,
        jobCount: demand.jobCount,
        difficulty: 'intermediate' as SkillLevel,
        timeToLearn: 120 // hours
      }))
      .slice(0, 10);
  }

  private calculateSalaryPotential(skills: UserSkill[]): SalaryPotential {
    const currentSalary = skills.reduce((sum, skill) => 
      sum + (skill.marketDemand.averageSalary * skill.proficiencyScore / 100), 0
    ) / skills.length;

    const potentialSalary = skills.reduce((sum, skill) => 
      sum + skill.marketDemand.averageSalary, 0
    ) / skills.length;

    return {
      current: Math.round(currentSalary),
      potential: Math.round(potentialSalary),
      increase: Math.round(potentialSalary - currentSalary),
      percentageIncrease: Math.round((potentialSalary - currentSalary) / currentSalary * 100)
    };
  }

  private matchSkills(
    userSkills: UserSkill[],
    requiredSkills: RequiredSkill[]
  ): MatchedSkill[] {
    return requiredSkills
      .map(required => {
        const userSkill = userSkills.find(s => s.name === required.skill.name);
        if (!userSkill) return null;

        const userLevel = this.getSkillLevelScore(userSkill.level);
        const requiredLevel = this.getSkillLevelScore(required.targetLevel);

        let matchLevel: MatchedSkill['matchLevel'];
        if (userLevel >= requiredLevel) {
          matchLevel = userLevel > requiredLevel ? 'exceeds' : 'exact';
        } else if (userLevel >= requiredLevel * 0.7) {
          matchLevel = 'partial';
        } else {
          matchLevel = 'transferable';
        }

        return {
          skill: userSkill,
          requirement: required,
          matchLevel
        };
      })
      .filter(Boolean) as MatchedSkill[];
  }

  private calculateReadinessScore(
    matched: MatchedSkill[],
    required: RequiredSkill[]
  ): number {
    if (required.length === 0) return 100;

    let score = 0;
    let weight = 0;

    required.forEach(req => {
      const match = matched.find(m => m.requirement.skill.name === req.skill.name);
      const importance = {
        'nice-to-have': 0.5,
        'important': 1,
        'critical': 2,
        'must-have': 3
      }[req.importance];

      if (match) {
        const matchScore = {
          'exceeds': 1.2,
          'exact': 1,
          'partial': 0.7,
          'transferable': 0.3
        }[match.matchLevel];

        score += matchScore * importance;
      }
      
      weight += importance;
    });

    return Math.round((score / weight) * 100);
  }

  private identifyMissingSkills(
    userSkills: UserSkill[],
    required: RequiredSkill[]
  ): RequiredSkill[] {
    const userSkillNames = new Set(userSkills.map(s => s.name));
    return required.filter(req => !userSkillNames.has(req.skill.name));
  }

  private estimateTimeToReady(
    userSkills: UserSkill[],
    required: RequiredSkill[]
  ): number {
    const gaps = this.identifySkillGaps(userSkills, [{ requiredSkills: required } as CareerGoal]);
    return gaps.reduce((total, gap) => total + gap.estimatedLearningTime, 0);
  }

  private generateNextSteps(
    userSkills: UserSkill[],
    required: RequiredSkill[]
  ): string[] {
    const missing = this.identifyMissingSkills(userSkills, required);
    const critical = missing.filter(s => s.importance === 'must-have' || s.importance === 'critical');
    
    const steps: string[] = [];
    
    if (critical.length > 0) {
      steps.push(`Focus on ${critical[0].skill.name} - it's critical for this role`);
    }
    
    const needsImprovement = required.filter(req => {
      const userSkill = userSkills.find(s => s.name === req.skill.name);
      return userSkill && this.getSkillLevelScore(userSkill.level) < this.getSkillLevelScore(req.targetLevel);
    });
    
    if (needsImprovement.length > 0) {
      steps.push(`Improve ${needsImprovement[0].skill.name} from ${needsImprovement[0].currentLevel} to ${needsImprovement[0].targetLevel}`);
    }
    
    return steps.slice(0, 3);
  }

  private calculateConfidence(readinessScore: number): 'low' | 'medium' | 'high' {
    if (readinessScore >= 80) return 'high';
    if (readinessScore >= 60) return 'medium';
    return 'low';
  }

  private prioritizeGaps(gaps: SkillGap[]): SkillGap[] {
    return gaps.sort((a, b) => {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by market urgency
      return b.marketUrgency - a.marketUrgency;
    });
  }

  private createLearningPath(gap: SkillGap): LearningPathSuggestion {
    // Simplified version - would integrate with learning resource database
    return {
      skill: gap.skill,
      steps: [
        { order: 1, type: 'course', duration: gap.estimatedLearningTime * 0.4 },
        { order: 2, type: 'project', duration: gap.estimatedLearningTime * 0.3 },
        { order: 3, type: 'practice', duration: gap.estimatedLearningTime * 0.3 }
      ],
      totalDuration: gap.estimatedLearningTime,
      difficulty: this.getSkillDifficulty(gap.gapSize)
    };
  }

  private findAlternativeSkills(
    skill: string,
    marketData: MarketDemand[]
  ): AlternativeSkill[] {
    // Would use AI to find related/alternative skills
    return [];
  }

  private identifyQuickWins(gap: SkillGap): QuickWin[] {
    const wins: QuickWin[] = [];
    
    if (gap.gapSize <= 25) {
      wins.push({
        action: 'Complete a crash course',
        timeRequired: 8,
        impact: 'medium'
      });
    }
    
    if (gap.currentLevel > 0) {
      wins.push({
        action: 'Build a showcase project',
        timeRequired: 20,
        impact: 'high'
      });
    }
    
    return wins;
  }

  private calculateSkillROI(gap: SkillGap, marketData: MarketDemand[]): number {
    const salaryIncrease = gap.marketUrgency * 1000; // Simplified
    const timeInvestment = gap.estimatedLearningTime;
    const hourlyROI = salaryIncrease / timeInvestment;
    
    return Math.round(hourlyROI);
  }

  private getSkillDifficulty(gapSize: number): SkillLevel {
    if (gapSize <= 25) return 'beginner';
    if (gapSize <= 50) return 'intermediate';
    if (gapSize <= 75) return 'advanced';
    return 'expert';
  }
}

// Supporting interfaces for the analyzer
interface SkillAnalysis {
  profile: SkillProfile;
  marketAlignment: MarketAlignment;
  careerReadiness: CareerReadiness[];
  gaps: SkillGap[];
  recommendations: SkillRecommendation[];
  insights: SkillInsight[];
}

interface SkillProfile {
  totalSkills: number;
  verifiedSkills: number;
  verificationRate: number;
  averageProficiency: number;
  topSkills: UserSkill[];
  skillsByCategory: Record<string, UserSkill[]>;
  strengths: string[];
  weaknesses: string[];
  uniqueSkills: string[];
  overallLevel: SkillLevel;
}

interface MarketAlignment {
  alignmentScore: number;
  inDemandSkills: UserSkill[];
  trendingSkills: UserSkill[];
  outdatedSkills: UserSkill[];
  marketOpportunities: MarketOpportunity[];
  salaryPotential: SalaryPotential;
}

interface CareerReadiness {
  goal: CareerGoal;
  readinessScore: number;
  matchedSkills: MatchedSkill[];
  missingSkills: RequiredSkill[];
  timeToReady: number;
  nextSteps: string[];
  confidenceLevel: 'low' | 'medium' | 'high';
}

interface SkillRecommendation {
  gap: SkillGap;
  learningPath: LearningPathSuggestion;
  alternativeSkills: AlternativeSkill[];
  quickWins: QuickWin[];
  estimatedROI: number;
  priority: SkillGap['priority'];
  timeInvestment: number;
}

interface SkillInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'warning';
  title: string;
  description: string;
  actionable: boolean;
  actions: string[];
}

interface MarketOpportunity {
  skill: string;
  demandScore: number;
  averageSalary: number;
  jobCount: number;
  difficulty: SkillLevel;
  timeToLearn: number;
}

interface SalaryPotential {
  current: number;
  potential: number;
  increase: number;
  percentageIncrease: number;
}

interface LearningPathSuggestion {
  skill: string;
  steps: LearningStep[];
  totalDuration: number;
  difficulty: SkillLevel;
}

interface LearningStep {
  order: number;
  type: 'course' | 'project' | 'practice' | 'certification';
  duration: number;
}

interface AlternativeSkill {
  name: string;
  similarity: number;
  marketDemand: number;
  learningDifficulty: SkillLevel;
}

interface QuickWin {
  action: string;
  timeRequired: number;
  impact: 'low' | 'medium' | 'high';
}
