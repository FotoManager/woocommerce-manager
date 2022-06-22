import './../styles/globals.css'

import type { AppProps } from 'next/app'

import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import LoaderPage from '../components/loader/LoaderPage'

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const handleStart = (url) =>{ 
        setLoading(true);
      }
      const handleComplete = (url) => {
        setLoading(false);
      }
      
      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError', handleComplete)

      return () => {
          router.events.off('routeChangeStart', handleStart)
          router.events.off('routeChangeComplete', handleComplete)
          router.events.off('routeChangeError', handleComplete)
      }
  }, [router.asPath, router.events])

  return (
    <ApolloProvider client={apolloClient}>
      {
        loading ? ( <LoaderPage text="Redirigiendo" /> ) : ( <Component {...pageProps} /> )
      }
    </ApolloProvider>
  )
}