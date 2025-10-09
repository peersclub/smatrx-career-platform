'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react'

const roadmapItems = [
  {
    quarter: 'Q4 2024',
    status: 'completed',
    items: [
      { title: 'AI-Powered Skill Analysis', description: 'Launch advanced skill extraction and analysis' },
      { title: 'Career Path Planning', description: 'Personalized career recommendations engine' },
      { title: 'Credibility Dashboard', description: 'Multi-factor professional credibility scoring' },
      { title: 'GitHub Integration', description: 'Analyze code contributions and technical skills' },
      { title: 'LinkedIn Integration', description: 'Import professional experience seamlessly' }
    ]
  },
  {
    quarter: 'Q1 2025',
    status: 'in-progress',
    items: [
      { title: 'Learning Path Recommendations', description: 'AI-curated learning resources based on skill gaps' },
      { title: 'Skills Marketplace', description: 'Connect with opportunities matching your skills' },
      { title: 'Mobile App (iOS & Android)', description: 'Track your career progress on the go' },
      { title: 'Team Dashboards', description: 'Manage team skills and growth for organizations' },
      { title: 'Advanced Analytics', description: 'Deep insights into market trends and salary data' }
    ]
  },
  {
    quarter: 'Q2 2025',
    status: 'planned',
    items: [
      { title: 'Peer Skill Verification', description: 'Community-driven skill endorsements' },
      { title: 'Live Mentorship', description: 'Connect with industry experts for 1-on-1 guidance' },
      { title: 'Certification Tracking', description: 'Manage and showcase your certifications' },
      { title: 'Interview Preparation', description: 'AI-powered interview practice and feedback' },
      { title: 'Salary Negotiation Tools', description: 'Data-driven salary insights and negotiation tips' }
    ]
  },
  {
    quarter: 'Q3 2025',
    status: 'planned',
    items: [
      { title: 'Company Culture Insights', description: 'Research companies based on values and culture' },
      { title: 'Resume Builder', description: 'AI-optimized resume creation and formatting' },
      { title: 'Portfolio Showcase', description: 'Create and share your professional portfolio' },
      { title: 'Job Application Tracker', description: 'Manage your job search in one place' },
      { title: 'Networking Events', description: 'Virtual and in-person networking opportunities' }
    ]
  }
]

const statusConfig = {
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-white',
    bg: 'bg-gray-800',
    border: 'border-gray-700'
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    color: 'text-purple-400',
    bg: 'bg-purple-900/20',
    border: 'border-purple-500'
  },
  planned: {
    label: 'Planned',
    icon: Circle,
    color: 'text-gray-400',
    bg: 'bg-gray-800/30',
    border: 'border-gray-700'
  }
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <PublicHeader />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Product
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Roadmap
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what we're building to help you advance your career. We're constantly evolving based on your feedback.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-12">
            {roadmapItems.map((quarter, quarterIndex) => {
              const config = statusConfig[quarter.status as keyof typeof statusConfig]
              const StatusIcon = config.icon
              
              return (
                <motion.div
                  key={quarter.quarter}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: quarterIndex * 0.2 }}
                  className="relative"
                >
                  {/* Timeline connector */}
                  {quarterIndex < roadmapItems.length - 1 && (
                    <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gray-700" />
                  )}

                  {/* Quarter Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center relative z-10`}>
                      <StatusIcon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{quarter.quarter}</h2>
                      <span className={`text-sm ${config.color}`}>{config.label}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="ml-16 space-y-4">
                    {quarter.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: quarterIndex * 0.2 + itemIndex * 0.1 }}
                        className={`bg-gray-800/30 border ${config.border} rounded-lg p-4 hover:border-purple-500/50 transition-all`}
                      >
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Feedback CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-12"
          >
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Have a Feature Request?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              We're building Credably for you. Share your ideas and help shape our roadmap.
            </p>
            <Link 
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

