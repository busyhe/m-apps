'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRightIcon, Image as ImageIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

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
    <Card
      className={cn(
        'group hover:shadow-md transition-shadow shadow-none rounded-2xl',
        // Use pure CSS @supports to detect corner-shape (squircle) support.
        // If supported, use rounded-4xl and apply the squircle shape; otherwise fall back to rounded-2xl.
        'supports-[corner-shape:squircle]:rounded-4xl supports-[corner-shape:squircle]:[corner-shape:squircle]'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center flex-row justify-between">
          <div className="flex items-center flex-row gap-2">
            {logo ? (
              isLogoEmoji ? (
                <span className="text-3xl" role="img" aria-label="icon">
                  {logo}
                </span>
              ) : (
                <Image
                  src={logo}
                  alt={title}
                  width={28}
                  height={28}
                  className="object-cover overflow-hidden shrink-0"
                  unoptimized
                />
              )
            ) : (
              <div className="w-7 h-7 bg-secondary rounded flex items-center justify-center" />
            )}
            <span>{title}</span>
          </div>

          <Link href={href} target="_blank" rel="noopener noreferrer" className="block">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity max-sm:opacity-100 max-sm:bg-accent"
            >
              <ArrowUpRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
