'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { Compass, BookOpen, TrendingUp, Users, Briefcase, GraduationCap, Target, Zap } from 'lucide-react'

const guides = [
  {
    icon: Compass,
    title: 'Career Path Planning',
    description: 'Step-by-step guide to mapping out your career journey',
    topics: ['Goal setting', 'Role research', 'Timeline planning', 'Skill requirements']
  },
  {
    icon: TrendingUp,
    title: 'Skill Development',
    description: 'How to identify and develop in-demand skills',
    topics: ['Skill gap analysis', 'Learning resources', 'Practice strategies', 'Certification paths']
  },
  {
    icon: Briefcase,
    title: 'Job Search Strategy',
    description: 'Modern techniques for finding your next opportunity',
    topics: ['Resume optimization', 'Networking tips', 'Interview prep', 'Offer negotiation']
  },
  {
    icon: Users,
    title: 'Professional Networking',
    description: 'Build meaningful connections in your industry',
    topics: ['LinkedIn optimization', 'Networking events', 'Mentorship', 'Community building']
  },
  {
    icon: GraduationCap,
    title: 'Continuous Learning',
    description: 'Stay relevant in a rapidly changing job market',
    topics: ['Online courses', 'Industry trends', 'Certifications', 'Knowledge sharing']
  },
  {
    icon: Target,
    title: 'Career Transitions',
    description: 'Successfully navigate career changes',
    topics: ['Transferable skills', 'Industry research', 'Upskilling', 'Personal branding']
  },
  {
    icon: Zap,
    title: 'Career Acceleration',
    description: 'Fast-track your path to senior roles',
    topics: ['Leadership skills', 'Visibility strategies', 'Project management', 'Mentoring others']
  },
  {
    icon: BookOpen,
    title: 'Personal Branding',
    description: 'Build your professional reputation',
    topics: ['Online presence', 'Content creation', 'Speaking engagements', 'Thought leadership']
  }
]

export default function CareerGuidesPage() {
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
              Career Development
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Guides
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive guides to help you navigate every stage of your career journey.
            </p>
          </motion.div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {guides.map((guide, index) => {
              const Icon = guide.icon
              return (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group cursor-pointer"
                >
                  <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    {guide.description}
                  </p>
                  <div className="space-y-1">
                    {guide.topics.map((topic) => (
                      <div key={topic} className="text-xs text-gray-500">
                        • {topic}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Featured Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-8 mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <span className="text-purple-400 text-sm font-semibold">FEATURED GUIDE</span>
                <h2 className="text-3xl font-bold mt-2 mb-4">
                  The Complete Guide to Career Transitions
                </h2>
                <p className="text-gray-300 mb-6">
                  Thinking about changing careers? This comprehensive guide walks you through every step 
                  of making a successful transition, from identifying transferable skills to landing your first 
                  role in a new industry.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                  Read Full Guide
                </button>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                <h3 className="font-semibold mb-4">What You'll Learn:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>How to identify and leverage transferable skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Research strategies for new industries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Building a transition timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Networking in your target industry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Addressing career gaps in interviews</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center bg-gray-800/30 border border-gray-700 rounded-xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Get Weekly Career Tips
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to receive actionable career advice directly in your inbox.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

