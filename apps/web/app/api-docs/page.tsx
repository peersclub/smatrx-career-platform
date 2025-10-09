'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { Code, Lock, Zap, BookOpen, CheckCircle2, Copy } from 'lucide-react'

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/skills/analyze',
    description: 'Analyze skills from text or resume',
    auth: true
  },
  {
    method: 'POST',
    path: '/api/v1/career/recommendations',
    description: 'Get personalized career recommendations',
    auth: true
  },
  {
    method: 'GET',
    path: '/api/v1/credibility/score',
    description: 'Retrieve credibility score and breakdown',
    auth: true
  },
  {
    method: 'GET',
    path: '/api/v1/market/trends',
    description: 'Get market trends and salary data',
    auth: false
  }
]

const features = [
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: '99.9% uptime with average response times under 100ms'
  },
  {
    icon: Lock,
    title: 'Secure',
    description: 'Enterprise-grade security with OAuth 2.0 and API keys'
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'RESTful API with comprehensive documentation'
  },
  {
    icon: BookOpen,
    title: 'Well Documented',
    description: 'Interactive API docs with code examples'
  }
]

export default function APIDocsPage() {
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
            <div className="bg-purple-500/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Code className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Credably
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                API
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Integrate career intelligence into your applications with our powerful API.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center"
                >
                  <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-purple-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">1</span>
                  Get Your API Key
                </h3>
                <p className="text-gray-400 ml-8">
                  Sign up for a Credably account and generate your API key from the developer dashboard.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-purple-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">2</span>
                  Make Your First Request
                </h3>
                <div className="ml-8 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Example Request</span>
                    <button className="text-gray-400 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-purple-400">
{`curl -X GET 'https://api.credably.com/v1/skills/analyze' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "text": "5 years of React and TypeScript experience..."
  }'`}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-purple-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">3</span>
                  Get Response
                </h3>
                <div className="ml-8 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-green-400">
{`{
  "skills": [
    { "name": "React", "proficiency": 90, "years": 5 },
    { "name": "TypeScript", "proficiency": 85, "years": 5 }
  ],
  "total_skills": 2
}`}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-md text-sm font-semibold ${
                      endpoint.method === 'GET' 
                        ? 'bg-green-900/30 text-green-400 border border-green-800' 
                        : 'bg-blue-900/30 text-blue-400 border border-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-purple-400 font-mono">{endpoint.path}</code>
                    {endpoint.auth && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Lock className="w-3 h-3" />
                        Auth Required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-2 ml-0 md:ml-20">{endpoint.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start integrating Credably's career intelligence into your application today.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/auth/signin"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Get API Key
              </Link>
              <button className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white font-semibold hover:bg-gray-700 transition-colors">
                View Full Docs
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

