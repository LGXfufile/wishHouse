import React from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Star } from 'lucide-react'

const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="relative">
              <Star className="w-6 h-6 text-gold-400" />
              <Heart className="w-3 h-3 text-primary-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-lg font-semibold">{t('app.title')}</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © 2024 {t('app.title')}. Made with love for sharing wishes.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {t('app.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 