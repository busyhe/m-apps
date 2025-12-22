'use client'

import { PageData, AppItem } from '@/lib/notion'
import { AppCard } from './app-card'
import { useSearchContext } from './search-context'

export const AppContent = ({ pageData }: { pageData: PageData }) => {
  const { searchQuery } = useSearchContext()

  let filteredItems: Record<string, AppItem[]> = {}

  if (!searchQuery.trim()) {
    filteredItems = pageData.items
  } else {
    filteredItems = Object.entries(pageData.items || {}).reduce(
      (acc, [groupTitle, items]) => {
        const matches = (items || []).filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (matches.length > 0) {
          acc[groupTitle] = matches
        }

        return acc
      },
      {} as Record<string, AppItem[]>
    )
  }

  const hasResults = Object.keys(filteredItems).length > 0

  if (!hasResults) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground italic text-lg">
          {searchQuery ? `No apps found for "${searchQuery}".` : 'No apps found. Check your Notion database.'}
        </p>
      </div>
    )
  }

  return (
    <>
      {Object.entries(filteredItems).map(([groupTitle, items]) => (
        <section key={groupTitle} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{groupTitle}</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <AppCard
                key={item.id}
                title={item.title}
                description={item.desc}
                href={item.link}
                logo={item.logo}
                category={item.type}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
