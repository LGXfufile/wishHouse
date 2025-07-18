/**
 * SEO自动化工作流管理器
 * 功能：定期SEO检查、自动优化、报告生成、监控告警
 */

import { seoManager, SEOReport } from './seoManager'
import { seoAI, ContentAnalysis } from './seoAI'
import { serviceWorkerManager } from './serviceWorkerManager'

export interface AutomationConfig {
  enabled: boolean
  checkInterval: number // 检查间隔（分钟）
  autoOptimize: boolean
  generateReports: boolean
  alertThreshold: number // 评分阈值
  monitoring: {
    performance: boolean
    seo: boolean
    accessibility: boolean
    security: boolean
  }
}

export interface SEOSchedule {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'monthly'
  tasks: SEOTask[]
  lastRun?: string
  nextRun: string
  enabled: boolean
}

export interface SEOTask {
  id: string
  name: string
  type: 'analysis' | 'optimization' | 'report' | 'monitoring'
  config: any
  priority: 'high' | 'medium' | 'low'
}

export interface SEOAlert {
  id: string
  type: 'performance' | 'seo' | 'accessibility' | 'security'
  severity: 'critical' | 'warning' | 'info'
  message: string
  details: any
  timestamp: string
  resolved: boolean
}

export interface AutoOptimizationResult {
  applied: string[]
  skipped: string[]
  errors: string[]
  improvements: {
    scoreBefore: number
    scoreAfter: number
    changes: string[]
  }
}

export class SEOAutomationManager {
  private config: AutomationConfig
  private schedules: SEOSchedule[] = []
  private alerts: SEOAlert[] = []
  private isRunning = false
  private intervalId?: number

  constructor() {
    this.config = this.getDefaultConfig()
    this.loadConfig()
    this.setupAutomation()
  }

  /**
   * 获取默认配置
   */
  private getDefaultConfig(): AutomationConfig {
    return {
      enabled: true,
      checkInterval: 60, // 1小时
      autoOptimize: false, // 默认不自动优化
      generateReports: true,
      alertThreshold: 70,
      monitoring: {
        performance: true,
        seo: true,
        accessibility: true,
        security: false
      }
    }
  }

  /**
   * 加载配置
   */
  private loadConfig() {
    try {
      const saved = localStorage.getItem('seo-automation-config')
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.warn('Failed to load automation config:', error)
    }
  }

  /**
   * 保存配置
   */
  private saveConfig() {
    try {
      localStorage.setItem('seo-automation-config', JSON.stringify(this.config))
    } catch (error) {
      console.warn('Failed to save automation config:', error)
    }
  }

  /**
   * 设置自动化
   */
  private setupAutomation() {
    if (this.config.enabled) {
      this.start()
    }

    // 创建默认计划
    this.createDefaultSchedules()
  }

  /**
   * 启动自动化
   */
  start() {
    if (this.isRunning) {
      console.log('SEO automation already running')
      return
    }

    this.isRunning = true
    
    // 设置定期检查
    this.intervalId = window.setInterval(() => {
      this.runAutomationCycle()
    }, this.config.checkInterval * 60 * 1000)

    // 立即执行一次检查
    this.runAutomationCycle()

    console.log('SEO automation started')
  }

  /**
   * 停止自动化
   */
  stop() {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    
    if (this.intervalId) {
      window.clearInterval(this.intervalId)
      this.intervalId = undefined
    }

    console.log('SEO automation stopped')
  }

  /**
   * 运行自动化周期
   */
  private async runAutomationCycle() {
    try {
      console.log('Running SEO automation cycle...')

      // 1. 执行SEO分析
      const seoReport = await this.runSEOAnalysis()
      
      // 2. 检查性能指标
      if (this.config.monitoring.performance) {
        await this.checkPerformanceMetrics()
      }

      // 3. 自动优化（如果启用）
      if (this.config.autoOptimize) {
        await this.runAutoOptimization(seoReport)
      }

      // 4. 生成告警
      await this.checkAlerts(seoReport)

      // 5. 执行计划任务
      await this.runScheduledTasks()

      // 6. 生成报告（如果启用）
      if (this.config.generateReports) {
        await this.generateAutomatedReport(seoReport)
      }

      console.log('SEO automation cycle completed')
    } catch (error) {
      console.error('SEO automation cycle failed:', error)
      this.createAlert({
        type: 'seo',
        severity: 'critical',
        message: 'SEO自动化周期执行失败',
        details: { error: (error as Error).message }
      })
    }
  }

