
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/ui/sidebar";
import { PlagiarismCheckerSection } from "@/components/content-theft/PlagiarismCheckerSection";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PlagiarismChecker() {
  const { isReady, user, accessLevel } = useProtectedRoute(true);

  // Show loading state while auth is being checked
  if (!isReady) {
    return <LoadingState />;
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-grow container max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6">
            <h1 className="text-2xl font-bold mb-8 text-gradient">Plagiarism Checker</h1>
            
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You must be logged in to use the Plagiarism Checker service. Free accounts are limited to 1 check per week.
              </AlertDescription>
              <div className="mt-4">
                <Button asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="ml-2">
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </Alert>
          </main>
          <Footer />
        </div>
      </div>
    );
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
          
          {accessLevel === 'basic' && (
            <Alert className="mb-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle>Free Account</AlertTitle>
              <AlertDescription>
                You are using a free account which is limited to 1 plagiarism check per week. 
                <Link to="/pricing" className="ml-1 text-purple-600 dark:text-purple-400 underline underline-offset-2">
                  Upgrade your account
                </Link> for unlimited checks.
              </AlertDescription>
            </Alert>
          )}
          
          <PlagiarismCheckerSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
