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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/app/actions/auth';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    const result = await login(formData);
    
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
      {message && (
        <motion.div 
          variants={itemVariants}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative w-full max-w-md"
        >
          {message}
        </motion.div>
      )}

      {error && (
        <motion.div 
          variants={itemVariants}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-md"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="w-full max-w-md"
      >
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <form action={handleSubmit}>
            <CardContent className="grid gap-4">
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
                  required 
                  className="bg-input/70" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="underline hover:text-primary">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
