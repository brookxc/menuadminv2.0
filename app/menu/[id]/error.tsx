"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">We couldn&apos;t load the restaurant menu. Please try again later.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
