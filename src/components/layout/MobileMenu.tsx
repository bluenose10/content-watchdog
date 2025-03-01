
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

interface MobileMenuProps {
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  navigateToSection: (sectionId: string) => void;
  handleSignOut: () => void;
}

export function MobileMenu({
  isAuthenticated,
  isLoggingOut,
  navigateToSection,
  handleSignOut
}: MobileMenuProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 top-[57px] z-50 bg-background/95 backdrop-blur-sm animate-fade-in md:hidden">
      <div className="container py-6 flex flex-col gap-6">
        <div className="flex justify-end mb-2">
          <LanguageSelector />
        </div>
        
        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
          >
            {t('header.home')}
          </Link>
          <Link
            to="/#features"
            className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
          >
            {t('header.features')}
          </Link>
          <button
            onClick={() => navigateToSection('pricing')}
            className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
          >
            {t('header.pricing')}
          </button>
          <Link
            to="/piracy"
            className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
          >
            {t('header.piracy')}
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium px-2 py-2 border-b border-border cursor-pointer text-left"
          >
            {t('header.about')}
          </Link>
        </nav>

        <div className="flex flex-col gap-3 mt-4">
          {isAuthenticated ? (
            <>
              <Button asChild size="lg">
                <Link to="/dashboard">{t('header.dashboard')}</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleSignOut} 
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : t('header.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">{t('header.login')}</Link>
              </Button>
              <Button asChild size="lg" className="button-animation">
                <Link to="/signup">{t('header.signup')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
