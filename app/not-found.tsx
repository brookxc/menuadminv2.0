import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">404 - Not Found</h1>
        <p className="mt-4 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild className="mt-8">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
