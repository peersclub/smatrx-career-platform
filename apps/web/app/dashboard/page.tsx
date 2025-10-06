import { auth } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { 
  User, 
  Target, 
  TrendingUp, 
  BookOpen, 
  BarChart3,
  Brain,
  Upload,
  Github,
  Linkedin,
  FileText
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                SMATRX
              </span>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-white">Dashboard</a>
                <a href="/skills" className="text-gray-400 hover:text-white">Skills</a>
                <a href="/goals" className="text-gray-400 hover:text-white">Goals</a>
                <a href="/learning" className="text-gray-400 hover:text-white">Learning</a>
                <a href="/progress" className="text-gray-400 hover:text-white">Progress</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a href="/profile" className="text-sm text-gray-400 hover:text-white">
                {session.user.name || session.user.email}
              </a>
              {session.user.image && (
                <a href="/profile">
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="w-8 h-8 rounded-full hover:ring-2 hover:ring-purple-500"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-gray-400">
            Let's continue building your career path to success.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 hover:border-purple-500 transition-colors cursor-pointer">
              <Github className="w-8 h-8 mb-2 text-purple-500" />
              <h3 className="font-semibold mb-1">Import from GitHub</h3>
              <p className="text-sm text-gray-500">Analyze your repositories</p>
            </Card>
            
            <Card className="p-6 hover:border-pink-500 transition-colors cursor-pointer">
              <Linkedin className="w-8 h-8 mb-2 text-pink-500" />
              <h3 className="font-semibold mb-1">Import from LinkedIn</h3>
              <p className="text-sm text-gray-500">Sync your profile</p>
            </Card>
            
            <Card className="p-6 hover:border-cyan-500 transition-colors cursor-pointer">
              <FileText className="w-8 h-8 mb-2 text-cyan-500" />
              <h3 className="font-semibold mb-1">Upload Resume</h3>
              <p className="text-sm text-gray-500">Extract skills from CV</p>
            </Card>
            
            <Card className="p-6 hover:border-green-500 transition-colors cursor-pointer">
              <Target className="w-8 h-8 mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">Set Career Goal</h3>
              <p className="text-sm text-gray-500">Define your target role</p>
            </Card>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-gray-500">Skills</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">Total skills tracked</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-pink-500" />
              <span className="text-xs text-gray-500">Goals</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">Active career goals</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <span className="text-xs text-gray-500">Progress</span>
            </div>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-sm text-gray-500">Average completion</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              <span className="text-xs text-gray-500">Learning</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">Hours this week</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Skill Analysis
            </h2>
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No skills imported yet</p>
              <p className="text-sm mt-2">Import your skills to see analysis</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Career Matches
            </h2>
            <div className="text-center py-12 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No career goals set</p>
              <p className="text-sm mt-2">Set a goal to see matching roles</p>
            </div>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="mt-8 p-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-800">
          <h2 className="text-2xl font-semibold mb-4">🚀 Getting Started</h2>
          <p className="text-gray-300 mb-6">
            Complete these steps to unlock the full power of SMATRX:
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
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-sm font-bold">
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
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-sm font-bold">
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
      </main>
    </div>
  );
}
