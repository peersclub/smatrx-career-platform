'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { BookOpen, Clock, ArrowRight, TrendingUp, Brain, Target } from 'lucide-react'

const blogPosts = [
  {
    title: 'How AI is Transforming Career Development',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way professionals plan and advance their careers.',
    category: 'AI & Technology',
    readTime: '5 min read',
    date: 'Dec 15, 2024',
    image: Brain
  },
  {
    title: '10 Skills That Will Be Most In-Demand in 2025',
    excerpt: 'A data-driven analysis of the skills that employers will be looking for in the coming year.',
    category: 'Career Trends',
    readTime: '7 min read',
    date: 'Dec 10, 2024',
    image: TrendingUp
  },
  {
    title: 'Building Your Professional Credibility: A Complete Guide',
    excerpt: 'Learn how to establish and showcase your professional credibility in the digital age.',
    category: 'Career Growth',
    readTime: '10 min read',
    date: 'Dec 5, 2024',
    image: Target
  },
  {
    title: 'Salary Negotiation: Data-Driven Strategies',
    excerpt: 'Use market data and analytics to negotiate your next salary with confidence.',
    category: 'Career Advice',
    readTime: '8 min read',
    date: 'Nov 28, 2024',
    image: TrendingUp
  },
  {
    title: 'The Future of Remote Work and Career Planning',
    excerpt: 'How remote work is changing career trajectories and what it means for your career planning.',
    category: 'Future of Work',
    readTime: '6 min read',
    date: 'Nov 20, 2024',
    image: Brain
  },
  {
    title: 'From Junior to Senior: Mapping Your Career Path',
    excerpt: 'A practical guide to understanding and navigating the path from junior to senior roles.',
    category: 'Career Growth',
    readTime: '12 min read',
    date: 'Nov 15, 2024',
    image: Target
  }
]

export default function BlogPage() {
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
              Career Intelligence
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Insights, trends, and actionable advice to help you advance your career.
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => {
              const Icon = post.image
              return (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group"
                >
                  {/* Image Placeholder */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 h-48 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-purple-400" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="text-purple-400">{post.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-12"
          >
            <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Want More Career Insights?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to get the latest career intelligence delivered to your inbox.
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

