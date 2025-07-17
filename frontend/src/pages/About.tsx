import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Users, Globe, Sparkles, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import StructuredData from '../components/SEO/StructuredData'
import { useSEO } from '../hooks/useSEO'

const About: React.FC = () => {
  const { t } = useTranslation()

  // SEO配置
  useSEO({
    title: 'About Us',
    description: t('i18n.language') === 'zh' 
      ? '了解心愿灯塔的使命和愿景。我们致力于创造一个积极、支持性的空间，让人们表达内心深处的愿望，并从全球社区中获得鼓励。'
      : 'Learn about Wish Lighthouse mission and vision. We create a positive, supportive space where people can express their deepest wishes and find encouragement from a global community.',
    type: 'website',
    keywords: t('i18n.language') === 'zh' 
      ? '关于我们,心愿灯塔,使命,愿景,社区,支持,积极,全球,连接'
      : 'about us,wish lighthouse,mission,vision,community,support,positive,global,connection'
  })

  // 生成面包屑导航数据
  const breadcrumbs = [
    { name: t('nav.home'), url: '/' },
    { name: t('nav.about'), url: '/about' }
  ]

  const features = [
    {
      icon: <Star className="w-8 h-8 text-gold-500" />,
      title: "Make Wishes",
      description: "Express your deepest desires and hopes in a safe, supportive environment."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-500" />,
      title: "Spread Love",
      description: "Support others by lighting up their wishes and sending positive energy."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "Beautiful Cards",
      description: "Generate stunning wish cards to share your hopes with friends and family."
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Global Community",
      description: "Connect with people from around the world sharing the same hopes and dreams."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Anonymous Option",
      description: "Share your deepest wishes anonymously if you prefer privacy."
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-500" />,
      title: "Safe Space",
      description: "A moderated, positive environment where all wishes are welcomed and respected."
    }
  ]

  return (
    <>
      {/* SEO结构化数据 */}
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 via-gold-500 to-sage-500 bg-clip-text text-transparent">
                About Wish Lighthouse
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Wish Lighthouse is a global platform where people from all walks of life come together 
              to share their hopes, dreams, and aspirations. We believe that every wish deserves to be 
              heard and supported by a caring community.
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card p-8 mb-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To create a positive, supportive space where people can express their deepest wishes 
              and find encouragement from a global community. We aim to spread hope, positivity, 
              and human connection across cultural and geographical boundaries.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="card p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="card p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-600">Inclusivity</h3>
                <p className="text-gray-700">
                  We welcome people from all backgrounds, cultures, and beliefs. Every wish is valid 
                  and deserves respect and support.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gold-600">Positivity</h3>
                <p className="text-gray-700">
                  We maintain a positive, uplifting environment where hope and encouragement flourish 
                  naturally through community support.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-sage-600">Privacy</h3>
                <p className="text-gray-700">
                  We respect your privacy and provide options for anonymous sharing, ensuring you 
                  feel safe expressing your deepest desires.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-purple-600">Connection</h3>
                <p className="text-gray-700">
                  We believe in the power of human connection to heal, inspire, and create positive 
                  change in the world.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start your journey today. Share your wishes, light up others, and be part of a 
              global movement spreading hope and positivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/wish-wall" className="btn-primary text-lg px-8 py-3">
                Browse Wishes
              </a>
              <a href="/#create-wish" className="btn-secondary text-lg px-8 py-3">
                Make a Wish
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default About 