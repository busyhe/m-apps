'use client'

import { Input } from '@workspace/ui/components/input'
import { SearchIcon } from 'lucide-react'
import { useSearchContext } from '../search-context'
import { cn } from '@workspace/ui/lib/utils'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useCallback } from 'react'

const THROTTLE_DELAY = 300

export function Search({ className }: { className?: string }) {
  const { searchQuery, setSearchQuery } = useSearchContext()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const throttleTimer = useRef<NodeJS.Timeout | null>(null)
  const lastValue = useRef<string>('')

  // Initialize search query from URL on mount
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || ''
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Throttled URL update
  const updateUrl = useCallback(
    (value: string) => {
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current)
      }
      throttleTimer.current = setTimeout(() => {
        if (value !== lastValue.current) {
          lastValue.current = value
          const params = new URLSearchParams(searchParams.toString())
          if (value) {
            params.set('q', value)
          } else {
            params.delete('q')
          }
          router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
      }, THROTTLE_DELAY)
    },
    [searchParams, router, pathname]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    updateUrl(value)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current)
      }
    }
  }, [])

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <Input type="text" placeholder="Search" className="w-full pr-8" value={searchQuery} onChange={handleChange} />
      <SearchIcon className="size-4 absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  )
}
