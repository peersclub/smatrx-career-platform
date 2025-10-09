'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import PublicHeader from '@/components/public-header'
import Footer from '@/components/footer'
import { Check, X, Zap, Crown, Star, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    icon: Star,
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring your career options',
    features: [
      { text: 'Basic skill analysis', included: true },
      { text: 'Resume upload', included: true },
      { text: '5 career recommendations', included: true },
      { text: 'Basic credibility score', included: true },
      { text: 'Community access', included: true },
      { text: 'AI-powered insights', included: false },
      { text: 'Unlimited recommendations', included: false },
      { text: 'Priority support', included: false },
      { text: 'Expert verification', included: false }
    ],
    cta: 'Get Started',
    ctaLink: '/auth/signin',
    popular: false
  },
  {
    name: 'Pro',
    icon: Zap,
    price: '$19',
    period: 'per month',
    description: 'For professionals serious about career growth',
    features: [
      { text: 'Advanced AI skill analysis', included: true },
      { text: 'GitHub & LinkedIn integration', included: true },
      { text: 'Unlimited career recommendations', included: true },
      { text: 'Full credibility dashboard', included: true },
      { text: 'Personalized learning paths', included: true },
      { text: 'Career goal tracking', included: true },
      { text: 'Market insights & trends', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Expert verification badges', included: false }
    ],
    cta: 'Start Pro Trial',
    ctaLink: '/auth/signin',
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: 'contact us',
    description: 'For teams and organizations',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team dashboards', included: true },
      { text: 'Bulk skill assessments', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom reporting', included: true },
      { text: 'API access', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'On-premise deployment', included: true }
    ],
    cta: 'Contact Sales',
    ctaLink: '/about',
    popular: false
  }
]

export default function PricingPage() {
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
              Simple, Transparent
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the plan that fits your career goals. All plans include our core features.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative bg-gray-800/30 border rounded-xl p-8 ${
                    plan.popular 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="bg-purple-500/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && (
                        <span className="text-gray-400">/{plan.period.split(' ')[1]}</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaLink}
                    className={`block w-full py-3 px-6 rounded-lg text-center font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Can I change plans later?</h3>
                <p className="text-gray-400">Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-gray-400">Yes! Pro plans come with a 14-day free trial. No credit card required to start.</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400">We accept all major credit cards, PayPal, and for Enterprise plans, we can arrange invoicing.</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-400">Absolutely! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

