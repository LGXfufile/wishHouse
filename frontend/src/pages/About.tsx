import React from 'react'
import { useTranslation } from 'react-i18next'
import { Star, Heart, Globe, Users, Sparkles, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const About: React.FC = () => {
  const { t } = useTranslation()

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
      icon: <Shield className="w-8 h-8 text-indigo-500" />,
      title: "Safe Space",
      description: "A moderated, positive environment where all wishes are welcomed and respected."
    }
  ]

  return (
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
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Create Your Wish</h3>
                <p className="text-gray-600">Write down your heartfelt wish, choose a category, and decide whether to share it publicly or anonymously.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Generate a Beautiful Card</h3>
                <p className="text-gray-600">Our system automatically creates a stunning wish card with your message, perfect for sharing on social media.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-sage-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
                <p className="text-gray-600">Explore the wish wall, support others by lighting up their wishes, and receive encouragement for your own.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">✓ Please Do</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Be respectful and supportive</li>
                <li>• Share genuine, heartfelt wishes</li>
                <li>• Support others with positivity</li>
                <li>• Report inappropriate content</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">✗ Please Don't</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Post harmful or offensive content</li>
                <li>• Share personal information</li>
                <li>• Spam or post duplicate wishes</li>
                <li>• Use the platform for commercial purposes</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-6">
            Have questions, suggestions, or just want to share your story? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@wishlighthouse.com" className="btn-primary">
              Contact Us
            </a>
            <a href="#" className="btn-secondary">
              Follow Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About 