
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PreFetchInitializer } from "@/components/PreFetchInitializer";
import { useEffect, Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/lib/constants";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [hasError, setHasError] = useState(false);
  
  // Log the authentication state for debugging
  useEffect(() => {
    console.log("Layout component - Auth state:", !!user);
    console.log("Current path:", location.pathname);
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
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PreFetchInitializer />
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="p-8 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        }>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
