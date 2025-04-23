import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"
import RestaurantList from "@/components/restaurant-list"

export default async function RestaurantsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login") // Redirect unauthenticated users
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Restaurants</h1>
          <p className="text-muted-foreground mt-2">Manage your restaurant menus</p>
        </div>

        <RestaurantList />
      </div>
    </div>
  )
}
