"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function SocialMediaTool() {
  return (
    <Card className="border border-border/50 shadow-md bg-background">
      <CardHeader>
        <CardTitle>Social Media Content Generator</CardTitle>
        <CardDescription>
          Create platform-specific social media posts to effectively showcase your listings on Facebook, Instagram, Twitter, and LinkedIn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Property Information</label>
            <Textarea 
              placeholder="Enter key details about the property (location, features, price point, etc.)" 
              rows={3} 
            />
          </div>
          
          <Tabs defaultValue="facebook" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>
            
            <TabsContent value="facebook" className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Facebook Post</label>
                <Textarea 
                  placeholder="Your AI-generated Facebook post will appear here..." 
                  rows={4}
                  className="bg-muted/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Optimized for engagement with longer-form content and family-oriented messaging.</p>
            </TabsContent>
            
            <TabsContent value="instagram" className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Instagram Caption</label>
                <Textarea 
                  placeholder="Your AI-generated Instagram caption will appear here..." 
                  rows={4}
                  className="bg-muted/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Visual-focused with relevant hashtags to maximize discovery.</p>
            </TabsContent>
            
            <TabsContent value="twitter" className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Twitter Post</label>
                <Textarea 
                  placeholder="Your AI-generated Twitter post will appear here..." 
                  rows={4}
                  className="bg-muted/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Concise messaging that grabs attention quickly with strategic hashtags.</p>
            </TabsContent>
            
            <TabsContent value="linkedin" className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">LinkedIn Post</label>
                <Textarea 
                  placeholder="Your AI-generated LinkedIn post will appear here..." 
                  rows={4}
                  className="bg-muted/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Professional tone highlighting investment potential and property value.</p>
            </TabsContent>
          </Tabs>
          
          <Button className="w-full">Generate Social Media Content</Button>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Copy Current</Button>
            <Button variant="outline">Copy All</Button>
            <Button>Save</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 