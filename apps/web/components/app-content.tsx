import { getPageData } from '@/lib/notion'
import { AppCard } from './app-card'

export const AppContent = async () => {
  const pageData = await getPageData()
  console.debug('[DEBUG__components/app-content.tsx-pageData]', pageData)

  if (!pageData || !pageData.items) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground italic text-lg">No apps found. Check your Notion database.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {Object.keys(pageData.items).map((groupTitle) => (
        <section key={groupTitle} className="relative">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black tracking-tight text-foreground capitalize">{groupTitle}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageData.items[groupTitle]?.map((item) => (
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
    </div>
  )
}
