/**
 * 飞书通知功能演示页面
 */

import React, { useState } from 'react'
import { useUserTracking } from '../hooks/useUserTracking'
import { Bell, Send, Search, Heart, AlertCircle, BarChart3 } from 'lucide-react'

const FeishuDemo: React.FC = () => {
  const { 
    trackWishSubmission, 
    trackWishLike, 
    trackSearch, 
    trackCustomEvent, 
    trackButtonClick,
    trackFormInteraction,
    trackModalOpen,
    setUserId 
  } = useUserTracking()

  const [wishContent, setWishContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [userId, setUserIdState] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 测试心愿提交
  const handleTestWishSubmission = () => {
    const wishData = {
      content: wishContent || '这是一个测试心愿',
      category: 'love',
      isAnonymous: false
    }
    trackWishSubmission(wishData)
    trackCustomEvent('demo_wish_test', { testType: 'wish_submission' })
  }

  // 测试心愿点赞
  const handleTestWishLike = () => {
    trackWishLike('test-wish-123')
    trackCustomEvent('demo_like_test', { testType: 'wish_like' })
  }

  // 测试搜索
  const handleTestSearch = () => {
    trackSearch(searchTerm || '爱情', 42)
    trackCustomEvent('demo_search_test', { testType: 'search' })
  }

  // 测试按钮点击
  const handleTestButtonClick = () => {
    trackButtonClick('demo_button', 'feishu_demo_page')
    trackCustomEvent('demo_button_test', { testType: 'button_click' })
  }

  // 测试表单交互
  const handleTestFormInteraction = () => {
    trackFormInteraction('demo_form', 'field_focus', 'demo_field')
    trackCustomEvent('demo_form_test', { testType: 'form_interaction' })
  }

  // 测试模态框
  const handleTestModal = () => {
    setIsModalOpen(true)
    trackModalOpen('demo_modal')
    trackCustomEvent('demo_modal_test', { testType: 'modal_open' })
  }

  // 测试错误
  const handleTestError = () => {
    try {
      throw new Error('这是一个测试错误')
    } catch (error) {
      // 错误会被全局错误处理器捕获并发送到飞书
      console.error('测试错误:', error)
    }
    trackCustomEvent('demo_error_test', { testType: 'error' })
  }

  // 设置用户ID
  const handleSetUserId = () => {
    if (userId.trim()) {
      setUserId(userId.trim())
      trackCustomEvent('user_id_updated', { newUserId: userId.trim() })
      alert(`用户ID已设置为: ${userId.trim()}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Bell className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            飞书通知功能演示
          </h1>
          <p className="text-gray-600">
            测试各种用户行为追踪功能，所有操作都会发送到飞书群
          </p>
        </div>

        {/* 用户设置 */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            用户设置
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="输入用户ID（可选）"
              value={userId}
              onChange={(e) => setUserIdState(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSetUserId}
              className="btn-primary px-6"
            >
              设置用户ID
            </button>
          </div>
        </div>

        {/* 测试功能区域 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 心愿相关测试 */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" />
              心愿功能测试
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">心愿内容</label>
                <textarea
                  value={wishContent}
                  onChange={(e) => setWishContent(e.target.value)}
                  placeholder="输入心愿内容（可选）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              
              <button
                onClick={handleTestWishSubmission}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                测试心愿提交
              </button>
              
              <button
                onClick={handleTestWishLike}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                测试心愿点赞
              </button>
            </div>
          </div>

          {/* 搜索测试 */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              搜索功能测试
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">搜索关键词</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="输入搜索关键词（可选）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <button
                onClick={handleTestSearch}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                测试搜索功能
              </button>
            </div>
          </div>

          {/* 交互测试 */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">交互功能测试</h2>
            
            <div className="space-y-3">
              <button
                onClick={handleTestButtonClick}
                className="w-full btn-secondary"
              >
                测试按钮点击追踪
              </button>
              
              <button
                onClick={handleTestFormInteraction}
                className="w-full btn-secondary"
              >
                测试表单交互追踪
              </button>
              
              <button
                onClick={handleTestModal}
                className="w-full btn-secondary"
              >
                测试模态框追踪
              </button>
            </div>
          </div>

          {/* 错误测试 */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              错误处理测试
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={handleTestError}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                测试错误追踪
              </button>
              
              <p className="text-sm text-gray-600">
                点击后会触发一个测试错误，错误信息会发送到飞书
              </p>
            </div>
          </div>
        </div>

        {/* 实时监控提示 */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔔 实时监控提示
          </h3>
          <div className="text-blue-800 space-y-1">
            <p>• 所有测试操作都会实时发送到飞书群</p>
            <p>• 页面访问、切换也会自动追踪</p>
            <p>• 可以在飞书群中查看详细的用户行为数据</p>
            <p>• 支持用户会话追踪和设备信息统计</p>
          </div>
        </div>

        {/* 测试模态框 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">测试模态框</h3>
              <p className="text-gray-600 mb-4">
                这是一个测试模态框，打开事件已发送到飞书。
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-primary w-full"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeishuDemo 