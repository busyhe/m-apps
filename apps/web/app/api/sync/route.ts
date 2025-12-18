import { syncAllApps } from '@/lib/sync'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const results = await syncAllApps()
    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
