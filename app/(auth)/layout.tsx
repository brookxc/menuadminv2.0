import type React from "react"
import MainNav from "@/components/main-nav"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MainNav />
      <main>{children}</main>
    </>
  )
}
