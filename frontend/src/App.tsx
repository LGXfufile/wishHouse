import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import WishWall from './pages/WishWall'
import MyWishes from './pages/MyWishes'
import About from './pages/About'
import SEOAnalysis from './pages/SEOAnalysis'
import SEODashboard from './pages/SEODashboard'
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppContent() {
  // 集成性能监控
  const { reportPerformanceIssue } = usePerformanceMonitor()

  useEffect(() => {
    // 监控路由变化性能
    const handleRouteChange = () => {
      setTimeout(() => {
        const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation && navigation.loadEventEnd - navigation.fetchStart > 3000) {
          reportPerformanceIssue({
            type: 'slow-loading',
            details: `Page load time exceeded 3 seconds: ${navigation.loadEventEnd - navigation.fetchStart}ms`,
            metrics: {
              loadComplete: navigation.loadEventEnd - navigation.fetchStart,
              TTFB: navigation.responseStart - navigation.requestStart
            }
          })
        }
      }, 1000)
    }

    handleRouteChange()
    window.addEventListener('beforeunload', handleRouteChange)
    
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange)
    }
  }, [reportPerformanceIssue])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wish-wall" element={<WishWall />} />
          <Route path="/my-wishes" element={<MyWishes />} />
          <Route path="/about" element={<About />} />
          <Route path="/seo-analysis" element={<SEOAnalysis />} />
          <Route path="/seo-dashboard" element={<SEODashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  )
}

export default App 