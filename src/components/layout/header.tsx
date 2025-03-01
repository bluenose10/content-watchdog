
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileMenu } from "./MobileMenu";
import { useHeaderLogic } from "./useHeaderLogic";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  const {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isLoggingOut,
    isAuthenticated,
    handleSignOut,
    navigateToSection
  } = useHeaderLogic();

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
        <Logo />

        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          <DesktopNav 
            isAuthenticated={isAuthenticated}
            isLoggingOut={isLoggingOut}
            navigateToSection={navigateToSection}
            handleSignOut={handleSignOut}
          />
        </div>

        <MobileMenuButton 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <MobileMenu 
          isAuthenticated={isAuthenticated}
          isLoggingOut={isLoggingOut}
          navigateToSection={navigateToSection}
          handleSignOut={handleSignOut}
        />
      )}
    </header>
  );
}
