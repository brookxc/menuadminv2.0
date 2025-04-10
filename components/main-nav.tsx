"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Store, PlusCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Your Restaurants",
      href: "/restaurants",
      icon: Store,
      active: pathname === "/restaurants" || pathname === "/",
    },
    {
      name: "Add New Restaurant",
      href: "/add-restaurant",
      icon: PlusCircle,
      active: pathname === "/add-restaurant",
    },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="mr-6 font-bold">Restaurant Menu Builder</div>
          <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center",
                  item.active
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200",
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {session && (
          <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <span>Logout</span>
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
