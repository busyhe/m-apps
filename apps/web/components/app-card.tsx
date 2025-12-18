'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRightIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

interface AppCardProps {
  title: string
  description: string
  href: string
  logo: string
  category: string
}

const isEmoji = (str: string) => {
  return /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/u.test(
    str
  )
}

export function AppCard({ title, description, href, logo, category }: AppCardProps) {
  const isLogoEmoji = logo && (isEmoji(logo) || logo.length <= 2)

  return (
    <div className="group relative flex flex-col p-5 bg-card hover:bg-accent/50 transition-all rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-muted shrink-0 flex items-center justify-center">
          {logo ? (
            isLogoEmoji ? (
              <span className="text-3xl" role="img" aria-label="icon">
                {logo}
              </span>
            ) : (
              <Image src={logo} alt={title} fill className="object-cover" unoptimized />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <span className="text-xs">No Logo</span>
            </div>
          )}
        </div>

        <Link href={href} target="_blank" rel="noopener noreferrer">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 transition-all"
          >
            <ArrowUpRightIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-card-foreground line-clamp-1 mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">{description}</p>
      </div>

      {/* Glossy overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
    </div>
  )
}
