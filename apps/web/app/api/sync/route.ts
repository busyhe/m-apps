import { syncAllApps } from '@/lib/sync'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { results, updatedCount } = await syncAllApps()

    if (updatedCount > 0) {
      revalidateTag('notion-page-data', 'layout')
    }

    return NextResponse.json({ success: true, results, updatedCount })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
