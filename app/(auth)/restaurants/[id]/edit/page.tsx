import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"
import RestaurantInfoForm from "@/components/restaurant-info-form"

export default async function EditRestaurantPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound()
  }

  try {
    await connectToDatabase()
    const restaurant = await Restaurant.findById(params.id)

    if (!restaurant) {
      notFound()
    }

    // Convert MongoDB document to plain object and serialize for client components
    const restaurantData = JSON.parse(JSON.stringify(restaurant))

    return (
      <div className="container mx-auto py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit Restaurant</h1>
            <p className="text-muted-foreground mt-2">Update your restaurant information</p>
          </div>

          <RestaurantInfoForm restaurant={restaurantData} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading restaurant:", error)
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Error</h1>
            <p className="text-muted-foreground mt-2">Failed to load restaurant information</p>
          </div>
        </div>
      </div>
    )
  }
}
