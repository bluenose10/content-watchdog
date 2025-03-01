
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Search = () => {
  // Use the protected route hook but don't require authentication
  const { isReady, accessLevel } = useProtectedRoute(false);
  const { user } = useAuth();

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
          <h1 className="text-2xl font-bold text-primary mb-4">Plagiarism Detection & Content Search</h1>
          <p className="text-muted-foreground mb-8">
            Use our powerful digital rights management system to find unauthorized uses of your intellectual property across the web. Our advanced copyright infringement detection helps secure your creative assets.
            {!user && (
              <div className="mt-6 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Sign Up Required</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
                  You need to create an account to use our content theft detection features. Sign up for a free account to get started with 3 searches per month and ensure DMCA compliance.
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/signup">Sign Up Now</Link>
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
