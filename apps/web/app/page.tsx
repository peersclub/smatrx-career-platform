'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Upload,
  Github,
  Linkedin
} from 'lucide-react';
import { Button } from '@smatrx/ui';
import { Card } from '@smatrx/ui';
import Link from 'next/link';

export default function HomePage() {
  const [importMethod, setImportMethod] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                SMATRX
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/signin">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Your Career,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Transformed
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              AI-powered skill analysis meets real job market data. 
              Know exactly what to learn, when to learn it, and how it impacts your career.
            </p>
            
            {/* Import Options */}
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-sm text-gray-500 mb-4">Start by importing your existing skills</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card 
                  className={`p-6 cursor-pointer transition-all ${
                    importMethod === 'linkedin' ? 'border-purple-500 bg-purple-500/10' : 'hover:border-gray-700'
                  }`}
                  onClick={() => setImportMethod('linkedin')}
                >
                  <Linkedin className="w-8 h-8 mb-2 mx-auto" />
                  <h3 className="font-semibold">LinkedIn</h3>
                  <p className="text-sm text-gray-500">Import from profile</p>
                </Card>
                
                <Card 
                  className={`p-6 cursor-pointer transition-all ${
                    importMethod === 'github' ? 'border-purple-500 bg-purple-500/10' : 'hover:border-gray-700'
                  }`}
                  onClick={() => setImportMethod('github')}
                >
                  <Github className="w-8 h-8 mb-2 mx-auto" />
                  <h3 className="font-semibold">GitHub</h3>
                  <p className="text-sm text-gray-500">Analyze repositories</p>
                </Card>
                
                <Card 
                  className={`p-6 cursor-pointer transition-all ${
                    importMethod === 'resume' ? 'border-purple-500 bg-purple-500/10' : 'hover:border-gray-700'
                  }`}
                  onClick={() => setImportMethod('resume')}
                >
                  <Upload className="w-8 h-8 mb-2 mx-auto" />
                  <h3 className="font-semibold">Resume</h3>
                  <p className="text-sm text-gray-500">Upload PDF/DOC</p>
                </Card>
              </div>
            </div>

            <Link href="/auth/signin">
              <Button size="lg" className="group">
                Start Your Analysis
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="mt-4 text-sm text-gray-500">
              No credit card required • 5 minutes to insights
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Real Results, Not Empty Promises
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <Brain className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Skill Analysis</h3>
                <p className="text-gray-400 mb-4">
                  Our AI analyzes your skills against 50,000+ job postings daily
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Verify skills through GitHub/LinkedIn
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Identify transferable skills
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Spot skill gaps instantly
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <Target className="w-12 h-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Career Matching</h3>
                <p className="text-gray-400 mb-4">
                  See exactly how ready you are for your dream roles
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Match score for 1000+ roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Salary potential calculator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Time-to-ready estimates
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <TrendingUp className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Learning Paths</h3>
                <p className="text-gray-400 mb-4">
                  Personalized roadmaps to close your skill gaps efficiently
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Curated resources (free & paid)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Project-based learning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Progress tracking
                  </li>
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            From Skills to Career in 3 Steps
          </h2>
          
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Import Your Skills</h3>
                </div>
                <p className="text-gray-400">
                  Connect LinkedIn, GitHub, or upload your resume. Our AI extracts and validates 
                  your skills, creating a comprehensive profile in minutes.
                </p>
              </div>
              <div className="flex-1">
                <Card className="p-6 bg-gray-800/50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">JavaScript</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-500">Verified</span>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="w-20 h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">React</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-500">Verified</span>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="w-16 h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Python</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-500">Analyzing...</span>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="w-12 h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-2xl font-semibold">See Your Matches</h3>
                </div>
                <p className="text-gray-400">
                  Instantly see how you match against thousands of real job postings. 
                  Understand exactly where you stand and what's missing.
                </p>
              </div>
              <div className="flex-1">
                <Card className="p-6 bg-gray-800/50">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Senior Frontend Engineer</span>
                        <span className="text-xl font-bold text-green-500">87%</span>
                      </div>
                      <div className="text-sm text-gray-500 mb-1">Missing: TypeScript (Advanced)</div>
                      <div className="text-xs text-gray-600">$120k - $180k • 2 months to ready</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Full Stack Developer</span>
                        <span className="text-xl font-bold text-yellow-500">72%</span>
                      </div>
                      <div className="text-sm text-gray-500 mb-1">Missing: Node.js, MongoDB</div>
                      <div className="text-xs text-gray-600">$100k - $150k • 4 months to ready</div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Follow Your Path</h3>
                </div>
                <p className="text-gray-400">
                  Get a personalized learning path with curated resources, projects, and milestones. 
                  Track your progress and watch your readiness score climb.
                </p>
              </div>
              <div className="flex-1">
                <Card className="p-6 bg-gray-800/50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">Your Learning Path</span>
                      <span className="text-sm text-gray-500">32% Complete</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm line-through text-gray-600">React Fundamentals</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-purple-500 bg-purple-500/20"></div>
                        <span className="text-sm">TypeScript Deep Dive</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                        <span className="text-sm text-gray-600">Build Portfolio Project</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Join 10,000+ Professionals Transforming Their Careers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                87%
              </div>
              <p className="text-gray-400">Get interviews within 3 months</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                42%
              </div>
              <p className="text-gray-400">Average salary increase</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                2.5x
              </div>
              <p className="text-gray-400">Faster skill development</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <p className="text-gray-300 mb-2">
                    "SMATRX showed me I was only 2 skills away from a senior role. 
                    3 months later, I got promoted with a 35% raise."
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Jake Davis</span> • Senior Engineer at Microsoft
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  SP
                </div>
                <div>
                  <p className="text-gray-300 mb-2">
                    "As a bootcamp grad, I didn't know what to learn next. 
                    SMATRX gave me a clear path and I landed my dream job."
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Sarah Park</span> • Frontend Developer at Stripe
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stop Guessing. Start Growing.
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get your personalized career roadmap in 5 minutes
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="group">
              Analyze My Skills Free
              <Sparkles className="ml-2 group-hover:animate-pulse" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                SMATRX
              </span>
              <p className="text-sm text-gray-500 mt-2">
                AI-powered career transformation
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/roadmap" className="hover:text-white">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Career Guides</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2024 SMATRX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
