import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Star, BarChart3, Bot } from 'lucide-react'
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
            
            {/* SEO Tools Dropdown */}
            <div className="relative group">
              <button className="font-medium text-gray-600 hover:text-primary-500 transition-colors flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                SEO Tools
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/seo-analysis"
                  className={`block px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                    isActive('/seo-analysis') ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    SEO Analysis
                  </div>
                </Link>
                <Link
                  to="/seo-dashboard"
                  className={`block px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                    isActive('/seo-dashboard') ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    SEO Dashboard
                  </div>
                </Link>
              </div>
            </div>
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