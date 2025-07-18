import { useEffect, useCallback } from 'react'

// 扩展Window接口以支持gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// Core Web Vitals 指标类型
export interface CoreWebVitals {
  FCP?: number  // First Contentful Paint
  LCP?: number  // Largest Contentful Paint
  FID?: number  // First Input Delay
  CLS?: number  // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
}

export interface PerformanceMetrics extends CoreWebVitals {
  navigationStart?: number
  domContentLoaded?: number
  loadComplete?: number
  networkType?: string
  deviceMemory?: number
}

// 性能等级评定
export const getPerformanceGrade = (metrics: CoreWebVitals) => {
  const scores: Record<string, 'good' | 'needs-improvement' | 'poor'> = {}
  
  // LCP评级
  if (metrics.LCP !== undefined) {
    if (metrics.LCP <= 2500) scores.LCP = 'good'
    else if (metrics.LCP <= 4000) scores.LCP = 'needs-improvement'
    else scores.LCP = 'poor'
  }
  
  // FID评级
  if (metrics.FID !== undefined) {
    if (metrics.FID <= 100) scores.FID = 'good'
    else if (metrics.FID <= 300) scores.FID = 'needs-improvement'
    else scores.FID = 'poor'
  }
  
  // CLS评级
  if (metrics.CLS !== undefined) {
    if (metrics.CLS <= 0.1) scores.CLS = 'good'
    else if (metrics.CLS <= 0.25) scores.CLS = 'needs-improvement'
    else scores.CLS = 'poor'
  }
  
  return scores
}

// Web Vitals 监控
export const usePerformanceMonitor = () => {
  const sendToAnalytics = useCallback((metric: { name: string; value: number; id?: string }) => {
    // 发送到分析服务（Google Analytics、自定义分析等）
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', metric.name, {
          custom_parameter_1: metric.value,
          custom_parameter_2: metric.id,
        })
      } catch (error) {
        console.warn('Failed to send analytics:', error)
      }
    }
    
    // 控制台日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${metric.name}:`, metric.value)
    }
  }, [])

  useEffect(() => {
    // 检查是否支持 Performance Observer
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // 使用自定义实现监控 Core Web Vitals
    setupCustomMetrics()
  }, [sendToAnalytics])

  const setupCustomMetrics = useCallback(() => {
    // 自定义性能指标收集
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        try {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              sendToAnalytics({
                name: 'LCP',
                value: entry.startTime,
                id: (entry as any).id
              })
              break
            case 'first-input':
              sendToAnalytics({
                name: 'FID',
                value: (entry as any).processingStart - entry.startTime,
                id: (entry as any).id
              })
              break
            case 'layout-shift':
              // 累积 CLS
              if (!(entry as any).hadRecentInput) {
                sendToAnalytics({
                  name: 'CLS',
                  value: (entry as any).value,
                  id: (entry as any).id
                })
              }
              break
          }
        } catch (error) {
          console.warn('Error processing performance entry:', error)
        }
      })
    })

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      observer.observe({ type: 'first-input', buffered: true })
      observer.observe({ type: 'layout-shift', buffered: true })
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error)
    }

    return () => observer.disconnect()
  }, [sendToAnalytics])

  // 获取当前性能指标
  const getCurrentMetrics = useCallback((): PerformanceMetrics => {
    if (typeof window === 'undefined' || !window.performance) {
      return {}
    }

    try {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const metrics: PerformanceMetrics = {}

      if (navigation) {
        metrics.navigationStart = navigation.fetchStart
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
        metrics.loadComplete = navigation.loadEventEnd - navigation.fetchStart
        metrics.TTFB = navigation.responseStart - navigation.requestStart
      }

      // 获取网络信息
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      if (connection) {
        metrics.networkType = connection.effectiveType
      }

      // 获取设备内存信息
      if ('deviceMemory' in navigator) {
        metrics.deviceMemory = (navigator as any).deviceMemory
      }

      return metrics
    } catch (error) {
      console.warn('Error getting performance metrics:', error)
      return {}
    }
  }, [])

  // 报告性能问题
  const reportPerformanceIssue = useCallback((issue: {
    type: 'slow-loading' | 'layout-shift' | 'input-delay' | 'memory-leak'
    details: string
    metrics?: Partial<PerformanceMetrics>
  }) => {
    // 发送性能问题报告
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Performance Issue - ${issue.type}:`, issue.details, issue.metrics)
    }
    
    // 在生产环境中发送到错误追踪服务
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'performance_issue', {
          event_category: 'Performance',
          event_label: issue.type,
          custom_parameter_1: issue.details
        })
      } catch (error) {
        console.warn('Failed to report performance issue:', error)
      }
    }
  }, [])

  return {
    getCurrentMetrics,
    reportPerformanceIssue,
    getPerformanceGrade
  }
}

// 性能优化建议
export const getPerformanceRecommendations = (metrics: PerformanceMetrics): string[] => {
  const recommendations: string[] = []
  
  if (metrics.LCP && metrics.LCP > 2500) {
    recommendations.push('优化最大内容绘制(LCP)：压缩图片、使用CDN、优化关键渲染路径')
  }
  
  if (metrics.FID && metrics.FID > 100) {
    recommendations.push('减少首次输入延迟(FID)：分割长任务、优化JavaScript执行')
  }
  
  if (metrics.CLS && metrics.CLS > 0.1) {
    recommendations.push('改善累积布局偏移(CLS)：为图片设置尺寸、避免动态内容插入')
  }
  
  if (metrics.TTFB && metrics.TTFB > 600) {
    recommendations.push('优化首字节时间(TTFB)：优化服务器响应、使用CDN')
  }
  
  return recommendations
}

// 性能预算检查
export const checkPerformanceBudget = (metrics: PerformanceMetrics) => {
  const budget = {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    TTFB: 600,
    loadComplete: 3000
  }
  
  const violations: Array<{ metric: string; actual: number; budget: number }> = []
  
  Object.entries(budget).forEach(([metric, budgetValue]) => {
    const actualValue = metrics[metric as keyof PerformanceMetrics]
    if (typeof actualValue === 'number' && actualValue > budgetValue) {
      violations.push({
        metric,
        actual: actualValue,
        budget: budgetValue
      })
    }
  })
  
  return violations
}

export default usePerformanceMonitor 