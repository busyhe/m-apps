import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="border-grid border-t">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left flex justify-between">
            <span>
              Built by{' '}
              <a
                href={siteConfig.links.homepage}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                busyhe
              </a>
              .
            </span>
            <span>
              The source code is available on{' '}
              <a
                href={siteConfig.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
