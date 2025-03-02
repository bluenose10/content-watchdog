
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PreFetchInitializer } from "@/components/PreFetchInitializer";
import { useEffect, Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/lib/constants";
import { LoadingState } from "@/components/dashboard/LoadingState";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Log the authentication state for debugging
  useEffect(() => {
    console.log("Layout component - Auth state:", !!user);
    console.log("Current path:", location.pathname);
    
    // Set loading to false after a brief delay to ensure children have time to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [user, location]);

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">We're sorry, but there was an error loading this page.</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => {
            setHasError(false);
            window.location.href = '/';
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }
  
  // If we're still loading auth state for a protected route, show a loading state
  if (authLoading && isProtectedRoute) {
    return <LoadingState />;
  }

  // Only redirect if we're on a protected route and auth has finished loading
  if (isProtectedRoute && !authLoading && !user) {
    console.log("Redirecting from protected route to login page");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PreFetchInitializer />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingState />}>
          {isLoading ? (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading content...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
