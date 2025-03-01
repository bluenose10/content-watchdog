
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/ui/sidebar";
import { PlagiarismCheckerSection } from "@/components/content-theft/PlagiarismCheckerSection";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { LoadingState } from "@/components/dashboard/LoadingState";

export default function PlagiarismChecker() {
  const { isReady } = useProtectedRoute(true);

  // Show loading state while auth is being checked
  if (!isReady) {
    return <LoadingState />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-grow container max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6">
          <h1 className="text-2xl font-bold mb-8 text-gradient">Plagiarism Checker</h1>
          <PlagiarismCheckerSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
