import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"

// GET a single restaurant
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const restaurant = await Restaurant.findById(params.id)

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error(`Error fetching restaurant ${params.id}:`, error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch restaurant",
      },
      { status: 500 },
    )
  }
}

// PUT update a restaurant
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const data = await request.json()

    // Check if we're updating menu categories only
    const updateData =
      data.menuCategories !== undefined
        ? { menuCategories: data.menuCategories }
        : {
            name: data.name,
            location: data.location,
            description: data.description,
            logo: data.logo,
            coverPhoto: data.coverPhoto,
            themeColor: data.themeColor,
          }

    const restaurant = await Restaurant.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error(`Error updating restaurant ${params.id}:`, error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update restaurant",
      },
      { status: 500 },
    )
  }
}

// DELETE a restaurant
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const restaurant = await Restaurant.findByIdAndDelete(params.id)

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Restaurant deleted successfully" })
  } catch (error) {
    console.error(`Error deleting restaurant ${params.id}:`, error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete restaurant",
      },
      { status: 500 },
    )
  }
}
