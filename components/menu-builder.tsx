"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2, ImageIcon, Save, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import MenuPreview from "./menu-preview"

type MenuItem = {
  _id?: string
  name: string
  description: string
  price: string
  image: string | null
}

type MenuCategory = {
  _id?: string
  name: string
  items: MenuItem[]
}

type MenuBuilderProps = {
  restaurantId: string
  initialMenuCategories: MenuCategory[]
}

export default function MenuBuilder({ restaurantId, initialMenuCategories }: MenuBuilderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(initialMenuCategories || [])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("builder")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)
  const [showDeleteCategoryAlert, setShowDeleteCategoryAlert] = useState(false)

  // Fetch restaurant info for preview
  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`)
        if (response.ok) {
          const data = await response.json()
          setRestaurantInfo({
            name: data.name,
            logo: data.logo,
            location: data.location,
            description: data.description,
          })
        }
      } catch (error) {
        console.error("Failed to fetch restaurant info", error)
      }
    }

    fetchRestaurantInfo()
  }, [restaurantId])

  const addCategory = () => {
    if (newCategoryName.trim() === "") return

    const newCategory: MenuCategory = {
      name: newCategoryName,
      items: [],
    }

    setMenuCategories([...menuCategories, newCategory])
    setNewCategoryName("")
  }

  const confirmDeleteCategory = (index: number) => {
    setCategoryToDelete(index)
    setShowDeleteCategoryAlert(true)
  }

  const removeCategory = () => {
    if (categoryToDelete === null) return

    const updatedCategories = [...menuCategories]
    updatedCategories.splice(categoryToDelete, 1)
    setMenuCategories(updatedCategories)
    setCategoryToDelete(null)
    setShowDeleteCategoryAlert(false)
  }

  const addMenuItem = (categoryIndex: number) => {
    const newItem: MenuItem = {
      name: "",
      description: "",
      price: "",
      image: null,
    }

    setEditingItem(newItem)
    setEditingCategoryId(categoryIndex.toString())
    setEditingItemIndex(null)
    setIsDialogOpen(true)
  }

  const editMenuItem = (categoryIndex: number, itemIndex: number) => {
    const item = menuCategories[categoryIndex].items[itemIndex]
    setEditingItem({ ...item })
    setEditingCategoryId(categoryIndex.toString())
    setEditingItemIndex(itemIndex)
    setIsDialogOpen(true)
  }

  const saveMenuItem = () => {
    if (!editingItem || editingCategoryId === null) return

    // Ensure description is at least an empty string if not provided
    const itemToSave = {
      ...editingItem,
      description: editingItem.description || "",
    }

    const categoryIndex = Number.parseInt(editingCategoryId)
    const updatedCategories = [...menuCategories]

    if (editingItemIndex !== null) {
      // Update existing item
      updatedCategories[categoryIndex].items[editingItemIndex] = itemToSave
    } else {
      // Add new item
      updatedCategories[categoryIndex].items.push(itemToSave)
    }

    setMenuCategories(updatedCategories)
    setIsDialogOpen(false)
    setEditingItem(null)
    setEditingCategoryId(null)
    setEditingItemIndex(null)
  }

  const removeMenuItem = (categoryIndex: number, itemIndex: number) => {
    const updatedCategories = [...menuCategories]
    updatedCategories[categoryIndex].items.splice(itemIndex, 1)
    setMenuCategories(updatedCategories)
  }

  const handleItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingItem) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditingItem({
          ...editingItem,
          image: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const saveMenu = async () => {
    try {
      setIsSaving(true)

      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuCategories: menuCategories,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to save menu: ${response.status}`)
      }

      toast({
        title: "Menu saved",
        description: "Your menu has been saved successfully.",
      })

      // Show success alert
      setShowSuccessAlert(true)

      // Switch to preview tab
      setActiveTab("preview")

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save menu",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Menu Saved Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your menu has been saved successfully. You can now view it in the preview tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={showDeleteCategoryAlert} onOpenChange={setShowDeleteCategoryAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? All items in this category will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="builder">Menu Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <Button onClick={saveMenu} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Menu"}
          </Button>
        </div>

        <TabsContent value="builder" className="space-y-6">
          {menuCategories.map((category, categoryIndex) => (
            <Card key={category._id || categoryIndex} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle>{category.name}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => confirmDeleteCategory(categoryIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {category.items.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={item._id || itemIndex} value={item._id || itemIndex.toString()}>
                        <AccordionTrigger className="py-3">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-muted-foreground">{item.price} Birr</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid gap-4 py-2">
                            {item.image && (
                              <div className="relative h-40 w-full overflow-hidden rounded-md">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => editMenuItem(categoryIndex, itemIndex)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Item
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => removeMenuItem(categoryIndex, itemIndex)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Item
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">No items in this category yet</div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 py-3">
                <Button variant="outline" size="sm" className="w-full" onClick={() => addMenuItem(categoryIndex)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </CardFooter>
            </Card>
          ))}

          <div className="flex items-center gap-2">
            <Input
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={addCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {restaurantInfo && <MenuPreview restaurantInfo={restaurantInfo} menuData={menuCategories} />}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItemIndex !== null ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            <DialogDescription>
              {editingItemIndex !== null
                ? "Update the details for this menu item"
                : "Enter the details for your new menu item"}
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input
                  id="item-name"
                  placeholder="e.g. Margherita Pizza"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="item-description">Description & Ingredients (Optional)</Label>
                <Textarea
                  id="item-description"
                  placeholder="e.g. Classic pizza with tomato sauce, mozzarella, and basil"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="item-price">Price (Birr) *</Label>
                <Input
                  id="item-price"
                  placeholder="e.g. 250"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Item Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                    {editingItem.image ? (
                      <Image
                        src={editingItem.image || "/placeholder.svg"}
                        alt="Item preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("item-image-upload")?.click()}
                    >
                      Upload Image
                    </Button>
                    <Input
                      id="item-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleItemImageUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveMenuItem} disabled={!editingItem?.name || !editingItem?.price}>
              {editingItemIndex !== null ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
