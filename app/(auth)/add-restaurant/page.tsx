import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"
import RestaurantInfoForm from "@/components/restaurant-info-form"

export default async function AddRestaurantPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login") // Only logged-in users can access
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Restaurant</h1>
          <p className="text-muted-foreground mt-2">Create a new restaurant to manage its menu</p>
        </div>

        <RestaurantInfoForm />
      </div>
    </div>
  )
}