  /**
   * 执行SEO分析
   */
  private async runSEOAnalysis(): Promise<SEOReport> {
    const report = seoManager.analyzePage()
    
    // 保存历史记录
    this.saveAnalysisHistory(report)
    
    return report
  }

  /**
   * 检查性能指标
   */
  private async checkPerformanceMetrics() {
    try {
      // 检查Service Worker状态
      const swStatus = serviceWorkerManager.getStatus()
      if (!swStatus.isActive) {
        this.createAlert({
          type: 'performance',
          severity: 'warning',
          message: 'Service Worker未激活',
          details: swStatus
        })
      }

      // 检查缓存状态
      const cacheStatus = await serviceWorkerManager.getCacheStatus()
      const totalCacheSize = Object.values(cacheStatus).reduce((sum, cache) => sum + cache.size, 0)
      
      if (totalCacheSize > 100) { // 超过100个缓存项
        this.createAlert({
          type: 'performance',
          severity: 'info',
          message: '缓存项较多，建议清理',
          details: { totalCacheSize, cacheStatus }
        })
      }

    } catch (error) {
      console.warn('Performance metrics check failed:', error)
    }
  }

  /**
   * 自动优化
   */
  private async runAutoOptimization(seoReport: SEOReport): Promise<AutoOptimizationResult> {
    const result: AutoOptimizationResult = {
      applied: [],
      skipped: [],
      errors: [],
      improvements: {
        scoreBefore: seoReport.score,
        scoreAfter: seoReport.score,
        changes: []
      }
    }

    try {
      // 只执行安全的自动优化
      const safeOptimizations = seoReport.recommendations.filter(rec => 
        this.isSafeOptimization(rec)
      )

      for (const optimization of safeOptimizations) {
        try {
          const applied = await this.applyOptimization(optimization)
          if (applied) {
            result.applied.push(optimization)
            result.improvements.changes.push(optimization)
          } else {
            result.skipped.push(optimization)
          }
        } catch (error) {
          result.errors.push(`${optimization}: ${(error as Error).message}`)
        }
      }

      // 重新分析以获取优化后的分数
      if (result.applied.length > 0) {
        const newReport = seoManager.analyzePage()
        result.improvements.scoreAfter = newReport.score
      }

    } catch (error) {
      console.error('Auto optimization failed:', error)
      result.errors.push((error as Error).message)
    }

    return result
  }

  /**
   * 检查是否为安全的优化
   */
  private isSafeOptimization(optimization: string): boolean {
    const safePatterns = [
      /添加alt属性/i,
      /优化图片懒加载/i,
      /改善页面标题/i,
      /优化meta描述/i,
      /添加结构化数据/i
    ]

    return safePatterns.some(pattern => pattern.test(optimization))
  }

  /**
   * 应用优化
   */
  private async applyOptimization(optimization: string): Promise<boolean> {
    // 这里实现具体的优化逻辑
    // 目前只是模拟，实际应用中需要根据具体优化类型实现
    console.log('Applying optimization:', optimization)
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return true
  }

  /**
   * 检查告警
   */
  private async checkAlerts(seoReport: SEOReport) {
    // SEO评分告警
    if (seoReport.score < this.config.alertThreshold) {
      this.createAlert({
        type: 'seo',
        severity: seoReport.score < 50 ? 'critical' : 'warning',
        message: `SEO评分过低: ${seoReport.score}分`,
        details: {
          score: seoReport.score,
          issues: seoReport.issues,
          recommendations: seoReport.recommendations.slice(0, 3)
        }
      })
    }

    // 错误告警
    const errors = seoReport.issues.filter(issue => issue.type === 'error')
    if (errors.length > 0) {
      this.createAlert({
        type: 'seo',
        severity: 'critical',
        message: `发现${errors.length}个SEO错误`,
        details: { errors }
      })
    }

    // 图片优化告警
    if (seoReport.metrics.imageOptimization < 70) {
      this.createAlert({
        type: 'performance',
        severity: 'warning',
        message: '图片优化不足',
        details: {
          optimization: seoReport.metrics.imageOptimization,
          suggestion: '为图片添加alt属性并启用懒加载'
        }
      })
    }
  }

