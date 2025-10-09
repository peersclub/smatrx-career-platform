'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { FileText } from 'lucide-react'

export default function TermsPage() {
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
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
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
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-400">
                  By accessing and using Credably, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
                <p className="mb-4">
                  You agree to use Credably only for lawful purposes. You must not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Provide false or misleading information</li>
                  <li>Impersonate another person or entity</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to scrape or collect data</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                <p className="mb-4 text-gray-400">
                  You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Providing accurate and up-to-date information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                <p className="text-gray-400">
                  All content, features, and functionality of Credably are owned by us and protected by international 
                  copyright, trademark, and other intellectual property laws. You retain ownership of the data you 
                  provide to us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Subscription and Payments</h2>
                <p className="mb-4 text-gray-400">
                  For paid subscriptions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Fees are billed in advance on a recurring basis</li>
                  <li>You can cancel your subscription at any time</li>
                  <li>Refunds are provided according to our refund policy</li>
                  <li>We reserve the right to change pricing with notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Service Availability</h2>
                <p className="text-gray-400">
                  While we strive for 99.9% uptime, we do not guarantee uninterrupted access to our services. 
                  We may suspend or discontinue any part of the service with or without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-400">
                  Credably provides career guidance and insights, but does not guarantee employment outcomes or 
                  career advancement. We are not liable for any indirect, incidental, or consequential damages 
                  arising from your use of our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
                <p className="text-gray-400">
                  We reserve the right to terminate or suspend your account at our discretion, without notice, 
                  for conduct that violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
                <p className="text-gray-400">
                  We may modify these Terms at any time. Continued use of Credably after changes constitutes 
                  acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
                <p className="text-gray-400">
                  For questions about these Terms, please contact us at{' '}
                  <a href="mailto:legal@credably.com" className="text-purple-400 hover:text-purple-300">
                    legal@credably.com
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

