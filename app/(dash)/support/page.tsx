"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QuestionMarkCircleIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { DashboardOverview } from "@/components/dashboard/overview";

export default function SupportPage() {
  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Support</h1>
              <p className="text-muted-foreground text-lg">
                Get help with ListingLodge AI. Our team is here to assist you.
              </p>
            </div>
            <DashboardOverview />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-border/50 shadow-md bg-background">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <QuestionMarkCircleIcon className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg font-medium">FAQs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">How do credits work?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Credits are used for generating content. Each generation costs a specific number of credits depending on the type of content.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">What file formats are supported?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We support JPG, PNG, and WEBP formats for image uploads.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">How are tokens consumed?</h3>
                    <p className="text-muted-foreground">Tokens are consumed based on the complexity and length of the generation task. For example, generating a short property description might cost 1 token, while generating a longer blog post might cost 5 tokens.</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Can I get a refund?</h3>
                    <p className="text-muted-foreground">Refund policies are outlined in our Terms of Service. Generally, token purchases are non-refundable.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-md bg-background">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <EnvelopeIcon className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg font-medium">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue in detail..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button className="w-full">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}