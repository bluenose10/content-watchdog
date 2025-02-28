
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";

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
              <span className="block mt-2 text-sm text-purple-600 dark:text-purple-400">
                You're using the free preview. Sign up for a full account to access more results and features.
              </span>
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
