'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  Award, 
  BookOpen,
  Compass,
  BarChart3,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Skill Analysis',
    description: 'Advanced AI analyzes your skills, experience, and goals to provide personalized career insights.',
    benefits: [
      'Automated skill extraction from resume',
      'GitHub and LinkedIn integration',
      'Real-time skill gap analysis',
      'Industry-specific recommendations'
    ]
  },
  {
    icon: Compass,
    title: 'Career Path Planning',
    description: 'Get a clear roadmap to your dream role with personalized career recommendations.',
    benefits: [
      'Role-specific career paths',
      'Salary progression insights',
      'Time-to-ready estimates',
      'Market demand analysis'
    ]
  },
  {
    icon: Shield,
    title: 'Credibility Score',
    description: 'Build and showcase your professional credibility with our comprehensive scoring system.',
    benefits: [
      'Multi-factor credibility assessment',
      'Expert verification badges',
      'Progress tracking',
      'Shareable credibility profile'
    ]
  },
  {
    icon: BookOpen,
    title: 'Personalized Learning',
    description: 'Access curated learning paths tailored to your career goals and skill gaps.',
    benefits: [
      'Custom learning roadmaps',
      'Resource recommendations',
      'Progress tracking',
      'Certification guidance'
    ]
  },
  {
    icon: BarChart3,
    title: 'Skills Analytics',
    description: 'Deep insights into your skill portfolio with market trends and demand analysis.',
    benefits: [
      'Skill proficiency tracking',
      'Market demand insights',
      'Competitive benchmarking',
      'Growth recommendations'
    ]
  },
  {
    icon: Target,
    title: 'Goal Management',
    description: 'Set, track, and achieve your career goals with our intelligent goal management system.',
    benefits: [
      'SMART goal framework',
      'Progress milestones',
      'Actionable next steps',
      'Achievement tracking'
    ]
  }
]

const integrations = [
  { name: 'GitHub', description: 'Analyze code contributions and technical skills' },
  { name: 'LinkedIn', description: 'Import professional experience and connections' },
  { name: 'Resume Upload', description: 'Extract skills from your resume automatically' },
  { name: 'OpenAI', description: 'Powered by advanced AI for personalized insights' }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <PublicHeader />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Advance Your Career
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to help you understand your skills, plan your career path, 
              and achieve your professional goals.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>

          {/* Integrations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 mb-20"
          >
            <h2 className="text-3xl font-bold mb-4 text-center">
              Seamless Integrations
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Connect your existing tools and platforms to get the most accurate career insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
                >
                  <h4 className="font-semibold mb-2">{integration.name}</h4>
                  <p className="text-sm text-gray-400">{integration.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who are advancing their careers with Credably.
            </p>
            <Link 
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

