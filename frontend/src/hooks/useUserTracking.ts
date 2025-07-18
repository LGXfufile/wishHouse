/**
 * 用户行为追踪Hook
 * 功能：监控用户操作并发送到飞书
 */

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { feishuNotifier } from '../utils/feishuNotifier'

export const useUserTracking = () => {
  const location = useLocation()
  const previousPath = useRef<string>('')

  useEffect(() => {
    // 页面切换监控
    if (previousPath.current && previousPath.current !== location.pathname) {
      feishuNotifier.notifyPageChange(previousPath.current, location.pathname)
    }
    
    // 页面访问监控
    feishuNotifier.notifyPageVisit(location.pathname, document.title)
    
    // 更新前一个路径
    previousPath.current = location.pathname
  }, [location.pathname])

  // 监控页面离开
  useEffect(() => {
    const handleBeforeUnload = () => {
      feishuNotifier.notifyCustomEvent('page_unload', {
        page: location.pathname,
        duration: Date.now() - performance.timing.navigationStart
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [location.pathname])

  // 监控页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden
      feishuNotifier.notifyCustomEvent('visibility_change', {
        page: location.pathname,
        hidden: isHidden,
        timestamp: new Date().toISOString()
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [location.pathname])

  // 监控错误
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      feishuNotifier.notifyError(
        new Error(event.message),
        `${event.filename}:${event.lineno}:${event.colno}`
      )
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      feishuNotifier.notifyError(
        new Error(event.reason),
        'Unhandled Promise Rejection'
      )
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return {
    // 手动追踪方法
    trackWishSubmission: (wishData: any) => {
      feishuNotifier.notifyWishSubmission(wishData)
    },
    
    trackWishLike: (wishId: string) => {
      feishuNotifier.notifyWishLike(wishId)
    },
    
    trackSearch: (searchTerm: string, resultsCount?: number) => {
      feishuNotifier.notifySearch(searchTerm, resultsCount)
    },
    
    trackCustomEvent: (eventName: string, eventData?: any) => {
      feishuNotifier.notifyCustomEvent(eventName, eventData)
    },
    
    trackButtonClick: (buttonName: string, context?: string) => {
      feishuNotifier.notifyCustomEvent('button_click', {
        buttonName,
        context,
        page: location.pathname
      })
    },
    
    trackFormInteraction: (formName: string, action: string, fieldName?: string) => {
      feishuNotifier.notifyCustomEvent('form_interaction', {
        formName,
        action,
        fieldName,
        page: location.pathname
      })
    },
    
    trackModalOpen: (modalName: string) => {
      feishuNotifier.notifyCustomEvent('modal_open', {
        modalName,
        page: location.pathname
      })
    },
    
    trackScrollToBottom: () => {
      feishuNotifier.notifyCustomEvent('scroll_to_bottom', {
        page: location.pathname
      })
    },
    
    setUserId: (userId: string) => {
      feishuNotifier.setUserId(userId)
    }
  }
}

export default useUserTracking 