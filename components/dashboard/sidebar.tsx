"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  ClockIcon,
  WalletIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { useAuth } from "@/components/providers/auth-provider";

const navigation = [
  { name: "Generate", href: "/", icon: HomeIcon },
  { name: "Token Wallet", href: "/tokens", icon: WalletIcon },
  { name: "History", href: "/history", icon: ClockIcon },
  { name: "Account", href: "/account", icon: UserIcon },
  { name: "Support", href: "/support", icon: QuestionMarkCircleIcon },
];

export function DashboardSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const UserMenu = () => (
    <div className="flex flex-col bg-background/75 border-t border-border/50">
      <div className="flex items-center gap-3 p-4">
        <div className="bg-primary/10 p-1.5 rounded-full">
          <UserCircleIcon className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.email}</span>
          <span className="text-xs text-muted-foreground">Professional Plan</span>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <WalletIcon className="h-4 w-4 text-primary/70" />
          Credits: <span className="font-medium text-foreground">100</span>
        </div>
        <form action={logout}>
          <Button 
            type="submit"
            variant="outline" 
            className="w-full justify-start gap-2 hover:bg-primary/5 hover:text-primary"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Log out
          </Button>
        </form>
      </div>
    </div>
  );

  const SidebarNavList = ({ isMobile = false }) => (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/10",
              )}
              onClick={() => isMobile && setMobileMenuOpen(false)}
            >
              <item.icon 
                className={cn(
                  "h-6 w-6 shrink-0",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true" 
              />
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border/50 bg-background/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
          <div className="flex h-16 shrink-0 items-center px-4">
            <div className="flex items-center gap-2">
              <div className="flex items-baseline gap-1">
                <h2 className="text-2xl font-bold">ListingLodge</h2>
                <span className="text-primary font-semibold">AI</span>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col justify-between px-4 pb-0">
            <SidebarNavList />
            
            {/* User menu at bottom */}
            <div className="mt-auto -mx-4">
              <UserMenu />
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-background/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-muted-foreground"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="text-sm font-semibold leading-6">ListingLodge AI</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20">
              <UserCircleIcon className="h-6 w-6 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-border/70" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Professional Plan
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <WalletIcon className="h-3 w-3 text-primary/70" />
                  Credits: <span className="font-medium text-foreground">100</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">Account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={logout} className="w-full">
                <button type="submit" className="w-full text-left">
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/30 backdrop-blur-sm" />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-foreground" aria-hidden="true" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
                <div className="flex h-16 shrink-0 items-center px-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-2xl font-bold">ListingLodge</h2>
                      <span className="text-primary font-semibold">AI</span>
                    </div>
                  </div>
                </div>
                <nav className="flex flex-1 flex-col justify-between px-6 pb-0">
                  <SidebarNavList isMobile={true} />
                  
                  {/* User menu at bottom for mobile */}
                  <div className="mt-auto -mx-6">
                    <UserMenu />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}