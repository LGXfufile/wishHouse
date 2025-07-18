import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Play, 
  Pause, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Bot,
  Monitor,
  FileText,
  Zap
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { seoAutomation, AutomationConfig, SEOAlert, SEOSchedule } from '../utils/seoAutomation'
import { serviceWorkerManager } from '../utils/serviceWorkerManager'
import StructuredData from '../components/SEO/StructuredData'
import { useSEO } from '../hooks/useSEO'

const SEODashboard: React.FC = () => {
  const { t } = useTranslation()
  const [config, setConfig] = useState<AutomationConfig>(seoAutomation.getConfig())
  const [alerts, setAlerts] = useState<SEOAlert[]>([])
  const [schedules, setSchedules] = useState<SEOSchedule[]>([])
  const [status, setStatus] = useState(seoAutomation.getStatus())
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'alerts' | 'schedules'>('overview')

  // SEO配置
  useSEO({
    title: 'SEO Automation Dashboard - Advanced SEO Management',
    description: 'Comprehensive SEO automation dashboard with real-time monitoring, intelligent optimization, and automated reporting for Wish Lighthouse.',
    keywords: 'SEO automation, SEO dashboard, automated optimization, SEO monitoring, technical SEO, SEO tools',
    type: 'webapp'
  })

  useEffect(() => {
    // 定期更新状态
    const interval = setInterval(() => {
      setStatus(seoAutomation.getStatus())
      setAlerts(seoAutomation.getAlerts())
      setSchedules(seoAutomation.getSchedules())
    }, 30000) // 每30秒更新一次

    // 初始加载
    setAlerts(seoAutomation.getAlerts())
    setSchedules(seoAutomation.getSchedules())

    return () => clearInterval(interval)
  }, [])

  const handleConfigUpdate = (newConfig: Partial<AutomationConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    seoAutomation.updateConfig(newConfig)
    setStatus(seoAutomation.getStatus())
  }

  const handleToggleAutomation = () => {
    if (status.isRunning) {
      seoAutomation.stop()
    } else {
      seoAutomation.start()
    }
    setStatus(seoAutomation.getStatus())
  }

  const handleResolveAlert = (alertId: string) => {
    seoAutomation.resolveAlert(alertId)
    setAlerts(seoAutomation.getAlerts())
  }

  const handleRunManualAnalysis = async () => {
    try {
      await seoAutomation.runManualAnalysis()
      setStatus(seoAutomation.getStatus())
    } catch (error) {
      console.error('Manual analysis failed:', error)
    }
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = (isRunning: boolean) => {
    return isRunning ? 'text-green-600' : 'text-gray-500'
  }

  return (
    <>
      {/* SEO结构化数据 */}
      <StructuredData type="webapp" />
      
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <Bot className="w-8 h-8 text-primary-600" />
                  SEO Automation Dashboard
                </h1>
                <p className="text-gray-600">
                  Intelligent SEO monitoring and optimization automation
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${getStatusColor(status.isRunning)}`}>
                  {status.isRunning ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Running</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="font-medium">Stopped</span>
                    </>
                  )}
                </div>
                
                <button
                  onClick={handleToggleAutomation}
                  className={`btn ${status.isRunning ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
                >
                  {status.isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Status Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <Monitor className="w-6 h-6 text-blue-600" />
                <span className={`text-sm font-medium ${getStatusColor(status.isRunning)}`}>
                  {status.isRunning ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-lg font-semibold">Automation Status</h3>
              <p className="text-sm text-gray-600">
                {status.isRunning ? 'Monitoring and optimizing' : 'Automation paused'}
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">
                  {status.alertCount}
                </span>
              </div>
              <h3 className="text-lg font-semibold">Active Alerts</h3>
              <p className="text-sm text-gray-600">
                Issues requiring attention
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 text-green-600" />
                <span className="text-sm text-gray-500">
                  {status.nextRun ? new Date(status.nextRun).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
              <h3 className="text-lg font-semibold">Next Check</h3>
              <p className="text-sm text-gray-600">
                Scheduled automation run
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <button
                  onClick={handleRunManualAnalysis}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Run Now
                </button>
              </div>
              <h3 className="text-lg font-semibold">Manual Analysis</h3>
              <p className="text-sm text-gray-600">
                Trigger immediate SEO check
              </p>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: Monitor },
                  { id: 'config', label: 'Configuration', icon: Settings },
                  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
                  { id: 'schedules', label: 'Schedules', icon: Calendar }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {status.lastCycle && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Last SEO Analysis</p>
                          <p className="text-sm text-gray-600">
                            {new Date(status.lastCycle).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Automation {status.isRunning ? 'Started' : 'Stopped'}</p>
                        <p className="text-sm text-gray-600">Status updated</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Summary */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    Configuration Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check Interval</span>
                      <span className="font-medium">{config.checkInterval} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto Optimization</span>
                      <span className={`font-medium ${config.autoOptimize ? 'text-green-600' : 'text-gray-400'}`}>
                        {config.autoOptimize ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generate Reports</span>
                      <span className={`font-medium ${config.generateReports ? 'text-green-600' : 'text-gray-400'}`}>
                        {config.generateReports ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alert Threshold</span>
                      <span className="font-medium">{config.alertThreshold}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-6">Automation Configuration</h3>
                
                <div className="space-y-6">
                  {/* Basic Settings */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Basic Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Check Interval (minutes)
                        </label>
                        <input
                          type="number"
                          value={config.checkInterval}
                          onChange={(e) => handleConfigUpdate({ checkInterval: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          min="5"
                          max="1440"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Alert Threshold (%)
                        </label>
                        <input
                          type="number"
                          value={config.alertThreshold}
                          onChange={(e) => handleConfigUpdate({ alertThreshold: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Features</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto Optimization</p>
                          <p className="text-sm text-gray-600">Automatically apply safe SEO optimizations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.autoOptimize}
                            onChange={(e) => handleConfigUpdate({ autoOptimize: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Generate Reports</p>
                          <p className="text-sm text-gray-600">Automatically generate SEO reports</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.generateReports}
                            onChange={(e) => handleConfigUpdate({ generateReports: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Settings */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Monitoring</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(config.monitoring).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="capitalize">{key}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => handleConfigUpdate({
                                monitoring: { ...config.monitoring, [key]: e.target.checked }
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-6">System Alerts</h3>
                
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">All Clear!</h4>
                    <p className="text-gray-600">No active alerts at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.filter(alert => !alert.resolved).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.severity === 'critical' 
                            ? 'bg-red-50 border-red-500' 
                            : alert.severity === 'warning'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getAlertIcon(alert.severity)}
                            <div>
                              <h4 className="font-medium">{alert.message}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                                alert.type === 'seo' ? 'bg-purple-100 text-purple-800' :
                                alert.type === 'performance' ? 'bg-blue-100 text-blue-800' :
                                alert.type === 'accessibility' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {alert.type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            className="text-sm text-primary-600 hover:text-primary-800"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schedules' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-6">Automation Schedules</h3>
                
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{schedule.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            schedule.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {schedule.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {schedule.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Tasks: {schedule.tasks.length}</p>
                        <p>Next run: {new Date(schedule.nextRun).toLocaleString()}</p>
                        {schedule.lastRun && (
                          <p>Last run: {new Date(schedule.lastRun).toLocaleString()}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {schedule.tasks.map((task) => (
                          <span
                            key={task.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {task.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default SEODashboard 