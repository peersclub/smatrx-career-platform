'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <PublicHeader />

      {/* Content */}
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="bg-purple-500/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: December 2024</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  At Credably, we collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Account information (name, email, password)</li>
                  <li>Professional information (resume, skills, work experience)</li>
                  <li>Integration data (GitHub, LinkedIn profiles)</li>
                  <li>Usage data and analytics</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Provide and improve our career intelligence services</li>
                  <li>Generate personalized career recommendations</li>
                  <li>Calculate your credibility score</li>
                  <li>Send you relevant updates and notifications</li>
                  <li>Analyze platform usage and improve user experience</li>
                  <li>Protect against fraud and unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing</h2>
                <p className="mb-4">
                  We do not sell your personal information. We may share your data with:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Service providers who assist in platform operations</li>
                  <li>Analytics partners (with anonymized data)</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                <p className="text-gray-400">
                  We implement industry-standard security measures to protect your information, including encryption, 
                  secure servers, and regular security audits. However, no method of transmission over the internet 
                  is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
                <p className="text-gray-400">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and deliver 
                  personalized content. You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                <p className="text-gray-400">
                  If you have questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@credably.com" className="text-purple-400 hover:text-purple-300">
                    privacy@credably.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

