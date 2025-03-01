
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

interface DesktopNavProps {
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  navigateToSection: (sectionId: string) => void;
  handleSignOut: () => void;
}

export function DesktopNav({
  isAuthenticated,
  isLoggingOut,
  navigateToSection,
  handleSignOut
}: DesktopNavProps) {
  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link 
          to="/" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          Home
        </Link>
        <Link 
          to="/#features" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          Features
        </Link>
        <button 
          onClick={() => navigateToSection('pricing')} 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          Pricing
        </button>
        <Link 
          to="/content-theft" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          Content Theft
        </Link>
        <Link 
          to="/contact" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          About
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <ThemeToggle />
        
        {isAuthenticated ? (
          <>
            <Button asChild variant="default">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="button-animation">
              <Link to="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
