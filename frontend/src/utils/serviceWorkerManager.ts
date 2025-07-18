/**
 * Service Worker 管理器
 * 功能：注册、更新、通信、缓存管理
 */

export interface CacheStatus {
  [cacheName: string]: {
    size: number
    urls: string[]
  }
}

export interface ServiceWorkerUpdate {
  type: 'update-available' | 'update-installed' | 'update-activated'
  worker?: ServiceWorker
}

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private updateCallbacks: ((update: ServiceWorkerUpdate) => void)[] = []
  private isOnline = navigator.onLine

  constructor() {
    // 监听网络状态变化
    window.addEventListener('online', this.handleOnline.bind(this))
    window.addEventListener('offline', this.handleOffline.bind(this))
  }

  /**
   * 注册 Service Worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported')
      return null
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered successfully')

      // 监听更新
      this.setupUpdateHandling()

      // 监听消息
      this.setupMessageHandling()

      return this.registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }

  /**
   * 设置更新处理
   */
  private setupUpdateHandling() {
    if (!this.registration) return

    // 检查是否有新的Service Worker等待激活
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing

      if (newWorker) {
        this.notifyUpdateCallbacks({
          type: 'update-available',
          worker: newWorker
        })

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 有新版本可用
              this.notifyUpdateCallbacks({
                type: 'update-installed',
                worker: newWorker
              })
            } else {
              // 首次安装
              this.notifyUpdateCallbacks({
                type: 'update-activated',
                worker: newWorker
              })
            }
          }
        })
      }
    })

    // 监听控制器变化
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      this.notifyUpdateCallbacks({
        type: 'update-activated'
      })
    })
  }

  /**
   * 设置消息处理
   */
  private setupMessageHandling() {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, payload } = event.data

      switch (type) {
        case 'CACHE_UPDATED':
          console.log('Cache updated:', payload)
          break
        case 'OFFLINE_READY':
          console.log('App ready for offline use')
          break
        case 'UPDATE_AVAILABLE':
          this.notifyUpdateCallbacks({
            type: 'update-available'
          })
          break
      }
    })
  }

  /**
   * 通知更新回调
   */
  private notifyUpdateCallbacks(update: ServiceWorkerUpdate) {
    this.updateCallbacks.forEach(callback => callback(update))
  }

  /**
   * 添加更新回调
   */
  onUpdate(callback: (update: ServiceWorkerUpdate) => void) {
    this.updateCallbacks.push(callback)
  }

  /**
   * 移除更新回调
   */
  offUpdate(callback: (update: ServiceWorkerUpdate) => void) {
    const index = this.updateCallbacks.indexOf(callback)
    if (index > -1) {
      this.updateCallbacks.splice(index, 1)
    }
  }

  /**
   * 跳过等待，立即激活新的Service Worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      return
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  /**
   * 更新Service Worker
   */
  async update(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service Worker not registered')
    }

    try {
      await this.registration.update()
    } catch (error) {
      console.error('Service Worker update failed:', error)
      throw error
    }
  }

  /**
   * 预缓存URL列表
   */
  async cacheUrls(urls: string[]): Promise<void> {
    this.postMessage({
      type: 'CACHE_URLS',
      payload: { urls }
    })
  }

  /**
   * 清除缓存
   */
  async clearCache(cacheName?: string): Promise<void> {
    this.postMessage({
      type: 'CLEAR_CACHE',
      payload: { cacheName }
    })
  }

  /**
   * 获取缓存状态
   */
  async getCacheStatus(): Promise<CacheStatus> {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel()
      
      channel.port1.onmessage = (event) => {
        resolve(event.data)
      }

      this.postMessage({
        type: 'GET_CACHE_STATUS'
      }, [channel.port2])

      // 超时处理
      setTimeout(() => {
        reject(new Error('Timeout waiting for cache status'))
      }, 5000)
    })
  }

  /**
   * 发送消息给Service Worker
   */
  private postMessage(message: any, transfer?: Transferable[]) {
    if (!navigator.serviceWorker.controller) {
      console.warn('No service worker controller available')
      return
    }

    if (transfer) {
      navigator.serviceWorker.controller.postMessage(message, { transfer })
    } else {
      navigator.serviceWorker.controller.postMessage(message)
    }
  }

  /**
   * 网络连接恢复处理
   */
  private handleOnline() {
    this.isOnline = true
    console.log('Connection restored')
    
    // 通知Service Worker网络恢复
    this.postMessage({
      type: 'ONLINE',
      payload: { timestamp: Date.now() }
    })

    // 触发后台同步
    this.triggerBackgroundSync()
  }

  /**
   * 网络连接丢失处理
   */
  private handleOffline() {
    this.isOnline = false
    console.log('Connection lost')
    
    // 通知Service Worker网络断开
    this.postMessage({
      type: 'OFFLINE',
      payload: { timestamp: Date.now() }
    })
  }

  /**
   * 触发后台同步
   */
  private async triggerBackgroundSync() {
    // 背景同步API支持有限，暂时使用简单的手动同步
    console.log('Background sync triggered manually')
    
    // 可以在这里添加手动同步逻辑
    try {
      // 模拟后台同步操作
      await this.postMessage({
        type: 'SYNC_REQUEST',
        payload: { timestamp: Date.now() }
      })
    } catch (error) {
      console.error('Background sync failed:', error)
    }
  }

  /**
   * 检查Service Worker状态
   */
  getStatus() {
    return {
      isSupported: 'serviceWorker' in navigator,
      isRegistered: !!this.registration,
      isActive: !!navigator.serviceWorker.controller,
      isOnline: this.isOnline,
      registration: this.registration
    }
  }

  /**
   * 预加载关键资源
   */
  async preloadCriticalResources() {
    const criticalUrls = [
      '/',
      '/wish-wall',
      '/about',
      '/manifest.json',
      '/favicon.ico'
    ]

    await this.cacheUrls(criticalUrls)
    console.log('Critical resources preloaded')
  }

  /**
   * 设置推送通知
   */
  async setupPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration || !('Notification' in window)) {
      return null
    }

    // 请求通知权限
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return null
    }

    try {
      // 订阅推送通知
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      })

      console.log('Push subscription created:', subscription)
      return subscription
    } catch (error) {
      console.error('Push subscription failed:', error)
      return null
    }
  }

  /**
   * 转换VAPID密钥格式
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  /**
   * 注销Service Worker
   */
  async unregister(): Promise<void> {
    if (!this.registration) {
      return
    }

    try {
      await this.registration.unregister()
      this.registration = null
      console.log('Service Worker unregistered')
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      throw error
    }
  }
}

// 创建全局Service Worker管理器实例
export const serviceWorkerManager = new ServiceWorkerManager()

export default ServiceWorkerManager 