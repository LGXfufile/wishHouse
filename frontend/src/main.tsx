import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config.ts'
import { serviceWorkerManager } from './utils/serviceWorkerManager'
import { seoAutomation } from './utils/seoAutomation'

// 注册Service Worker
if ('serviceWorker' in navigator) {
  serviceWorkerManager.register().then(registration => {
    if (registration) {
      console.log('Service Worker registered successfully')
      
      // 预加载关键资源
      serviceWorkerManager.preloadCriticalResources()
      
      // 设置更新处理
      serviceWorkerManager.onUpdate((update) => {
        switch (update.type) {
          case 'update-available':
            console.log('New app version available')
            break
          case 'update-installed':
            console.log('New app version installed, refresh to activate')
            // 可以显示用户通知
            break
          case 'update-activated':
            console.log('New app version activated')
            window.location.reload()
            break
        }
      })
    }
  }).catch(error => {
    console.error('Service Worker registration failed:', error)
  })
}

// 初始化SEO自动化
if (process.env.NODE_ENV === 'production') {
  // 生产环境启用SEO自动化
  console.log('SEO automation enabled in production')
} else {
  // 开发环境可选择性启用
  console.log('SEO automation available in development')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 