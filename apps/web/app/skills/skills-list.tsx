'use client';

import { Card } from '@smatrx/ui';
import { Badge } from '@smatrx/ui';
import { CheckCircle, TrendingUp, Calendar, Award } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';
import { MdVerified } from 'react-icons/md';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  yearsExperience: number;
  source: string;
  verified: boolean;
  proficiencyScore: number;
  lastUsed: Date | null;
}

interface SkillsListProps {
  skills: Skill[];
}

export default function SkillsList({ skills }: SkillsListProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'advanced':
        return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      case 'intermediate':
        return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'github':
        return <FaGithub className="w-4 h-4" />;
      case 'linkedin':
        return <FaLinkedin className="w-4 h-4" />;
      case 'resume':
        return <HiDocumentText className="w-4 h-4" />;
      case 'verified':
        return <MdVerified className="w-4 h-4" />;
      default:
        return <HiDocumentText className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'github':
        return 'bg-purple-900/30 border-purple-700 text-purple-400';
      case 'linkedin':
        return 'bg-blue-900/30 border-blue-700 text-blue-400';
      case 'resume':
        return 'bg-cyan-900/30 border-cyan-700 text-cyan-400';
      case 'verified':
        return 'bg-green-900/30 border-green-700 text-green-400';
      default:
        return 'bg-gray-900/30 border-gray-700 text-gray-400';
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (skills.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Award className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold mb-2">No Skills Yet</h3>
        <p className="text-gray-500">
          Import your skills from GitHub, LinkedIn, or upload your resume to get started.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Skills</h2>
        <div className="text-sm text-gray-500">
          {skills.length} skills • {skills.filter(s => s.verified).length} verified
        </div>
      </div>

      {/* Skills Summary by Source */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-purple-900/20 border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaGithub className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-purple-400">GitHub</p>
                <p className="text-xl font-semibold">{skills.filter(s => s.source === 'github').length}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-900/20 border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaLinkedin className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-blue-400">LinkedIn</p>
                <p className="text-xl font-semibold">{skills.filter(s => s.source === 'linkedin').length}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-cyan-900/20 border-cyan-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiDocumentText className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-cyan-400">Resume</p>
                <p className="text-xl font-semibold">{skills.filter(s => s.source === 'resume').length}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-green-900/20 border-green-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MdVerified className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-green-400">Verified</p>
                <p className="text-xl font-semibold">{skills.filter(s => s.verified).length}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <Card key={category} className="p-6">
          <h3 className="font-semibold mb-4 text-purple-400">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-start justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{skill.name}</h4>
                        {skill.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${getSourceColor(skill.source)}`}>
                          {getSourceIcon(skill.source)}
                          <span className="text-xs capitalize">{skill.source}</span>
                        </div>
                      </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {skill.yearsExperience}y exp
                    </span>
                    {skill.lastUsed && (
                      <span>
                        Last used {new Date(skill.lastUsed).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">{skill.proficiencyScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(skill.proficiencyScore / 100) * 176} 176`}
                        className="text-purple-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold">{skill.proficiencyScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
