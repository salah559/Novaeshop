
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ToastContainer } from '@/components/Toast'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleRouteChange = () => setIsLoading(true)
    const handleRouteChangeComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeComplete)
    }
  }, [router.events])

  return (
    <LanguageProvider>
      <ToastContainer />
      <Header />
      <Breadcrumbs />
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #39ff14, #ffd700)',
          zIndex: 999,
          animation: 'progress 0.3s ease-in-out'
        }} />
      )}
      <main className="container">
        <Component {...pageProps} />
      </main>
      <style jsx global>{`
        @keyframes progress {
          0% { width: 0; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </LanguageProvider>
  )
}
