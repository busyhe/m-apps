import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { MainNav } from '@/components/header/main-nav'
import { ModeSwitcher } from '@/components/header/mode-switcher'
import { Button } from '@workspace/ui/components/button'
import { Github } from 'lucide-react'
import { Search } from './header/Search'

interface SiteHeaderProps {
  title?: string
  icon?: string
}

export function SiteHeader({ title, icon }: SiteHeaderProps) {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center gap-2 md:gap-4">
          <MainNav title={title} icon={icon} />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <nav className="flex items-center gap-0.5">
              <Search className="mr-2" />
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
                <Link href={siteConfig.url} target="_blank" rel="noreferrer">
                  <Github className="size-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
