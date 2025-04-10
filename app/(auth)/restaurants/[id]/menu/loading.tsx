import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MenuLoading() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>

      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Menu Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="builder" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-6 w-48 mt-4" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
