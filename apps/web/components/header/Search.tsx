'use client'

import { Input } from '@workspace/ui/components/input'
import { SearchIcon } from 'lucide-react'
import { useSearchContext } from '../search-context'

export function Search() {
  const { searchQuery, setSearchQuery } = useSearchContext()

  return (
    <div className="relative flex items-center gap-2">
      <Input
        type="text"
        placeholder="Search"
        className="w-full pr-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchIcon className="size-4 absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  )
}
