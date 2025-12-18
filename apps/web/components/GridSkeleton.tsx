import { Skeleton } from '@workspace/ui/components/skeleton'
import { Card, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'

export const GridSkeleton = () => {
  const titleWidths = ['w-20', 'w-24', 'w-28', 'w-32']
  const descriptionWidths = ['w-2/3', 'w-3/4', 'w-4/5', 'w-full']

  return (
    <div className="animate-pulse">
      <Skeleton className="h-7 w-24 mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="rounded-sm shadow-none border-accent">
            <CardHeader>
              <CardTitle className="flex items-center flex-row justify-between">
                <div className="flex items-center flex-row gap-2">
                  <Skeleton className="h-5 w-5 rounded-sm" />
                  <Skeleton className={`h-5 ${titleWidths[index % titleWidths.length]}`} />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </CardTitle>
              <CardDescription>
                <div className="space-y-2">
                  <Skeleton className={`h-4 ${descriptionWidths[index % descriptionWidths.length]}`} />
                  <Skeleton className={`h-4 ${descriptionWidths[(index + 1) % descriptionWidths.length]}`} />
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
