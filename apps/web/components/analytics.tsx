'use client'

import { GoogleAnalytics } from '@next/third-parties/google'

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  if (!gaId) {
    return null
  }

  return <GoogleAnalytics gaId={gaId} />
}
