import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AppContent } from '@/components/app-content'
import { getPageData } from '@/lib/notion'
import { syncAllApps } from '@/lib/sync'

export default async function Page() {
  // Trigger background sync if needed
  await syncAllApps()

  const pageData = await getPageData()

  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col min-h-svh">
      <SiteHeader title={pageData.title} icon={pageData.icon} />
      <main className="flex flex-1 flex-col container-wrapper p-4">
        <AppContent pageData={pageData} />
      </main>
      <SiteFooter />
    </div>
  )
}
