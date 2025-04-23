import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"
import DashboardStats from "@/components/dashboard-stats"
import { unstable_noStore } from "next/cache"
// authentication
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"


export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login") // redirect if not logged in
  }
  // Prevent caching of this page
  unstable_noStore()

  await connectToDatabase()

  // Get restaurant count
  const restaurantCount = await Restaurant.countDocuments({})

  // Get locked restaurants count
  const lockedRestaurantsCount = await Restaurant.countDocuments({ locked: true })

  // Get total menu items count across all restaurants
  const restaurants = await Restaurant.find({})
  const menuItemsCount = restaurants.reduce((total, restaurant) => {
    return (
      total +
      restaurant.menuCategories.reduce(
        (categoryTotal: number, category: { items?: unknown[] }) => {
        return categoryTotal + (category.items?.length || 0)
      }, 0)
    )
  }, 0)

  // Get category count
  const categoryCount = restaurants.reduce((total, restaurant) => {
    return total + (restaurant.menuCategories?.length || 0)
  }, 0)

  // Get most recent restaurant
  let latestRestaurant = null
  if (restaurants.length > 0) {
    try {
      // Sort by createdAt if available, otherwise use _id (which has a timestamp)
      latestRestaurant = restaurants.sort((a, b) => {
        try {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        } catch (error) {
          return 0
        }
      })[0]

      // Ensure createdAt is a valid date string
      if (latestRestaurant) {
        const serialized = JSON.parse(JSON.stringify(latestRestaurant))
        // If createdAt is missing or invalid, use current date
        if (!serialized.createdAt || isNaN(new Date(serialized.createdAt).getTime())) {
          serialized.createdAt = new Date().toISOString()
        }
        latestRestaurant = serialized
      }
    } catch (error) {
      console.error("Error processing latest restaurant:", error)
      latestRestaurant = null
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your restaurant menu system</p>
      </div>

      <DashboardStats
        restaurantCount={restaurantCount}
        menuItemsCount={menuItemsCount}
        categoryCount={categoryCount}
        lockedRestaurantsCount={lockedRestaurantsCount}
        latestRestaurant={latestRestaurant}
      />
    </div>
  )
}
