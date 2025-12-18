/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotionAPI } from 'notion-client'
import { idToUuid, getPageTitle, defaultMapImageUrl, getBlockIcon } from 'notion-utils'
import { unstable_cache } from 'next/cache'
import { Client } from '@notionhq/client'

// Initialize the Notion client for fetching (unofficial)
const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN,
  userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

// Initialize the official Notion client for updating
const officialNotion = new Client({
  auth: process.env.NOTION_TOKEN
})

// Helper function to get all page IDs from a collection
export default function getAllPageIds(
  collectionQuery: Record<string, any>,
  collectionId: string | undefined,
  collectionView: Record<string, any>,
  viewIds: string[] | undefined
) {
  if (!collectionQuery || !collectionId || !viewIds || viewIds.length === 0) {
    return []
  }

  try {
    const collectionData = collectionQuery[collectionId]
    if (!collectionData) return []

    const viewId = viewIds[0]
    if (!viewId) return []

    const view = collectionData[viewId] as any
    const tableGroups = view.table_groups || view.list_groups
    if (!view || !tableGroups || !tableGroups.results) return []

    const groups = []

    for (const group of tableGroups.results) {
      if (!group?.value?.value) continue

      const title = group.value.value.value || ''
      const items = view[`results:text:${title}`]?.blockIds || []

      groups.push({ title, items })
    }

    return groups
  } catch (error) {
    console.error('Error fetching page IDs:', error)
    return []
  }
}

// Helper function to map Notion image URLs
export function mapNotionImageUrl(url: string, block: any, recordMap?: any) {
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (url.startsWith('https://www.notion.so/image/')) return url

  // 1. Try to see if it's already in signed_urls
  if (recordMap?.signed_urls?.[url]) {
    return recordMap.signed_urls[url]
  }

  // 2. Use default mapping
  let mappedUrl = defaultMapImageUrl(url, block) || url

  // 3. Handle relative paths
  if (mappedUrl.startsWith('/image')) {
    mappedUrl = `https://www.notion.so${mappedUrl}`
  }

  // 4. Handle attachment: if mapping failed or needs specific table info
  if (url.startsWith('attachment:')) {
    const table = block.type === 'collection' ? 'collection' : 'block'
    const id = block.id
    console.debug('[DEBUG__lib/notion.ts-mappedUrl]', mappedUrl)
    if (!mappedUrl.includes('table=') || mappedUrl.includes('table=undefined')) {
      mappedUrl = `https://www.notion.so/image/${encodeURIComponent(url)}?table=${table}&id=${id}&cache=v2`
    }
  }

  return mappedUrl
}

// Helper function to get page properties
function getPageProperties(pageId: string, value: any, schema: any, recordMap?: any) {
  if (!value || !schema) return null

  const propertyMap: Record<string, any> = {}

  Object.keys(schema).forEach((key) => {
    const propertyValue = value.properties?.[key]?.[0]?.[0]
    const propertyName = schema[key]?.name

    if (propertyName) {
      propertyMap[propertyName.toLowerCase()] = propertyValue
    }
  })

  // Use getBlockIcon for more robust icon extraction (handles emojis, external, etc.)
  const icon = getBlockIcon(value, recordMap) || ''

  return {
    id: pageId,
    appId: propertyMap.id || '', // Apple Store ID
    title: propertyMap.title || propertyMap.name || '',
    desc: propertyMap.desc || propertyMap.description || '',
    link: propertyMap.link || propertyMap.url || '',
    logo: icon ? mapNotionImageUrl(icon, value, recordMap) : '',
    type: propertyMap.type || propertyMap.category || 'other'
  }
}

export interface AppItem {
  id: string // Notion record ID
  appId: string // Apple Store ID
  title: string
  desc: string
  link: string
  logo: string
  type: string
}

export interface PageData {
  title: string
  description: string
  icon: string
  items: Record<string, AppItem[]>
}

const getPageDataInternal = async (): Promise<PageData> => {
  if (!process.env.NOTION_PAGE_ID) {
    throw new Error('NOTION_PAGE_ID is not defined in environment variables')
  }

  const envPageId = process.env.NOTION_PAGE_ID
  const pageId = idToUuid(envPageId)

  try {
    const recordMap = await notion.getPage(pageId, {
      fetchCollections: true,
      fetchMissingBlocks: true
    })

    const collection = Object.values(recordMap.collection)[0]?.value
    const collectionQuery = recordMap.collection_query
    const block = recordMap.block
    const schema = collection?.schema
    const rawMetadata = block[pageId]?.value as any
    const collectionView = recordMap.collection_view
    const collectionId = Object.keys(recordMap.collection)[0]
    const viewIds = rawMetadata?.view_ids as string[] | undefined

    const title = getPageTitle(recordMap) || 'App Navigation'
    const description = rawMetadata?.format?.seo_description || ''
    const rawIcon = getBlockIcon(rawMetadata, recordMap) || ''

    const pageGroups = getAllPageIds(collectionQuery, collectionId || '', collectionView, viewIds || [])

    const itemsByGroup: Record<string, AppItem[]> = {}

    pageGroups
      .filter((group: { items: string[] }) => group.items?.length > 0)
      .forEach((group: { title: string; items: string[] }) => {
        const groupTitle = group.title || 'Other'
        if (!itemsByGroup[groupTitle]) {
          itemsByGroup[groupTitle] = []
        }

        group.items.forEach((id: string) => {
          const blockItem = block[id]
          if (!blockItem) return

          const value = blockItem.value
          if (!value) return

          const props = getPageProperties(id, value, schema, recordMap)
          if (!props) return

          itemsByGroup[groupTitle]!.push(props as AppItem)
        })
      })

    console.debug('[DEBUG__lib/notion.ts-collectionId]', collectionId)
    return {
      title,
      description,
      icon: rawIcon ? mapNotionImageUrl(rawIcon, { id: collectionId, type: 'collection' }, recordMap) : '',
      items: itemsByGroup
    }
  } catch (error) {
    console.error('Error fetching Notion data:', error)
    throw error
  }
}

export const getPageData = unstable_cache(
  async () => {
    return getPageDataInternal()
  },
  ['notion-page-data'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['notion-page-data']
  }
)

// Function to update Notion record with App Store data
export const updateNotionApp = async (pageId: string, data: Partial<AppItem>) => {
  const properties: any = {}

  if (data.title) {
    properties.title = {
      title: [{ text: { content: data.title } }]
    }
  }

  if (data.desc) {
    // Assuming the property name in Notion is 'desc'
    properties.desc = {
      rich_text: [{ text: { content: data.desc } }]
    }
  }

  if (data.link) {
    properties.link = {
      url: data.link
    }
  }

  if (data.logo) {
    properties.logo = {
      url: data.logo
    }
  }

  try {
    await officialNotion.pages.update({
      page_id: pageId,
      properties
    })
    return true
  } catch (error) {
    console.error(`Error updating Notion page ${pageId}:`, error)
    return false
  }
}
