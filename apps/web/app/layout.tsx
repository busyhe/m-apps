import { Metadata } from 'next'
import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import { fontSans, fontMono } from '@/lib/fonts'
import { siteConfig } from '@/config/site'
import { getPageData } from '@/lib/notion'
import { Analytics } from '@/components/analytics'

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData()
  const title = pageData.title || siteConfig.name
  const description = pageData.description || siteConfig.description
  const icon = pageData.icon || '/favicon.ico'

  return {
    title: {
      default: title,
      template: `%s - ${title}`
    },
    metadataBase: new URL(siteConfig.url),
    description: description,
    keywords: ['Next.js', 'React'],
    authors: [
      {
        name: 'busyhe',
        url: 'https://github.com/busyhe'
      }
    ],
    creator: 'busyhe',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: title,
      description: description,
      siteName: title,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [siteConfig.ogImage],
      creator: '@busyhe'
    },
    icons: {
      icon: icon,
      shortcut: icon
    }
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
