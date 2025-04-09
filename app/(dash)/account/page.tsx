"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserIcon, CreditCardIcon, BellIcon } from "@heroicons/react/24/outline";
import { DashboardOverview } from "@/components/dashboard/overview";

export default function AccountPage() {
  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Account Settings</h1>
              <p className="text-muted-foreground text-lg">
                Manage your account preferences and billing information.
              </p>
            </div>
            <DashboardOverview />
          </div>

          <div className="grid gap-6">
            <Card className="border border-border/50 shadow-md bg-background">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <UserIcon className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg font-medium">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-md bg-background">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CreditCardIcon className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg font-medium">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="pt-4">
                  <p className="font-medium mb-2">Payment Method</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-12 bg-gray-200 rounded mr-3"></div>
                      <span>•••• 4242</span>
                    </div>
                    <Button variant="ghost">Update</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-md bg-background">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <BellIcon className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg font-medium">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your account</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}