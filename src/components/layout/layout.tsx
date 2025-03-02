
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PreFetchInitializer } from "@/components/PreFetchInitializer";
import { useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/lib/constants";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  
  // Log the authentication state for debugging
  useEffect(() => {
    console.log("Layout component - Auth state:", !!user);
    console.log("Current path:", location.pathname);
  }, [user, location]);

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  return (
    <div className="flex min-h-screen flex-col">
      <PreFetchInitializer />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
