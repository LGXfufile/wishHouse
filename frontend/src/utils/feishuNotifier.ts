/**
 * 飞书机器人通知服务
 * 功能：发送用户行为数据到飞书群
 */

interface FeishuMessageCard {
  msg_type: string
  card: {
    config: {
      wide_screen_mode: boolean
    }
    elements: Array<{
      tag: string
      text?: {
        content: string
        tag: string
      }
      fields?: Array<{
        is_short: boolean
        text: {
          content: string
          tag: string
        }
      }>
    }>
    header: {
      template: string
      title: {
        content: string
        tag: string
      }
    }
  }
}

interface UserBehavior {
  action: string
  page: string
  details?: any
  userAgent?: string
  timestamp: string
  sessionId: string
  userId?: string
  ip?: string
}

export class FeishuNotifier {
  private webhookUrl = 'https://open.feishu.cn/open-apis/bot/v2/hook/02ab958a-de59-430d-ba77-63a08da843a5'
  private sessionId: string
  private userId?: string
  private isEnabled = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeUserTracking()
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 初始化用户追踪
   */
  private initializeUserTracking() {
    // 获取用户基本信息
    if (typeof window !== 'undefined') {
      // 尝试从localStorage获取用户ID
      this.userId = localStorage.getItem('wish-user-id') || 'anonymous'
      
      // 如果没有用户ID，生成一个
      if (this.userId === 'anonymous') {
        this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
        localStorage.setItem('wish-user-id', this.userId)
      }

      // 发送用户进入通知
      this.notifyUserEntry()
    }
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string) {
    this.userId = userId
    if (typeof window !== 'undefined') {
      localStorage.setItem('wish-user-id', userId)
    }
  }

