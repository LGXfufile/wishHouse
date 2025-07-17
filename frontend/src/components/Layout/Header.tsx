import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Star } from 'lucide-react'
import LanguageSwitcher from '../Common/LanguageSwitcher'

const Header: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Star className="w-8 h-8 text-gold-500 group-hover:text-gold-600 transition-colors" />
              <Heart className="w-4 h-4 text-primary-500 absolute -top-1 -right-1 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-gold-600 bg-clip-text text-transparent">
              {t('app.title')}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/wish-wall"
              className={`font-medium transition-colors ${
                isActive('/wish-wall') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              {t('nav.wishWall')}
            </Link>
            <Link
              to="/my-wishes"
              className={`font-medium transition-colors ${
                isActive('/my-wishes') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              {t('nav.myWishes')}
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              {t('nav.about')}
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header 