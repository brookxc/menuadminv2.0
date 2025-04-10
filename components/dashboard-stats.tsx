"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Store, Utensils, ListOrdered, Clock, ArrowRight, TrendingUp, BarChart3, Lock, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type DashboardStatsProps = {
  restaurantCount: number
  menuItemsCount: number
  categoryCount: number
  lockedRestaurantsCount: number
  latestRestaurant: {
    _id: string
    name: string
    location: string
    logo: string | null
    createdAt: string
  } | null
}

export default function DashboardStats({
  restaurantCount,
  menuItemsCount,
  categoryCount,
  lockedRestaurantsCount,
  latestRestaurant,
}: DashboardStatsProps) {
  const [timeframe] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Unknown date"
      }
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Unknown date"
    }
  }

  const refreshData = () => {
    setIsRefreshing(true)
    // Force a refresh of the page data
    router.refresh()
    // Reset the refreshing state after a short delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurantCount}</div>
            <p className="text-xs text-muted-foreground">{timeframe === "all" ? "All time" : "Last 30 days"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Restaurants</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lockedRestaurantsCount}</div>
            <p className="text-xs text-muted-foreground">
              {restaurantCount > 0
                ? `${Math.round((lockedRestaurantsCount / restaurantCount) * 100)}% of total`
                : "No restaurants yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItemsCount}</div>
            <p className="text-xs text-muted-foreground">
              {menuItemsCount > 0 && restaurantCount > 0
                ? `~${Math.round(menuItemsCount / restaurantCount)} per restaurant`
                : "No items yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
            <p className="text-xs text-muted-foreground">
              {categoryCount > 0 && restaurantCount > 0
                ? `~${Math.round(categoryCount / restaurantCount)} per restaurant`
                : "No categories yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryCount > 0 ? (menuItemsCount / categoryCount).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Items per category</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your most recently added restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            {latestRestaurant ? (
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                  {latestRestaurant.logo ? (
                    <Image
                      src={latestRestaurant.logo || "/placeholder.svg"}
                      alt={latestRestaurant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Store className="h-6 w-6 m-3 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{latestRestaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">{latestRestaurant.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 inline-block mr-1" />
                    Added {latestRestaurant.createdAt ? formatDate(latestRestaurant.createdAt) : "recently"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No restaurants added yet</div>
            )}
          </CardContent>
          {latestRestaurant && (
            <CardFooter>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/restaurants/${latestRestaurant._id}/menu`}>
                  Manage Menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/add-restaurant">
                <Store className="mr-2 h-4 w-4" />
                Add New Restaurant
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/restaurants">
                <TrendingUp className="mr-2 h-4 w-4" />
                View All Restaurants
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