  /**
   * 创建告警
   */
  private createAlert(alert: Omit<SEOAlert, 'id' | 'timestamp' | 'resolved'>) {
    const newAlert: SEOAlert = {
      ...alert,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      resolved: false
    }

    this.alerts.unshift(newAlert)
    
    // 限制告警数量
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100)
    }

    // 保存到本地存储
    this.saveAlerts()

    console.log('SEO Alert created:', newAlert)
  }

  /**
   * 执行计划任务
   */
  private async runScheduledTasks() {
    const now = new Date()
    
    for (const schedule of this.schedules) {
      if (!schedule.enabled) continue
      
      const nextRun = new Date(schedule.nextRun)
      if (now >= nextRun) {
        await this.executeSchedule(schedule)
      }
    }
  }

  /**
   * 执行计划
   */
  private async executeSchedule(schedule: SEOSchedule) {
    try {
      console.log(`Executing schedule: ${schedule.name}`)
      
      for (const task of schedule.tasks) {
        await this.executeTask(task)
      }

      // 更新下次执行时间
      schedule.lastRun = new Date().toISOString()
      schedule.nextRun = this.calculateNextRun(schedule.type).toISOString()
      
      this.saveSchedules()
      
    } catch (error) {
      console.error(`Schedule execution failed: ${schedule.name}`, error)
      this.createAlert({
        type: 'seo',
        severity: 'warning',
        message: `计划任务执行失败: ${schedule.name}`,
        details: { error: (error as Error).message }
      })
    }
  }

  /**
   * 执行任务
   */
  private async executeTask(task: SEOTask) {
    switch (task.type) {
      case 'analysis':
        await this.runSEOAnalysis()
        break
      case 'report':
        await this.generateScheduledReport(task)
        break
      case 'monitoring':
        await this.runMonitoringTask(task)
        break
      case 'optimization':
        if (this.config.autoOptimize) {
          const report = seoManager.analyzePage()
          await this.runAutoOptimization(report)
        }
        break
    }
  }

  /**
   * 计算下次执行时间
   */
  private calculateNextRun(type: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date()
    
    switch (type) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      case 'monthly':
        const nextMonth = new Date(now)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        return nextMonth
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }
  }

  /**
   * 生成自动化报告
   */
  private async generateAutomatedReport(seoReport: SEOReport) {
    const report = {
      type: 'automated',
      timestamp: new Date().toISOString(),
      seo: seoReport,
      automation: {
        cyclesRun: this.getCycleCount(),
        alertsGenerated: this.alerts.filter(a => !a.resolved).length,
        optimizationsApplied: this.getOptimizationCount()
      },
      summary: {
        status: seoReport.score >= 80 ? 'excellent' : 
                seoReport.score >= 60 ? 'good' : 'needs-improvement',
        keyMetrics: {
          seoScore: seoReport.score,
          issuesCount: seoReport.issues.length,
          recommendationsCount: seoReport.recommendations.length
        }
      }
    }

    // 保存报告
    this.saveReport(report)
    
    console.log('Automated report generated:', report)
  }

  /**
   * 创建默认计划
   */
  private createDefaultSchedules() {
    if (this.schedules.length === 0) {
      this.schedules = [
        {
          id: this.generateId(),
          name: '每日SEO检查',
          type: 'daily',
          tasks: [
            {
              id: this.generateId(),
              name: 'SEO分析',
              type: 'analysis',
              config: {},
              priority: 'high'
            },
            {
              id: this.generateId(),
              name: '性能监控',
              type: 'monitoring',
              config: { metrics: ['performance', 'seo'] },
              priority: 'medium'
            }
          ],
          nextRun: this.calculateNextRun('daily').toISOString(),
          enabled: true
        },
        {
          id: this.generateId(),
          name: '周报生成',
          type: 'weekly',
          tasks: [
            {
              id: this.generateId(),
              name: '周度报告',
              type: 'report',
              config: { period: 'weekly' },
              priority: 'medium'
            }
          ],
          nextRun: this.calculateNextRun('weekly').toISOString(),
          enabled: true
        }
      ]
      
      this.saveSchedules()
    }
  }

  /**
   * 生成ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * 保存分析历史
   */
  private saveAnalysisHistory(report: SEOReport) {
    try {
      const history = this.getAnalysisHistory()
      history.unshift({
        ...report,
        id: this.generateId()
      })
      
      // 保留最近50次记录
      const trimmed = history.slice(0, 50)
      
      localStorage.setItem('seo-analysis-history', JSON.stringify(trimmed))
    } catch (error) {
      console.warn('Failed to save analysis history:', error)
    }
  }

  /**
   * 获取分析历史
   */
  private getAnalysisHistory(): any[] {
    try {
      const history = localStorage.getItem('seo-analysis-history')
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.warn('Failed to get analysis history:', error)
      return []
    }
  }

  /**
   * 保存告警
   */
  private saveAlerts() {
    try {
      localStorage.setItem('seo-alerts', JSON.stringify(this.alerts))
    } catch (error) {
      console.warn('Failed to save alerts:', error)
    }
  }

  /**
   * 保存计划
   */
  private saveSchedules() {
    try {
      localStorage.setItem('seo-schedules', JSON.stringify(this.schedules))
    } catch (error) {
      console.warn('Failed to save schedules:', error)
    }
  }

  /**
   * 保存报告
   */
  private saveReport(report: any) {
    try {
      const reports = this.getReports()
      reports.unshift(report)
      
      // 保留最近20个报告
      const trimmed = reports.slice(0, 20)
      
      localStorage.setItem('seo-reports', JSON.stringify(trimmed))
    } catch (error) {
      console.warn('Failed to save report:', error)
    }
  }

  /**
   * 获取报告
   */
  private getReports(): any[] {
    try {
      const reports = localStorage.getItem('seo-reports')
      return reports ? JSON.parse(reports) : []
    } catch (error) {
      console.warn('Failed to get reports:', error)
      return []
    }
  }

  /**
   * 获取周期计数
   */
  private getCycleCount(): number {
    try {
      const count = localStorage.getItem('seo-cycle-count')
      return count ? parseInt(count) : 0
    } catch (error) {
      return 0
    }
  }

  /**
   * 获取优化计数
   */
  private getOptimizationCount(): number {
    try {
      const count = localStorage.getItem('seo-optimization-count')
      return count ? parseInt(count) : 0
    } catch (error) {
      return 0
    }
  }

  // 公共API方法
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<AutomationConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.saveConfig()
    
    // 重启自动化（如果配置发生变化）
    if (this.isRunning) {
      this.stop()
      this.start()
    }
  }

  /**
   * 获取配置
   */
  getConfig(): AutomationConfig {
    return { ...this.config }
  }

  /**
   * 获取告警
   */
  getAlerts(resolved?: boolean): SEOAlert[] {
    if (resolved !== undefined) {
      return this.alerts.filter(alert => alert.resolved === resolved)
    }
    return [...this.alerts]
  }

  /**
   * 解决告警
   */
  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      this.saveAlerts()
    }
  }

  /**
   * 获取计划
   */
  getSchedules(): SEOSchedule[] {
    return [...this.schedules]
  }

  /**
   * 手动执行分析
   */
  async runManualAnalysis(): Promise<SEOReport> {
    return this.runSEOAnalysis()
  }

  /**
   * 获取自动化状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      config: this.config,
      alertCount: this.alerts.filter(a => !a.resolved).length,
      nextRun: this.schedules.find(s => s.enabled)?.nextRun,
      lastCycle: this.getAnalysisHistory()[0]?.timestamp
    }
  }

  /**
   * 生成计划报告任务
   */
  private async generateScheduledReport(task: SEOTask) {
    // 实现计划报告生成逻辑
    console.log('Generating scheduled report:', task.name)
  }

  /**
   * 运行监控任务
   */
  private async runMonitoringTask(task: SEOTask) {
    // 实现监控任务逻辑
    console.log('Running monitoring task:', task.name)
  }
}

// 创建全局SEO自动化管理器实例
export const seoAutomation = new SEOAutomationManager()

export default SEOAutomationManager 