import { type Metadata } from 'next'
import { NextAuthProvider } from './context/nextAuthProvider'
import { CmsContextProvider } from './context/cms'
import { EnvContextProvider } from './context/env'
import { ThemeProvider } from './context/themeProvider'
import { CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_NAME,
  description: process.env.NEXT_PUBLIC_TITLE,
  openGraph: {
    title: process.env.NEXT_PUBLIC_NAME,
    description: process.env.NEXT_PUBLIC_TITLE,
    url: process.env.VERCEL_URL,
    siteName: process.env.NEXT_PUBLIC_NAME,
    images: [
      {
        url: process.env.OG_IMAGE || '',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: process.env.NEXT_PUBLIC_HEADSHOT || '',
    shortcut: process.env.NEXT_PUBLIC_HEADSHOT || '',
    apple: process.env.NEXT_PUBLIC_HEADSHOT || '',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: process.env.NEXT_PUBLIC_HEADSHOT || '',
    },
  },
  themeColor: process.env.NEXT_PUBLIC_ACCENT_COLOR,
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_NAME,
    description: process.env.NEXT_PUBLIC_TITLE,
    creator: '@s_pop3',
    images: [process.env.OG_IMAGE || ''],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <CssBaseline />
            <NextAuthProvider>
              <CmsContextProvider>
                <EnvContextProvider>{children}</EnvContextProvider>
              </CmsContextProvider>
            </NextAuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
