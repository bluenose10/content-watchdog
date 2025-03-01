
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { ThemeToggle } from "@/components/theme-toggle"; // Fixed import path
import { Logo } from "@/components/layout/Logo";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = false; // Replace with actual login state
  const isScrolled = false; // Replace with actual scroll state
  const headerClasses = ""; // Add any additional classes if needed
  const logoTextClasses = ""; // Add any additional classes if needed

  const logout = () => {
    // Implement logout functionality
  };

  const navigateToSection = (sectionId: string) => {
    // Placeholder function for section navigation
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled ? "border-border" : "border-transparent",
        headerClasses
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-1 md:gap-2">
          <MobileMenuButton
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <Link to="/" className="text-xl flex items-center gap-1.5">
            <Logo />
            <span className={logoTextClasses}>Influence Guard</span>
          </Link>

          <div className="hidden md:flex md:items-center">
            <DesktopNav 
              isAuthenticated={isLoggedIn}
              isLoggingOut={false}
              navigateToSection={navigateToSection}
              handleSignOut={logout}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={logout}
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile menu using Sheet component */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <div className="py-6 px-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-lg font-medium py-2 border-b border-border">
                Home
              </Link>
              <Link to="/#features" className="text-lg font-medium py-2 border-b border-border">
                Features
              </Link>
              <button
                onClick={() => navigateToSection('pricing')}
                className="text-lg font-medium py-2 border-b border-border text-left"
              >
                Pricing
              </button>
              <Link to="/piracy" className="text-lg font-medium py-2 border-b border-border">
                Piracy
              </Link>
              <Link to="/contact" className="text-lg font-medium py-2 border-b border-border">
                About
              </Link>
            </nav>
            
            <div className="mt-6 space-y-3">
              {isLoggedIn ? (
                <>
                  <Button asChild className="w-full">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
