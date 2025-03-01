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
      console.log("Starting aggressive logout process...");
      
      await signOut();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      setTimeout(() => {
        console.log("Forcing page reload to clear all state...");
        window.location.href = '/';
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 200);
      
    } catch (error) {
      console.error("Error during logout process:", error);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
      
      setTimeout(() => {
        console.log("Force navigation after error...");
        window.location.href = '/';
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 200);
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
