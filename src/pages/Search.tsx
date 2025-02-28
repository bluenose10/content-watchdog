
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Search = () => {
  // Use the protected route hook but don't require authentication
  const { isReady, accessLevel } = useProtectedRoute(false);

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
          <h1 className="text-2xl font-bold text-primary mb-4">Search For Content</h1>
          <p className="text-muted-foreground mb-8">
            Use our powerful search engine to find unauthorized uses of your content across the web.
            {accessLevel === AccessLevel.ANONYMOUS && (
              <div className="mt-6 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Sign Up Required</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
                  You need to create an account to use our search features. Sign up for a free account to get started with 3 searches per month.
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/signup">Sign Up Now</Link>
                </Button>
              </div>
            )}
          </p>
        </div>
        {accessLevel !== AccessLevel.ANONYMOUS && <ContentSearchSection />}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
