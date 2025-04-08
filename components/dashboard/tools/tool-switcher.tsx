"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCallback } from "react"

export const ToolSwitcher = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTool = searchParams.get("tool") || "listing"
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleToolChange = (value: string) => {
    router.push(`?${createQueryString("tool", value)}`)
  }
  
  return (
    <Tabs value={currentTool} onValueChange={handleToolChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="listing">Listing Descriptions</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
        <TabsTrigger value="customization">Audience Targeting</TabsTrigger>
      </TabsList>
    </Tabs>
  )
} 