
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // We're adding this console log to debug auth state
  console.log("Header render - Auth state:", !!user);

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
      setIsLoggingOut(true);
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      
      // Force a re-render by navigating to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Function to handle navigation to home page sections
  const navigateToSection = (sectionId: string) => {
    console.log("Navigating to section:", sectionId);
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home with hash
      // Using navigate directly instead of window.location to prevent full page reload
      navigate(`/#${sectionId}`);
    } else {
      // If already on home page, scroll to section
      const element = document.getElementById(sectionId);
      console.log("Element found:", !!element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log("Element with ID not found:", sectionId);
      }
    }
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
          <Link 
            to="/"
            className="flex items-center gap-2 font-bold text-xl"
          >
            <img 
              src="/lovable-uploads/822ca5bd-71ae-4f2a-b354-b4182a9f42d7.png" 
              alt="Influence Guard Logo" 
              className="h-9 w-9" 
            />
            <span className="text-gradient">Influence Guard</span>
          </Link>
        </div>

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
            to="/contact" 
            className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
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
              <Link
                to="/"
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                Home
              </Link>
              <Link
                to="/#features"
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                Features
              </Link>
              <button
                onClick={() => navigateToSection('pricing')}
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                Pricing
              </button>
              <Link
                to="/contact"
                className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
              >
                About
              </Link>
            </nav>

            <div className="flex flex-col gap-3 mt-4">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleSignOut} 
                    disabled={isLoggingOut}
                    className="flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Log out"}
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
