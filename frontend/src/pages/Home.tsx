import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Star, Heart, Sparkles, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import WishForm from '../components/Wish/WishForm'
import StructuredData from '../components/SEO/StructuredData'
import { useSEO } from '../hooks/useSEO'

const Home: React.FC = () => {
  const { t } = useTranslation()

  // SEO配置
  useSEO({
    title: t('app.title'),
    description: t('app.subtitle'),
    type: 'website',
    keywords: t('i18n.language') === 'zh' 
      ? '愿望,祝福,心愿,社区,分享,正能量,希望,梦想,许愿,点亮'
      : 'wishes,blessings,community,sharing,positive energy,hope,dreams,lighthouse,make wish,light up'
  })

  const features = [
    {
      icon: <Star className="w-8 h-8 text-gold-500" />,
      title: "Make a Wish",
      description: "Share your heartfelt desires with the world"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-500" />,
      title: "Light Up Others",
      description: "Support and bless wishes from around the globe"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-sage-500" />,
      title: "Generate Beautiful Cards",
      description: "Create stunning wish cards to share on social media"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Join the Community",
      description: "Connect with like-minded people sharing positive energy"
    }
  ]

  return (
    <>
      {/* SEO结构化数据 */}
      <StructuredData type="website" />
      <StructuredData type="organization" />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary-600 via-gold-500 to-sage-500 bg-clip-text text-transparent">
                  {t('app.title')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                {t('app.subtitle')}
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link to="/wish-wall" className="btn-primary text-lg px-8 py-3">
                {t('nav.wishWall')}
              </Link>
              <Link to="/my-wishes" className="btn-secondary text-lg px-8 py-3">
                {t('nav.myWishes')}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </section>

        {/* Wish Form Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8">
                {t('wish.createTitle')}
              </h2>
              <WishForm />
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home 