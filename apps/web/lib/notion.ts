/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotionAPI } from 'notion-client'
import { idToUuid, getPageTitle, defaultMapImageUrl, getBlockIcon } from 'notion-utils'
import { cache } from 'react'
import { Client } from '@notionhq/client'
import { ExtendedRecordMap } from 'notion-types'

// Initialize the Notion client for fetching (unofficial)
export const IS_SYNC_ENABLED = !!process.env.NOTION_TOKEN

const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN,
  userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

// Initialize the official Notion client for updating
const officialNotion = new Client({
  auth: process.env.NOTION_TOKEN
})

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

// ─────────────────────────────────────────────────────────────────────────────
// Record map normalization
//
// The current Notion private API wraps records as either:
//   { spaceId, value: { value: <real>, role } }   ← new
//   { value: <real>, role }                       ← legacy
// We flatten everything to the legacy shape so downstream code (and
// react-notion-x utilities) can keep accessing `entry.value.<field>`.
// ─────────────────────────────────────────────────────────────────────────────

function normalizeMap(map: Record<string, any> | undefined) {
  if (!map) return
  for (const key of Object.keys(map)) {
    const entry = map[key]
    if (
      entry?.value &&
      typeof entry.value === 'object' &&
      entry.value.value &&
      typeof entry.value.value === 'object' &&
      entry.value.value.id
    ) {
      map[key] = {
        value: entry.value.value,
        role: entry.value.role ?? entry.role ?? 'reader'
      }
    }
    // Strip CRDT fields that confuse react-notion-x
    const v = map[key]?.value
    if (v && typeof v === 'object') {
      delete v.crdt_data
      delete v.crdt_format_version
    }
  }
}

export function normalizeRecordMap(recordMap: ExtendedRecordMap): void {
  normalizeMap(recordMap.block as any)
  normalizeMap(recordMap.collection as any)
  normalizeMap(recordMap.collection_view as any)
}

// ─────────────────────────────────────────────────────────────────────────────
// Image URL mapping
// ─────────────────────────────────────────────────────────────────────────────

export function mapNotionImageUrl(url: string, block: any, recordMap?: any) {
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (url.startsWith('https://www.notion.so/image/')) return url

  if (recordMap?.signed_urls?.[url]) {
    return recordMap.signed_urls[url]
  }

  let mappedUrl = defaultMapImageUrl(url, block) || url

  if (mappedUrl.startsWith('/image')) {
    mappedUrl = `https://www.notion.so${mappedUrl}`
  }

  if (url.startsWith('attachment:')) {
    const table = block.type === 'collection' ? 'collection' : 'block'
    const id = block.id
    if (!mappedUrl.includes('table=') || mappedUrl.includes('table=undefined')) {
      mappedUrl = `https://www.notion.so/image/${encodeURIComponent(url)}?table=${table}&id=${id}&cache=v2`
    }
  }

  return mappedUrl
}

