"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"

export function AudienceTargetingTool() {
  const { control } = useForm()

  return (
    <Card className="border border-border/50 shadow-md bg-background">
      <CardHeader>
        <CardTitle>Target Audience Customization</CardTitle>
        <CardDescription>
          Tailor your content to specific buyer demographics, neighborhoods, and property types for maximum impact.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="demographics" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="demographics">Buyer Demographics</TabsTrigger>
              <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
              <TabsTrigger value="properties">Property Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demographics" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Buyer Life Stage</label>
                    <Select defaultValue="first-time">
                      <SelectTrigger>
                        <SelectValue placeholder="Select life stage..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-time">First-time Homebuyers</SelectItem>
                        <SelectItem value="upgraders">Home Upgraders</SelectItem>
                        <SelectItem value="downsizers">Downsizers</SelectItem>
                        <SelectItem value="investors">Investors</SelectItem>
                        <SelectItem value="luxury">Luxury Buyers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Age Range</label>
                    <Select defaultValue="25-34">
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55-64">55-64</SelectItem>
                        <SelectItem value="65+">65+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Income Level</label>
                    <Select defaultValue="middle">
                      <SelectTrigger>
                        <SelectValue placeholder="Select income level..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moderate">Moderate Income</SelectItem>
                        <SelectItem value="middle">Middle Income</SelectItem>
                        <SelectItem value="upper-middle">Upper Middle Income</SelectItem>
                        <SelectItem value="high">High Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Family Status</label>
                    <Select defaultValue="couple">
                      <SelectTrigger>
                        <SelectValue placeholder="Select family status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="couple">Couple, No Children</SelectItem>
                        <SelectItem value="family-young">Family with Young Children</SelectItem>
                        <SelectItem value="family-teen">Family with Teenagers</SelectItem>
                        <SelectItem value="empty-nest">Empty Nesters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Interests & Priorities</label>
                  <div className="flex flex-wrap gap-2">
                    <div className="border rounded-full px-3 py-1 text-xs bg-primary/10">School Districts</div>
                    <div className="border rounded-full px-3 py-1 text-xs bg-primary/10">Outdoor Space</div>
                    <div className="border rounded-full px-3 py-1 text-xs bg-primary/10">Energy Efficiency</div>
                    <div className="border rounded-full px-3 py-1 text-xs bg-primary/10">Smart Home</div>
                    <div className="border rounded-full px-3 py-1 text-xs bg-primary/10">Walkability</div>
                    <div className="border rounded-full px-3 py-1 text-xs bg-primary/10">+ Add More</div>
                  </div>
                </div>
                
                <Button className="w-full">Create Targeted Content</Button>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Audience Insights</h3>
                  <Card className="p-4 bg-primary/10">
                    <p className="text-sm text-muted-foreground">First-time homebuyers in the 25-34 age range are typically looking for affordable starter homes with potential for growth. They value proximity to work, entertainment, and are often interested in smart home features and energy efficiency.</p>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="neighborhoods" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Neighborhood</label>
                  <Input placeholder="Enter neighborhood name" />
                </div>
                
                <div className="h-64 border rounded-md bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Neighborhood map visualization will be displayed here</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Key Selling Points</label>
                    <Textarea 
                      placeholder="What makes this neighborhood attractive to buyers?" 
                      rows={3} 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Local Amenities</label>
                    <Textarea 
                      placeholder="Nearby schools, parks, shopping, etc." 
                      rows={3} 
                    />
                  </div>
                </div>
                
                <Button className="w-full">Generate Neighborhood Content</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="properties" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Type</label>
                    <Select defaultValue="single-family">
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-family">Single-Family Home</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="multi-family">Multi-Family</SelectItem>
                        <SelectItem value="luxury">Luxury Estate</SelectItem>
                        <SelectItem value="vacation">Vacation Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Style</label>
                    <Select defaultValue="modern">
                      <SelectTrigger>
                        <SelectValue placeholder="Select style..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="colonial">Colonial</SelectItem>
                        <SelectItem value="craftsman">Craftsman</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="contemporary">Contemporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Features</label>
                  <Textarea 
                    placeholder="What makes this property special? (e.g., open layouts, high ceilings, etc.)"
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Ideal Buyer Profile</label>
                  <Textarea 
                    placeholder="Describe the ideal buyer for this property type" 
                    rows={3} 
                  />
                </div>
                
                <Button className="w-full">Generate Property-Specific Content</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}