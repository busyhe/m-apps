import { getPageData, updateNotionApp } from './notion'
import { fetchAppStoreInfo } from './appstore'

export const syncAllApps = async () => {
  try {
    const data = await getPageData()
    const allItems = Object.values(data.items).flat()

    let updatedCount = 0
    const results = []

    for (const item of allItems) {
      if (item.appId && !item.title) {
        const appInfo = await fetchAppStoreInfo(item.appId)

        if (appInfo) {
          const success = await updateNotionApp(item.id, {
            title: appInfo.name,
            desc: appInfo.description,
            link: appInfo.url,
            logo: appInfo.logo
          })

          if (success) {
            updatedCount++
          }

          results.push({
            id: item.id,
            appId: item.appId,
            success,
            title: appInfo.name
          })
        } else {
          results.push({
            id: item.id,
            appId: item.appId,
            success: false,
            error: 'Failed to fetch App Store info'
          })
        }
      }
    }

    return { results, updatedCount }
  } catch (error) {
    console.error('Error in syncAllApps:', error)
    throw error
  }
}
