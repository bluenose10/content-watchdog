
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
        <main className="flex-1 container px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Plagiarism Checker</h1>
            <p className="text-muted-foreground mt-2">
              Check your content for potential plagiarism and protect your intellectual property.
            </p>
          </div>
          <PlagiarismCheckerSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
