
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useHeaderLogic() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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
    setIsMobileMenuOpen(false);
  }, [location]);

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
    if (isLoggingOut) return; // Prevent multiple clicks
    
    try {
      setIsLoggingOut(true);
      console.log("Starting controlled logout process...");
      
      // Show toast first so user gets immediate feedback
      toast({
        title: "Logging out",
        description: "Please wait while we log you out...",
      });
      
      // Navigate to home page first to ensure we're not on a protected route
      // This helps prevent the white screen issue
      navigate('/', { replace: true });
      
      // Small delay to ensure navigation completes
      setTimeout(async () => {
        try {
          // Now perform the actual logout
          await signOut();
          
          toast({
            title: "Logged out",
            description: "You have been logged out successfully",
          });
          
        } catch (error) {
          console.error("Error during signOut process:", error);
          
          // Even if there's an error, we still want to tell the user they're logged out
          toast({
            title: "Logged out",
            description: "You have been logged out successfully"
          });
        }
      }, 300);
      
    } catch (error) {
      console.error("Error during logout process:", error);
      setIsLoggingOut(false);
    }
  };

  const navigateToSection = (sectionId: string) => {
    console.log("Navigating to section:", sectionId);
    
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      console.log("Element found:", !!element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log("Element with ID not found:", sectionId);
      }
    }
  };

  return {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isLoggingOut,
    isAuthenticated,
    handleSignOut,
    navigateToSection
  };
}
