"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Upload, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  description: z.string().optional(),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
})

type RestaurantInfoFormProps = {
  restaurant?: {
    _id: string
    name: string
    location: string
    description: string
    logo: string | null
    themeColor?: string
  }
}

export default function RestaurantInfoForm({ restaurant }: RestaurantInfoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [logoPreview, setLogoPreview] = useState<string | null>(restaurant?.logo || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: restaurant?.name || "",
      location: restaurant?.location || "",
      description: restaurant?.description || "",
      themeColor: restaurant?.themeColor || "#3B82F6", // Default blue color
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      const restaurantData = {
        name: values.name,
        location: values.location,
        description: values.description || "",
        logo: logoPreview,
        themeColor: values.themeColor,
      }

      let response
      let endpoint

      if (restaurant?._id) {
        // Update existing restaurant
        endpoint = `/api/restaurants/${restaurant._id}`
        response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(restaurantData),
        })
      } else {
        // Create new restaurant
        endpoint = "/api/restaurants"
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(restaurantData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to save restaurant: ${response.status}`)
      }

      toast({
        title: restaurant?._id ? "Restaurant updated" : "Restaurant created",
        description: restaurant?._id
          ? "Your restaurant information has been updated."
          : "Your restaurant has been created successfully.",
      })

      if (restaurant?._id) {
        router.refresh()
      } else {
        router.push(`/restaurants`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save restaurant information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter restaurant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label
                  htmlFor="logo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Restaurant Logo
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                    {logoPreview ? (
                      <Image
                        src={logoPreview || "/placeholder.svg"}
                        alt="Restaurant logo preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      Upload Logo
                    </Button>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <p className="text-sm text-muted-foreground mt-2">Upload a square image for best results.</p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="123 Main St, City, Country" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell customers about your restaurant..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="themeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Palette className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="#3B82F6" {...field} />
                        </div>
                        <Input
                          type="color"
                          className="h-10 w-20 p-1 cursor-pointer"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      This color will be used as the theme for your restaurant&apos;s menu display.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : restaurant?._id ? "Update Restaurant" : "Create Restaurant"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
