
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, they can use the search page
    // If not authenticated, redirect to login
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render the search page for authenticated users
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-16 pb-16">
        <div className="container px-4 md:px-6 pt-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Search For Content</h1>
          <p className="text-muted-foreground mb-8">
            Use our powerful search engine to find unauthorized uses of your content across the web.
          </p>
        </div>
        <ContentSearchSection />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
