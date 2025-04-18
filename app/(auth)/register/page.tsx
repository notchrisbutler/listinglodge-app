"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/app/actions/auth';
import { useState } from 'react';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const accordionContentVariants = {
    collapsed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    const result = await register(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {error && (
        <motion.div 
          variants={itemVariants}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-4xl"
        >
          {error}
        </motion.div>
      )}

      {/* Flex container for FAQ and Registration Card */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-4xl">

        {/* FAQ Section (Left) */}
        <motion.div variants={itemVariants} className="w-full md:w-1/2">
           <h2 className="text-2xl font-bold text-center mb-4">Frequently Asked Questions</h2>
           <Accordion type="single" collapsible className="w-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg p-4">
             <AccordionItem value="item-1">
               <AccordionTrigger>Is ListingLodge free?</AccordionTrigger>
               <AccordionContent>
                <motion.div
                  variants={accordionContentVariants}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                >
                   Yes, ListingLodge offers a free tier with essential features. We also have paid plans with advanced functionalities for larger portfolios.
                </motion.div>
               </AccordionContent>
             </AccordionItem>
             <AccordionItem value="item-2">
               <AccordionTrigger>How does ListingLodge secure my data?</AccordionTrigger>
               <AccordionContent>
                <motion.div
                  variants={accordionContentVariants}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                >
                  We use industry-standard encryption and security practices to protect your data. Your privacy and security are our top priorities.
                </motion.div>
               </AccordionContent>
             </AccordionItem>
           </Accordion>
        </motion.div>

        {/* Registration Card Section (Right) */}
        <motion.div
          variants={itemVariants}
          className="w-full md:w-1/2 max-w-md" // Keep max-w-md for the card itself
        >
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader className="items-center text-center">
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input 
                    id="first-name" 
                    name="first-name" 
                    placeholder="Max" 
                    required 
                    className="bg-input/70" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input 
                    id="last-name" 
                    name="last-name" 
                    placeholder="Robinson" 
                    required 
                    className="bg-input/70" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="bg-input/70"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    className="bg-input/70" 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create an account'}
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2 pt-4">
                 <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="underline hover:text-primary">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

      </div>

    </motion.div>
  );
}
