import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"

// PUT update a restaurant's lock status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const data = await request.json()

    // Validate the lock status
    if (typeof data.locked !== "boolean") {
      return NextResponse.json({ error: "Invalid lock status" }, { status: 400 })
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      params.id,
      { locked: data.locked },
      { new: true, runValidators: true },
    )

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error(`Error updating restaurant lock status ${params.id}:`, error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update restaurant lock status",
      },
      { status: 500 },
    )
  }
}
