
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
      
      // Force a hard navigation to home page to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out:", error);
      
      // Even if there's an error, force logout by clearing state and redirecting
      toast({
        title: "Signed out",
        description: "You have been logged out"
      });
      
      // Force a hard navigation to home page
      window.location.href = '/';
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
