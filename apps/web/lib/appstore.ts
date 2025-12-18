import * as cheerio from 'cheerio'

export interface AppStoreInfo {
  name: string
  description: string
  logo: string
  url: string
}

export const fetchAppStoreInfo = async (appId: string): Promise<AppStoreInfo | null> => {
  const regions = (process.env.APPSTORE_REGIONS || 'cn').split(',').map((r) => r.trim())

  for (const region of regions) {
    const url = `https://apps.apple.com/${region}/app/${appId}`
    console.debug(`[DEBUG__lib/appstore.ts] Trying region ${region}: ${url}`)

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        }
      })

      if (!response.ok) {
        console.error(`Failed to fetch App Store page for ${appId} in region ${region}: ${response.statusText}`)
        continue
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Check for .page-error which indicates the app is not available in this region
      if ($('.page-error').length > 0) {
        console.warn(`App ${appId} not found in region ${region} (.page-error detected)`)
        continue
      }

      const name = $('.content-container h1').text().trim()
      const description = $('.content-container .subtitle').text().trim()
      const logo =
        $('.content-container picture source').attr('srcset')?.split(' ')[0] ||
        $('.content-container picture img').attr('src') ||
        ''

      // If we got a name, we consider it a success
      if (name) {
        return {
          name,
          description,
          logo,
          url
        }
      } else {
        console.warn(`Could not parse app name for ${appId} in region ${region}`)
      }
    } catch (error) {
      console.error(`Error fetching App Store info for ${appId} in region ${region}:`, error)
    }
  }

  return null
}
