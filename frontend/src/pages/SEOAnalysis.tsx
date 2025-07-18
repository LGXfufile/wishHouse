import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Download,
  RefreshCw,
  BarChart3,
  Target,
  Lightbulb
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { seoManager, SEOReport } from '../utils/seoManager'
import { usePerformanceMonitor, PerformanceMetrics } from '../hooks/usePerformanceMonitor'
import StructuredData from '../components/SEO/StructuredData'
import { useSEO } from '../hooks/useSEO'

const SEOAnalysis: React.FC = () => {
  const { t } = useTranslation()
  const [seoReport, setSeoReport] = useState<SEOReport | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({})
  const { getCurrentMetrics, getPerformanceGrade } = usePerformanceMonitor()

  // SEO配置
  useSEO({
    title: 'SEO Analysis & Performance Report',
    description: 'Comprehensive SEO analysis and performance monitoring for Wish Lighthouse. Get detailed insights and optimization recommendations.',
    keywords: 'SEO analysis, performance monitoring, web vitals, optimization, technical SEO',
    type: 'website'
  })

  useEffect(() => {
    // 页面加载时自动分析
    performAnalysis()
    
    // 获取性能指标
    const metrics = getCurrentMetrics()
    setPerformanceMetrics(metrics)
  }, [getCurrentMetrics])

  const performAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      // 延迟一下让页面完全加载
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const report = seoManager.analyzePage()
      setSeoReport(report)
    } catch (error) {
      console.error('SEO analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadReport = () => {
    if (!seoReport) return
    
    const reportData = {
      ...seoReport,
      performance: performanceMetrics,
      performanceGrade: getPerformanceGrade(performanceMetrics),
      url: window.location.href,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <>
      {/* SEO结构化数据 */}
      <StructuredData type="website" />
      
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <BarChart3 className="w-10 h-10 text-primary-600" />
              SEO Analysis Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive SEO performance analysis and optimization recommendations 
              to improve your search engine visibility and rankings.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <button
              onClick={performAnalysis}
              disabled={isAnalyzing}
              className="btn-primary flex items-center gap-2"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Run SEO Analysis'}
            </button>
            
            {seoReport && (
              <button
                onClick={downloadReport}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
            )}
          </motion.div>

          {/* SEO Score Overview */}
          {seoReport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {/* Overall Score */}
              <div className={`card p-6 text-center ${getScoreBgColor(seoReport.score)}`}>
                <div className="flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Overall SEO Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(seoReport.score)}`}>
                  {seoReport.score}
                </div>
                <div className="text-sm text-gray-600 mt-1">out of 100</div>
              </div>

              {/* Issues Count */}
              <div className="card p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Issues Found</h3>
                <div className="text-4xl font-bold text-orange-600">
                  {seoReport.issues.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {seoReport.issues.filter(i => i.type === 'error').length} errors, {' '}
                  {seoReport.issues.filter(i => i.type === 'warning').length} warnings
                </div>
              </div>

              {/* Last Updated */}
              <div className="card p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Last Analysis</h3>
                <div className="text-lg font-bold text-blue-600">
                  {new Date(seoReport.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(seoReport.timestamp).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          )}

          {/* Metrics Grid */}
          {seoReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
              {/* SEO Metrics */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  SEO Metrics
                </h3>
                <div className="space-y-4">
                  {Object.entries(seoReport.metrics).map(([key, value]) => {
                    if (typeof value === 'boolean') {
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <div className="flex items-center gap-2">
                            {value ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={value ? 'text-green-600' : 'text-red-600'}>
                              {value ? 'Good' : 'Needs work'}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    
                    if (typeof value === 'number') {
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <span className="font-semibold">
                            {key.includes('optimization') ? `${value.toFixed(1)}%` : value}
                          </span>
                        </div>
                      )
                    }
                    
                    return null
                  })}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  {Object.entries(performanceMetrics).map(([key, value]) => {
                    if (typeof value === 'number') {
                      const grade = getPerformanceGrade({ [key]: value })[key]
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-700 uppercase">{key}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {key.includes('Time') || key.includes('LCP') || key.includes('FID') || key.includes('TTFB') 
                                ? `${value.toFixed(0)}ms` 
                                : key.includes('CLS') 
                                ? value.toFixed(3)
                                : value}
                            </span>
                            {grade && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                grade === 'good' ? 'bg-green-100 text-green-800' :
                                grade === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {grade.replace('-', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Issues and Recommendations */}
          {seoReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Issues */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Issues Found ({seoReport.issues.length})
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {seoReport.issues.length > 0 ? (
                    seoReport.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          issue.type === 'error' 
                            ? 'bg-red-50 border-red-500' 
                            : issue.type === 'warning'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            issue.type === 'error' 
                              ? 'bg-red-100 text-red-800' 
                              : issue.type === 'warning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {issue.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{issue.message}</p>
                        {issue.element && (
                          <p className="text-xs text-gray-500 mt-1">Element: {issue.element}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p>No issues found! Great job!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Recommendations ({seoReport.recommendations.length})
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {seoReport.recommendations.length > 0 ? (
                    seoReport.recommendations.map((recommendation, index) => (
                      <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="text-sm text-gray-700">{recommendation}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p>No recommendations needed! Your SEO is optimized!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isAnalyzing && !seoReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 text-center"
            >
              <RefreshCw className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analyzing Your Website...</h3>
              <p className="text-gray-600">
                We're examining your page structure, meta tags, performance metrics, and more.
              </p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isAnalyzing && !seoReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 text-center"
            >
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-gray-600 mb-6">
                Click "Run SEO Analysis" to get a comprehensive report of your website's 
                SEO performance and optimization opportunities.
              </p>
              <button onClick={performAnalysis} className="btn-primary">
                Start Analysis
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default SEOAnalysis 