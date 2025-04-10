import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function EditRestaurantLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-md" />
                    <div>
                      <Skeleton className="h-9 w-32" />
                      <Skeleton className="h-4 w-48 mt-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
