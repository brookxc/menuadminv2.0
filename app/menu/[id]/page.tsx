import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"
import MenuPreview from "@/components/menu-preview"

export default async function PublicMenuPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound()
  }

  try {
    await connectToDatabase()
    const restaurant = await Restaurant.findById(params.id)

    if (!restaurant) {
      notFound()
    }

    // Update the restaurantInfo object to include coverPhoto
    const restaurantInfo = {
      name: restaurant.name || "Restaurant",
      logo: restaurant.logo || null,
      coverPhoto: restaurant.coverPhoto || null,
      location: restaurant.location || "",
      description: restaurant.description || "",
      themeColor: restaurant.themeColor || "#3B82F6",
    }

    // Safely parse the menu categories
    const menuCategories = restaurant.menuCategories || []

    return (
      <div className="container mx-auto py-10 px-4">
        <MenuPreview restaurantInfo={restaurantInfo} menuData={JSON.parse(JSON.stringify(menuCategories))} />
      </div>
    )
  } catch (error) {
    console.error("Error loading restaurant menu:", error)
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Menu</h1>
        <p>Sorry, we couldn't load the menu. Please try again later.</p>
      </div>
    )
  }
}
