'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { Mail, MapPin, Users, Target, Heart, Zap } from 'lucide-react'

const values = [
  {
    icon: Users,
    title: 'People First',
    description: 'We believe in empowering individuals to reach their full professional potential.'
  },
  {
    icon: Target,
    title: 'Data-Driven',
    description: 'Our insights are backed by real market data and advanced AI analysis.'
  },
  {
    icon: Heart,
    title: 'Transparent',
    description: 'We are open about our methods, pricing, and how we use your data.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We constantly evolve our platform to meet the changing needs of modern careers.'
  }
]

export default function AboutPage() {
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
              About
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Credably
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We are on a mission to democratize career advancement through AI-powered insights and transparent credibility scoring.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed text-center max-w-3xl mx-auto">
              At Credably, we believe that everyone deserves a clear path to career success. 
              We are building the most comprehensive career intelligence platform that combines 
              AI-powered analysis, real market data, and personalized guidance to help professionals 
              understand their worth, identify opportunities, and achieve their career goals.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="bg-gray-800/30 border border-gray-700 rounded-xl p-6"
                  >
                    <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-400">Career Paths</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:hello@credably.com" className="text-gray-400 hover:text-white">
                    hello@credably.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-gray-400">
                    San Francisco, CA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

