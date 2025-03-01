
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  
  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link 
          to="/" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          {t('header.home')}
        </Link>
        <Link 
          to="/#features" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          {t('header.features')}
        </Link>
        <button 
          onClick={() => navigateToSection('pricing')} 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          {t('header.pricing')}
        </button>
        <Link 
          to="/piracy" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          {t('header.piracy')}
        </Link>
        <Link 
          to="/contact" 
          className="text-sm font-medium transition-colors hover:text-primary smooth-transition cursor-pointer"
        >
          {t('header.about')}
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <ThemeToggle />
        
        {isAuthenticated ? (
          <>
            <Button asChild variant="default">
              <Link to="/dashboard">{t('header.dashboard')}</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : t('header.logout')}
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link to="/login">{t('header.login')}</Link>
            </Button>
            <Button asChild className="button-animation">
              <Link to="/signup">{t('header.signup')}</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
