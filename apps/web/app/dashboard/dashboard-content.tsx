'use client'

import { Card } from '@smatrx/ui'
import { 
  Brain,
  Target,
  TrendingUp,
  BookOpen,
  BarChart3,
  Github,
  Linkedin,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  skills: { total: number; recent: any[] }
  goals: { total: number; active: any[] }
  progress: { percentage: number }
  learning: { hoursThisWeek: number }
  hasGitHub: boolean
  hasLinkedIn: boolean
  hasResume: boolean
}

interface DashboardContentProps {
  userName: string
  data: DashboardData
}

export default function DashboardContent({ userName, data }: DashboardContentProps) {
  const hasAnyData = data.skills.total > 0 || data.goals.total > 0

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-400">
          Let's continue building your career path to success.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Link href="/skills/import" className="h-full">
            <Card className={`p-6 h-full hover:border-purple-500 transition-colors cursor-pointer flex flex-col ${data.hasGitHub ? 'opacity-50' : ''}`}>
              <Github className="w-8 h-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-1">
                Import from GitHub
              </h3>
              <p className="text-sm text-gray-400">
                Analyze your repositories
              </p>
            </Card>
          </Link>
          
          <Link href="/skills/import" className="h-full">
            <Card className={`p-6 h-full hover:border-purple-500 transition-colors cursor-pointer flex flex-col ${data.hasLinkedIn ? 'opacity-50' : ''}`}>
              <Linkedin className="w-8 h-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-1">
                Import from LinkedIn
              </h3>
              <p className="text-sm text-gray-400">
                Sync your profile
              </p>
            </Card>
          </Link>
          
          <Link href="/resume/upload" className="h-full">
            <Card className={`p-6 h-full hover:border-purple-500 transition-colors cursor-pointer flex flex-col ${data.hasResume ? 'opacity-50' : ''}`}>
              <FileText className="w-8 h-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-1">
                Upload Resume
              </h3>
              <p className="text-sm text-gray-400">
                Extract skills from CV
              </p>
            </Card>
          </Link>
          
          <Link href="/dashboard/career-planner?section=learning" className="h-full">
            <Card className="p-6 h-full hover:border-purple-500 transition-colors cursor-pointer flex flex-col bg-purple-900/20 border-purple-800">
              <Sparkles className="w-8 h-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-1">AI Course Finder</h3>
              <p className="text-sm text-gray-400">Get personalized recommendations</p>
            </Card>
          </Link>
          
          <Link href="/dashboard/career-planner" className="h-full">
            <Card className="p-6 h-full hover:border-purple-500 transition-colors cursor-pointer flex flex-col">
              <Target className="w-8 h-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-1">Career Planner</h3>
              <p className="text-sm text-gray-400">Plan your career path</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-500">Skills</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.skills.total}</div>
          <p className="text-sm text-gray-400">Total skills tracked</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-500">Goals</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.goals.total}</div>
          <p className="text-sm text-gray-400">Active career goals</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-500">Progress</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.progress.percentage}%</div>
          <p className="text-sm text-gray-400">Career readiness</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-500">Learning</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.learning.hoursThisWeek}</div>
          <p className="text-sm text-gray-400">Hours this week</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-white" />
            Skill Analysis
          </h2>
          {data.skills.total > 0 ? (
            <div>
              <div className="space-y-3">
                {data.skills.recent.slice(0, 5).map((skill: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-300">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500" 
                          style={{ width: `${skill.proficiency || 50}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-12 text-right">
                        {skill.proficiency || 50}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/skills" className="mt-4 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm">
                View all skills
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No skills imported yet</p>
              <p className="text-sm mt-2">Import your skills to see analysis</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-white" />
            Career Goals
          </h2>
          {data.goals.total > 0 ? (
            <div>
              <div className="space-y-4">
                {data.goals.active.slice(0, 3).map((goal: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="font-semibold text-white mb-1">{goal.title}</div>
                    <div className="text-xs text-gray-400">{goal.timeline}</div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/career-planner" className="mt-4 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm">
                View career planner
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No career goals set</p>
              <p className="text-sm mt-2">Set a goal to see matching roles</p>
            </div>
          )}
        </Card>
      </div>

      {/* Getting Started */}
      {!hasAnyData && (
        <Card className="mt-8 p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
          <h2 className="text-2xl font-semibold mb-4">🚀 Getting Started</h2>
          <p className="text-gray-300 mb-6">
            Complete these steps to unlock the full power of Credably:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="font-semibold">Import Your Skills</h3>
              </div>
              <p className="text-sm text-gray-400 ml-11">
                Connect GitHub, LinkedIn, or upload your resume
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h3 className="font-semibold">Set Career Goals</h3>
              </div>
              <p className="text-sm text-gray-400 ml-11">
                Define your target roles and timeline
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h3 className="font-semibold">Start Learning</h3>
              </div>
              <p className="text-sm text-gray-400 ml-11">
                Follow personalized paths to close skill gaps
              </p>
            </div>
          </div>
        </Card>
      )}
    </main>
  )
}

