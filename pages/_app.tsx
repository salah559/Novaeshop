
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '@/components/Header'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ToastContainer } from '@/components/Toast'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <ToastContainer />
      <Header />
      <Breadcrumbs />
      <main className="container">
        <Component {...pageProps} />
      </main>
    </LanguageProvider>
  )
}
