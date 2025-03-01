import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/layout/Logo";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isLoggedIn = false; // Replace with actual login state
  const isScrolled = false; // Replace with actual scroll state
  const headerClasses = ""; // Add any additional classes if needed
  const logoTextClasses = ""; // Add any additional classes if needed

  const logout = () => {
    // Implement logout functionality
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
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
          <Link to="/" className="text-xl flex items-center gap-1.5">
            <Logo className="h-5 w-5" />
            <span className={logoTextClasses}>Influence Guard</span>
          </Link>

          <div className="hidden md:flex md:items-center">
            <DesktopNav />
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
      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
    </header>
  );
};
