import * as cheerio from 'cheerio'

export interface AppStoreInfo {
  name: string
  description: string
  logo: string
  url: string
}

export const fetchAppStoreInfo = async (appId: string): Promise<AppStoreInfo | null> => {
  const url = `https://apps.apple.com/cn/app/${appId}`

  console.debug('[DEBUG__lib/appstore.ts-url]', url)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    })

    if (!response.ok) {
      console.error(`Failed to fetch App Store page for ${appId}: ${response.statusText}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const name = $('.content-container h1').text().trim()
    const description = $('.content-container .subtitle').text().trim()
    const logo =
      $('.content-container picture source').attr('srcset')?.split(' ')[0] ||
      $('.content-container picture img').attr('src') ||
      ''

    return {
      name,
      description,
      logo,
      url
    }
  } catch (error) {
    console.error(`Error fetching App Store info for ${appId}:`, error)
    return null
  }
}
