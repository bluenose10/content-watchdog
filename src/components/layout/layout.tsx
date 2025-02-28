
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PreFetchInitializer } from "@/components/PreFetchInitializer";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  
  // Log the authentication state for debugging
  useEffect(() => {
    console.log("Layout component - Auth state:", !!user);
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col">
      <PreFetchInitializer />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
