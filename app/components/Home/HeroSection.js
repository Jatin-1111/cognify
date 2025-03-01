'use client'
import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, Users, BookOpen, Trophy } from 'lucide-react'
import { Cover } from '../ui/cover'
import { Spotlight } from '../ui/spotlight'

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' }
  })
}

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const features = useMemo(() => [
    { icon: <Users className="w-5 h-5" />, label: 'Expert Instructors', value: '500+' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Active Courses', value: '1000+' },
    { icon: <Trophy className="w-5 h-5" />, label: 'Success Stories', value: '50K+' },
  ], [])

  const popularTopics = useMemo(() => [
    'Web Development', 'AI & Machine Learning', 'Data Science', 'Cloud Computing',
    'Mobile Development', 'DevOps', 'Cybersecurity'
  ], [])

  return (
    <div className="min-h-[90vh] w-full bg-neutral-950 relative flex flex-col items-center justify-center py-32 overflow-hidden">
      <Spotlight />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Begin Your Learning Journey Today</span>
          </motion.div>

          <motion.h1
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text"
          >
            Learn from Industry Experts &{' '}
            <Cover>Build Your Future</Cover>
          </motion.h1>

          <motion.p
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="text-neutral-400 text-lg mb-8"
          >
            Access premium courses, interactive lessons, and a supportive community
            to master new skills at your own pace.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn today?"
                className="w-full px-6 py-4 bg-neutral-900/50 border border-neutral-800 rounded-full
                  text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  outline-none transition-all pr-12"
              />
              <Search className="absolute right-4 top-4 w-6 h-6 text-neutral-500" />
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="grid grid-cols-3 gap-8 mb-12"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-3">
                  {feature.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{feature.value}</div>
                <div className="text-neutral-500 text-sm">{feature.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Popular Topics */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="flex flex-wrap justify-center gap-3"
          >
            {popularTopics.map((topic, index) => (
              <button
                key={topic}
                className="px-6 py-2.5 rounded-full text-sm font-medium border border-neutral-800 
                  bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 
                  transition-all duration-200"
              >
                {topic}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(HeroSection)