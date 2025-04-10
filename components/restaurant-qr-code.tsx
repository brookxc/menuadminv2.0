"use client"

import { useEffect, useState } from "react"
import { Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

type RestaurantQRCodeProps = {
  restaurantId: string
  restaurantName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RestaurantQRCode({ restaurantId, restaurantName, open, onOpenChange }: RestaurantQRCodeProps) {
  const { toast } = useToast()
  const [menuUrl, setMenuUrl] = useState("")
  const [qrImageUrl, setQrImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      try {
        // Only run on client side
        const baseUrl = window.location.origin
        const fullUrl = `${baseUrl}/menu/${restaurantId}`
        setMenuUrl(fullUrl)

        // Use Google Charts API to generate QR code
        // Make sure to properly encode the URL
        const encodedUrl = encodeURIComponent(fullUrl)
        const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chld=L|1&choe=UTF-8&chl=${encodedUrl}`

        // Verify the QR code image loads correctly
        const img = new window.Image()

        img.onload = () => {
          setQrImageUrl(googleChartsUrl)
          setIsLoading(false)
        }
        img.onerror = () => {
          console.error("Failed to load QR code image")
          // Fallback to a different QR code service
          const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}`
          setQrImageUrl(fallbackUrl)
          setIsLoading(false)
        }
        img.src = googleChartsUrl
      } catch (error) {
        console.error("Error generating QR code:", error)
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to generate QR code. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [open, restaurantId, toast])

  const downloadQRCode = () => {
    try {
      // Create a temporary link element
      const link = document.createElement("a")
      link.href = qrImageUrl
      link.download = `${restaurantName.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "QR code downloaded successfully",
      })
    } catch (error) {
      console.error("Error downloading QR code:", error)
      toast({
        title: "Error",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyMenuUrl = () => {
    try {
      navigator.clipboard.writeText(menuUrl)
      toast({
        title: "Copied!",
        description: "Menu URL copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying URL:", error)
      toast({
        title: "Error",
        description: "Failed to copy URL. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Menu QR Code for {restaurantName}</DialogTitle>
          <DialogDescription>
            Scan this QR code to view the restaurant menu. You can also download it to print.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-[250px] w-[250px] border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Loading QR code...</p>
            </div>
          ) : (
            <div className="border p-4 rounded-lg bg-white">
              {qrImageUrl ? (
                <Image
                  src={qrImageUrl || "/placeholder.svg"}
                  alt={`QR code for ${restaurantName} menu`}
                  width={250}
                  height={250}
                  className="max-w-full h-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-[250px] w-[250px]">
                  <p className="text-muted-foreground">Failed to load QR code</p>
                </div>
              )}
            </div>
          )}

          {menuUrl && (
            <div className="mt-4 w-full">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground truncate flex-1">{menuUrl}</p>
                <Button variant="outline" size="sm" onClick={copyMenuUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button onClick={downloadQRCode} disabled={isLoading || !qrImageUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
