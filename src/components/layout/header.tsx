
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LogOut, Menu, Shield, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "About", href: "/#about" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const isOnHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
  }, [location]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      
      // Redirect to home page after logout
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out",
        variant: "destructive",
      });
    }
  };

  const goToHome = () => {
    // Force navigation using window.location to ensure a full page reload
    window.location.href = "/";
  };

  const goToSection = (sectionId: string) => {
    // Force navigation using window.location with hash
    window.location.href = `/#${sectionId}`;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass-card py-2 backdrop-blur-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <a 
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
          >
            <Shield className="h-6 w-6" />
            <span className="text-gradient">{APP_NAME}</span>
          </a>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
          >
            Home
          </a>
          <a 
            href="/#features" 
            className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
          >
            Features
          </a>
          <a 
            href="/#pricing" 
            className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
          >
            Pricing
          </a>
          <a 
            href="/#about" 
            className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
          >
            About
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="default">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Log out
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

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-50 bg-background/95 backdrop-blur-sm animate-fade-in md:hidden">
          <div className="container py-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              <a
                href="/"
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                Home
              </a>
              <a
                href="/#features"
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                Features
              </a>
              <a
                href="/#pricing"
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                Pricing
              </a>
              <a
                href="/#about"
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                About
              </a>
            </nav>

            <div className="flex flex-col gap-3 mt-4">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleSignOut} className="flex items-center justify-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild size="lg" className="button-animation">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
