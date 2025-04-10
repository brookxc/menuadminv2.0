import RestaurantList from "@/components/restaurant-list"

export default function RestaurantsPage() {
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
