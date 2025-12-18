import { PageData } from '@/lib/notion'
import { AppCard } from './app-card'

export const AppContent = ({ pageData }: { pageData: PageData }) => {
  if (!pageData || !pageData.items) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground italic text-lg">No apps found. Check your Notion database.</p>
      </div>
    )
  }

  return (
    <>
      {Object.keys(pageData.items).map((groupTitle) => (
        <section key={groupTitle} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{groupTitle}</h2>

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
    </>
  )
}