// ─────────────────────────────────────────────────────────────────────────────
// Property extraction
// ─────────────────────────────────────────────────────────────────────────────

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

  const icon = getBlockIcon(value, recordMap) || ''

  return {
    id: pageId,
    appId: propertyMap.id || '',
    title: propertyMap.title || propertyMap.name || '',
    desc: propertyMap.desc || propertyMap.description || '',
    link: propertyMap.link || propertyMap.url || '',
    logo: icon ? mapNotionImageUrl(icon, value, recordMap) : '',
    type: propertyMap.type || propertyMap.category || 'other'
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Collection data extraction
//
// As of late 2025, `notion.getPage()` no longer populates `collection_query`
// for collection_view_pages and only returns the parent page block. We must
// explicitly call `getCollectionData` to fetch:
//   - the actual row blocks (in result.recordMap.block)
//   - the group → blockIds mapping (in result.result.reducerResults)
// ─────────────────────────────────────────────────────────────────────────────

interface GroupedItems {
  title: string
  blockIds: string[]
}

/**
 * Extract grouped block IDs from a collection query result. Falls back to a
 * single ungrouped bucket using `allBlockIds` if no group reducer is present.
 */
function extractGroups(collectionInstance: any): GroupedItems[] {
  const reducerResults = collectionInstance?.result?.reducerResults || {}

  // Find the *_groups reducer (table_groups, list_groups, board_columns, etc.)
  const groupsKey = Object.keys(reducerResults).find((k) => k.endsWith('_groups') || k === 'board_columns')

  if (groupsKey) {
    const groupsReducer = reducerResults[groupsKey]
    const groupResults = groupsReducer?.results || groupsReducer?.groupResults || []

    const out: GroupedItems[] = []
    for (const group of groupResults) {
      // group.value can be either:
      //   { type: 'text', value: { type: 'exact', value: '效率' } }   ← current
      //   { type: 'text', value: '效率' }                              ← simpler
      const propType = group?.value?.type
      const rawValue = group?.value?.value
      const groupTitle = (rawValue && typeof rawValue === 'object' ? rawValue.value : rawValue) ?? 'uncategorized'

      const resultsKey = `results:${propType}:${groupTitle}`
      const blockIds: string[] = reducerResults[resultsKey]?.blockIds || []
      if (blockIds.length > 0) {
        out.push({ title: String(groupTitle), blockIds })
      }
    }
    if (out.length > 0) return out
  }

  // Fallback: use allBlockIds (ungrouped)
  const allBlockIds: string[] =
    collectionInstance?.allBlockIds ||
    collectionInstance?.result?.blockIds ||
    reducerResults?.collection_group_results?.blockIds ||
    []
  if (allBlockIds.length > 0) {
    return [{ title: '', blockIds: allBlockIds }]
  }

  return []
}

// ─────────────────────────────────────────────────────────────────────────────
// Main fetch
// ─────────────────────────────────────────────────────────────────────────────

const getPageDataInternal = async (): Promise<PageData> => {
  if (!process.env.NOTION_PAGE_ID) {
    throw new Error('NOTION_PAGE_ID is not defined in environment variables')
  }

  const pageId = idToUuid(process.env.NOTION_PAGE_ID)

  try {
    // 1. Fetch the parent page (gives us the page block + collection + view metadata)
    const recordMap = await notion.getPage(pageId, {
      fetchCollections: true,
      fetchMissingBlocks: true
    })
    normalizeRecordMap(recordMap)

    const collectionId = Object.keys(recordMap.collection || {})[0]
    const collection = collectionId ? recordMap.collection[collectionId]?.value : undefined
    const schema = (collection as any)?.schema

    const pageBlockMeta = recordMap.block[pageId]?.value as any
    const viewIds = (pageBlockMeta?.view_ids as string[] | undefined) || []
    const viewId = viewIds[0]
    const viewValue = viewId ? (recordMap.collection_view[viewId]?.value as any) : undefined

    const title = getPageTitle(recordMap) || 'App Navigation'
    const description = pageBlockMeta?.format?.seo_description || ''
    const rawIcon = getBlockIcon(pageBlockMeta, recordMap) || ''

    // 2. Explicitly fetch the collection rows (the page block alone has none)
    const itemsByGroup: Record<string, AppItem[]> = {}

    if (collectionId && viewId && viewValue) {
      const collectionInstance: any = await notion.getCollectionData(collectionId, viewId, viewValue, {
        loadContentCover: true
      })

      // Merge fetched row blocks into the main record map (after normalization)
      if (collectionInstance?.recordMap?.block) {
        Object.assign(recordMap.block, collectionInstance.recordMap.block)
        normalizeRecordMap(recordMap)
      }

      const groups = extractGroups(collectionInstance)

      for (const group of groups) {
        for (const id of group.blockIds) {
          const blockItem = recordMap.block[id]
          const value = blockItem?.value
          if (!value) continue

          const props = getPageProperties(id, value, schema, recordMap)
          if (!props) continue

          // Prefer the property's own category; fall back to the view group title.
          const groupTitle = (props.type as string) || group.title || 'Other'
          if (!itemsByGroup[groupTitle]) itemsByGroup[groupTitle] = []
          itemsByGroup[groupTitle]!.push(props as AppItem)
        }
      }
    }

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

export const getPageData = cache(getPageDataInternal)

// ─────────────────────────────────────────────────────────────────────────────
// Notion update (official API)
// ─────────────────────────────────────────────────────────────────────────────

export const updateNotionApp = async (pageId: string, data: Partial<AppItem>) => {
  const properties: any = {}

  if (data.title) {
    properties.title = { title: [{ text: { content: data.title } }] }
  }
  if (data.desc) {
    properties.desc = { rich_text: [{ text: { content: data.desc } }] }
  }
  if (data.link) {
    properties.link = { url: data.link }
  }

  try {
    const updatePayload: any = { page_id: pageId, properties }
    if (data.logo) {
      updatePayload.icon = { type: 'external', external: { url: data.logo } }
    }
    await officialNotion.pages.update(updatePayload)
    return true
  } catch (error) {
    console.error(`Error updating Notion page ${pageId}:`, error)
    return false
  }
}
