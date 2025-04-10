export default function MenuLoading() {
  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <div className="animate-pulse">
        <div className="h-12 w-48 bg-muted rounded-md mx-auto mb-6"></div>
        <div className="h-6 w-32 bg-muted rounded-md mx-auto mb-10"></div>

        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-32 bg-muted rounded-md mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="h-20 bg-muted rounded-md"></div>
            <div className="h-20 bg-muted rounded-md"></div>
          </div>

          <div className="h-8 w-32 bg-muted rounded-md mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 bg-muted rounded-md"></div>
            <div className="h-20 bg-muted rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
