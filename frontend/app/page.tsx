'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Globe, 
  Zap, 
  BookOpen, 
  BarChart2, 
  Activity,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Target,
  Brain,
  Newspaper,
  Briefcase,
} from 'lucide-react';

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Zap,
      title: 'What-If Simulator',
      description: 'AI-powered scenario analysis. Predict how inflation, interest rates, and global events impact Indian markets.',
      href: '/simulator',
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
    },
    {
      icon: Briefcase,
      title: 'Portfolio Tracker',
      description: 'Track your investments with macro alerts. Get personalized risk analysis and stress test your portfolio.',
      href: '/portfolio',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    },
    {
      icon: BookOpen,
      title: 'Learning Center',
      description: 'Interactive tutorials, quizzes, and real case studies. Learn market analysis the smart way.',
      href: '/learn',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    },
    {
      icon: Newspaper,
      title: 'Sentiment Analysis',
      description: 'Real-time news sentiment with Fear & Greed Index. Understand market mood before making decisions.',
      href: '/sentiment',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
    },
    {
      icon: Globe,
      title: 'Global Markets',
      description: 'Compare 35+ countries. Inflation, stocks, currencies - all in one place with interactive visualizations.',
      href: '/global',
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
    },
    {
      icon: Activity,
      title: 'Market Dynamics',
      description: 'Real-time stock search, detailed analytics, and market trends for informed trading decisions.',
      href: '/dynamics',
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30',
    },
  ];

  const stats = [
    { value: '35+', label: 'Countries', icon: '🌍' },
    { value: '100+', label: 'Stock Indices', icon: '📈' },
    { value: '10Y', label: 'Historical Data', icon: '📊' },
    { value: '24/7', label: 'Real-time Updates', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:via-indigo-950/50 dark:to-purple-950/50">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-300/20 to-purple-300/20 dark:from-indigo-800/20 dark:to-purple-800/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-300/20 to-orange-300/20 dark:from-pink-800/20 dark:to-orange-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-slate-700/50 shadow-lg mb-8">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Market Intelligence
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Global Market
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Analyzer</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Predict market movements, track your portfolio, and learn through interactive
              tutorials - all powered by AI and real-time data from <strong className="text-indigo-600 dark:text-indigo-400">35+ countries</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/simulator">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Try What-If Simulator
                </motion.button>
              </Link>
              <Link href="/global">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Explore Global Data
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card p-6 text-center group hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-500 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to understand, analyze, and predict market movements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Link href={feature.href}>
                  <div className={`feature-card h-full bg-gradient-to-br ${feature.bgGradient}`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      {feature.title}
                      <ChevronRight className={`w-5 h-5 transition-transform ${hoveredFeature === index ? 'translate-x-1' : ''}`} />
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* India Focus Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-orange-950/20 dark:via-slate-900 dark:to-green-950/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
                🇮🇳 India-Specific Focus
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Deep Dive into
                <span className="gradient-text"> Indian Markets</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Unlike generic tools, we focus on what matters to Indian investors - RBI policy impacts,
                Union Budget analysis, monsoon effects, and India-specific sector correlations.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: '🏦', text: 'RBI Monetary Policy Impact Analysis' },
                  { icon: '📜', text: 'Union Budget Sector-wise Predictions' },
                  { icon: '🌾', text: 'Monsoon & Agricultural Impact Tracking' },
                  { icon: '📊', text: 'NSE/BSE Stock Correlations' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Quick Simulation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  What happens to NIFTY if RBI raises rates by 25 bps?
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="stat-card-red p-4">
                    <div className="text-sm text-gray-500 mb-1">NIFTY 50</div>
                    <div className="text-2xl font-bold text-red-500">-1.8%</div>
                  </div>
                  <div className="stat-card-green p-4">
                    <div className="text-sm text-gray-500 mb-1">Bank NIFTY</div>
                    <div className="text-2xl font-bold text-emerald-500">+2.3%</div>
                  </div>
                </div>
                <Link href="/simulator">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-glow w-full"
                  >
                    Run Your Own Simulation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Market Analysis?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of investors using AI-powered insights to make smarter decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                </motion.button>
              </Link>
              <Link href="/learn">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5 mr-2 inline" />
                  Start Learning
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
