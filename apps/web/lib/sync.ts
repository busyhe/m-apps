import { getPageData, updateNotionApp, IS_SYNC_ENABLED } from './notion'
import { fetchAppStoreInfo } from './appstore'

export const syncAllApps = async () => {
  if (!IS_SYNC_ENABLED) {
    console.log('Sync is disabled: NOTION_TOKEN is missing')
    return { results: [], updatedCount: 0, message: 'Sync is disabled' }
  }

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
