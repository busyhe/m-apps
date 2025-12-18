import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AppContent } from '@/components/app-content'
import { Suspense } from 'react'
import { getPageData } from '@/lib/notion'

export default async function Page() {
  const pageData = await getPageData()

  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col min-h-svh bg-[#FAFAFA] dark:bg-[#050505]">
      <SiteHeader title={pageData.title} icon={pageData.icon} />
      <main className="flex flex-1 flex-col container-wrapper">
        <div className="container py-12 px-4 md:px-6">
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }
          >
            <AppContent />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
