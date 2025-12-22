'use client'

import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Logo } from '@/components/logo'
import Image from 'next/image'

interface MainNavProps {
  title?: string
  icon?: string
}

const isEmoji = (str: string) => {
  return /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/u.test(
    str
  )
}

export function MainNav({ title, icon }: MainNavProps) {
  const isIconEmoji = icon && (isEmoji(icon) || icon.length <= 2)

  return (
    <div className="mr-4 md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        {icon ? (
          <div className="size-6 flex items-center justify-center shrink-0">
            {isIconEmoji ? (
              <span className="text-xl leading-none" role="img" aria-label="icon">
                {icon}
              </span>
            ) : (
              <div className="relative size-6 overflow-hidden rounded-sm">
                <Image src={icon} alt={title || 'Logo'} fill className="object-cover" unoptimized />
              </div>
            )}
          </div>
        ) : (
          <Logo className="size-6 rounded-sm shrink-0" />
        )}
        <span className="hidden font-bold md:inline-block">{title || siteConfig.name}</span>
      </Link>
    </div>
  )
}
