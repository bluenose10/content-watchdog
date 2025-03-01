
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const Search = () => {
  // Use the protected route hook but don't require authentication
  const { isReady, accessLevel } = useProtectedRoute(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  // Show loading indicator while checking authentication
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-16 pb-16">
        <div className="container px-4 md:px-6 pt-8">
          <h1 className="text-2xl font-bold text-gradient mb-4">{t('search.title')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('search.description')}
            {!user && (
              <div className="mt-6 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">{t('search.signup.required')}</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
                  {t('search.signup.description')}
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/signup">{t('search.signup.button')}</Link>
                </Button>
              </div>
            )}
          </p>
        </div>
        <ContentSearchSection />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
