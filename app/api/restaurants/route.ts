import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"

// GET all restaurants
export async function GET() {
  try {
    await connectToDatabase()
    const restaurants = await Restaurant.find({}).sort({ createdAt: -1 })
    return NextResponse.json(restaurants)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch restaurants",
      },
      { status: 500 },
    )
  }
}

// POST create a new restaurant
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const data = await request.json()

    const restaurant = new Restaurant({
      name: data.name,
      location: data.location,
      description: data.description || "",
      logo: data.logo || null,
      themeColor: data.themeColor || "#3B82F6", // Default blue if not provided
      menuCategories: data.menuCategories || [],
    })

    await restaurant.save()
    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error("Error creating restaurant:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create restaurant",
      },
      { status: 500 },
    )
  }
}
