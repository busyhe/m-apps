import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AppContent } from '@/components/app-content'
import { getPageData } from '@/lib/notion'
import { syncAllApps } from '@/lib/sync'

export const dynamic = 'force-dynamic'

export default async function Page() {
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
