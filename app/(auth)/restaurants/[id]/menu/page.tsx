import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"

import MenuBuilder from "@/components/menu-builder"
import { authOptions } from "@/lib/authOptions"
import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"

export default async function MenuPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return notFound()
  }

  try {
    await connectToDatabase()
    const restaurant = await Restaurant.findById(params.id)

    if (!restaurant) {
      return notFound()
    }

    // Convert MongoDB document to plain object and serialize for client components
    const restaurantData = JSON.parse(JSON.stringify(restaurant))

    return (
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{restaurantData.name} Menu</h1>
          <p className="text-muted-foreground">Add categories and menu items to create your digital menu</p>
        </div>

        <MenuBuilder restaurantId={params.id} initialMenuCategories={restaurantData.menuCategories || []} />
      </div>
    )
  } catch (error) {
    console.error("Error loading restaurant menu:", error)
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold tracking-tight">Error</h1>
        <p className="text-muted-foreground mt-2">Failed to load restaurant menu</p>
      </div>
    )
  }
}