  /**
   * 启用/禁用通知
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  /**
   * 发送用户进入通知
   */
  private async notifyUserEntry() {
    const behavior: UserBehavior = {
      action: 'user_entry',
      page: window.location.pathname,
      details: {
        referrer: document.referrer,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`
      },
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 通知页面访问
   */
  async notifyPageVisit(pagePath: string, pageTitle?: string) {
    if (!this.isEnabled) return

    const behavior: UserBehavior = {
      action: 'page_visit',
      page: pagePath,
      details: {
        title: pageTitle || document.title,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 通知页面切换
   */
  async notifyPageChange(fromPath: string, toPath: string) {
    if (!this.isEnabled) return

    const behavior: UserBehavior = {
      action: 'page_change',
      page: toPath,
      details: {
        from: fromPath,
        to: toPath
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 通知心愿提交
   */
  async notifyWishSubmission(wishData: any) {
    if (!this.isEnabled) return

    const behavior: UserBehavior = {
      action: 'wish_submitted',
      page: window.location.pathname,
      details: {
        category: wishData.category,
        isAnonymous: wishData.isAnonymous,
        contentLength: wishData.content?.length || 0,
        hasImage: !!wishData.image
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 通知心愿点赞
   */
  async notifyWishLike(wishId: string) {
    if (!this.isEnabled) return

    const behavior: UserBehavior = {
      action: 'wish_liked',
      page: window.location.pathname,
      details: {
        wishId: wishId
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 通知搜索操作
   */
  async notifySearch(searchTerm: string, resultsCount?: number) {
    if (!this.isEnabled) return

    const behavior: UserBehavior = {
      action: 'search_performed',
      page: window.location.pathname,
      details: {
        searchTerm: searchTerm,
        resultsCount: resultsCount
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 通知错误事件
   */
  async notifyError(error: Error, context?: string) {
    if (!this.isEnabled) return

    const behavior: UserBehavior = {
      action: 'error_occurred',
      page: window.location.pathname,
      details: {
        errorMessage: error.message,
        errorStack: error.stack,
        context: context
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 通知自定义事件
   */
  async notifyCustomEvent(eventName: string, eventData?: any) {
    if (!this.isEnabled) return

    const behavior: UserBehavior = {
      action: eventName,
      page: window.location.pathname,
      details: eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    await this.sendNotification(behavior)
  }

  /**
   * 发送通知到飞书
   */
  private async sendNotification(behavior: UserBehavior) {
    try {
      const message = this.createFeishuMessage(behavior)
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })

      if (!response.ok) {
        console.warn('Failed to send Feishu notification:', response.status)
      }
    } catch (error) {
      console.error('Error sending Feishu notification:', error)
    }
  }

  /**
   * 创建飞书消息卡片
   */
  private createFeishuMessage(behavior: UserBehavior): FeishuMessageCard {
    const actionEmojis: Record<string, string> = {
      'user_entry': '🚀',
      'page_visit': '👀',
      'page_change': '🔄',
      'wish_submitted': '💫',
      'wish_liked': '❤️',
      'search_performed': '🔍',
      'error_occurred': '❌',
    }

    const actionNames: Record<string, string> = {
      'user_entry': '用户进入',
      'page_visit': '页面访问',
      'page_change': '页面切换',
      'wish_submitted': '心愿提交',
      'wish_liked': '心愿点赞',
      'search_performed': '搜索操作',
      'error_occurred': '错误发生',
    }

    const emoji = actionEmojis[behavior.action] || '📝'
    const actionName = actionNames[behavior.action] || behavior.action

    const fields = [
      {
        is_short: true,
        text: {
          content: `**用户ID：**\n${behavior.userId}`,
          tag: "lark_md"
        }
      },
      {
        is_short: true,
        text: {
          content: `**页面：**\n${behavior.page}`,
          tag: "lark_md"
        }
      },
      {
        is_short: true,
        text: {
          content: `**时间：**\n${new Date(behavior.timestamp).toLocaleString('zh-CN')}`,
          tag: "lark_md"
        }
      },
      {
        is_short: true,
        text: {
          content: `**会话ID：**\n${behavior.sessionId}`,
          tag: "lark_md"
        }
      }
    ]

    // 添加具体详情
    if (behavior.details) {
      const detailsText = Object.entries(behavior.details)
        .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join('\n')
      
      fields.push({
        is_short: false,
        text: {
          content: `**详细信息：**\n${detailsText}`,
          tag: "lark_md"
        }
      })
    }

    return {
      msg_type: "interactive",
      card: {
        config: {
          wide_screen_mode: true
        },
        elements: [
          {
            tag: "div",
            fields: fields
          },
          {
            tag: "hr"
          },
          {
            tag: "div",
            text: {
              content: `🌐 **网站：** [心愿灯塔](${window.location.origin})\n📱 **设备：** ${this.getDeviceInfo()}`,
              tag: "lark_md"
            }
          }
        ],
        header: {
          template: this.getHeaderColor(behavior.action),
          title: {
            content: `${emoji} ${actionName}`,
            tag: "plain_text"
          }
        }
      }
    }
  }

  /**
   * 获取设备信息
   */
  private getDeviceInfo(): string {
    const ua = navigator.userAgent
    let device = 'Unknown'
    
    if (/Mobile|Android|iPhone|iPad/.test(ua)) {
      device = 'Mobile'
    } else if (/Tablet/.test(ua)) {
      device = 'Tablet'
    } else {
      device = 'Desktop'
    }
    
    return device
  }

  /**
   * 获取消息头颜色
   */
  private getHeaderColor(action: string): string {
    const colorMap: Record<string, string> = {
      'user_entry': 'blue',
      'page_visit': 'green',
      'page_change': 'orange',
      'wish_submitted': 'purple',
      'wish_liked': 'red',
      'search_performed': 'yellow',
      'error_occurred': 'red',
    }
    
    return colorMap[action] || 'blue'
  }
}

// 创建全局实例
export const feishuNotifier = new FeishuNotifier()

export default FeishuNotifier 