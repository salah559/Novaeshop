
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '@/components/Header'
import { LanguageProvider } from '@/lib/LanguageContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Header />
      <main className="container">
        <Component {...pageProps} />
      </main>
    </LanguageProvider>
  )
}
