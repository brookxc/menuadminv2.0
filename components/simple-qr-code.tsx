"use client"

import { useState, useEffect } from "react"
import { Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

type SimpleQRCodeProps = {
  restaurantId: string
  restaurantName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SimpleQRCode({ restaurantId, restaurantName, open, onOpenChange }: SimpleQRCodeProps) {
  const { toast } = useToast()
  const [menuUrl, setMenuUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      try {
        // Use the external website URL instead of the current origin
        const externalUrl = `https://etmenu.vercel.app/restaurant/${restaurantId}`
        setMenuUrl(externalUrl)
        setIsLoading(false)
      } catch (error) {
        console.error("Error generating QR code URL:", error)
        setIsLoading(false)
      }
    }
  }, [open, restaurantId])

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

  // Generate QR code URL directly when rendering
  const getQRCodeUrl = () => {
    if (!menuUrl) return ""
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(menuUrl)}`
  }

  const downloadQRCode = () => {
    try {
      const qrUrl = getQRCodeUrl()
      if (!qrUrl) return

      // Create a temporary link element
      const link = document.createElement("a")
      link.href = qrUrl
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Menu QR Code for {restaurantName}</DialogTitle>
          <DialogDescription>
            Scan this QR code to view the restaurant menu on etmenu.vercel.app. You can also download it to print.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-[250px] w-[250px] border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Loading QR code...</p>
            </div>
          ) : (
            <div className="border p-4 rounded-lg bg-white">
              {menuUrl && (
                <Image
                  src={getQRCodeUrl() || "/placeholder.svg"}
                  alt={`QR code for ${restaurantName} menu`}
                  width={250}
                  height={250}
                  className="max-w-full h-auto"
                />
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
            <Button onClick={downloadQRCode} disabled={isLoading || !menuUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
