
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const isLoggedIn = false; // Replace with actual login state
  const isScrolled = false; // Replace with actual scroll state

  const logout = () => {
    // Implement logout functionality
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled ? "border-border" : "border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/822ca5bd-71ae-4f2a-b354-b4182a9f42d7.png" 
            alt="Influence Guard Logo" 
            className="h-8 w-8" 
          />
          <span className="text-gradient font-bold text-lg">Influence Guard</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link to="/piracy" className="text-sm font-medium hover:text-primary transition-colors">
            Piracy
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle moved before auth buttons */}
            <ThemeToggle />
            
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" onClick={logout} title="Log out">
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Theme Toggle and Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                <div className="py-6 px-4">
                  <nav className="flex flex-col space-y-3">
                    <Link to="/" className="text-lg font-medium py-2 border-b border-border">
                      Home
                    </Link>
                    <Link to="/#features" className="text-lg font-medium py-2 border-b border-border">
                      Features
                    </Link>
                    <Link to="/#pricing" className="text-lg font-medium py-2 border-b border-border">
                      Pricing
                    </Link>
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
          </div>
        </div>
      </div>
    </header>
  );
};
