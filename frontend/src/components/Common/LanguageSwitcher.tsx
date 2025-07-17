import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const currentLang = i18n.language
    const newLang = currentLang === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      title="Switch Language"
    >
      <Globe className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-600">
        {t(`languages.${i18n.language}`)}
      </span>
    </button>
  )
}

export default LanguageSwitcher 