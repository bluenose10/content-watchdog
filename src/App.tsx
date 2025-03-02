
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/context/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense, lazy, useEffect, useState } from "react";
import { LoadingState } from "@/components/dashboard/LoadingState";

// Lazy load pages to improve initial load performance
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Search = lazy(() => import("@/pages/Search"));
const Results = lazy(() => import("@/pages/Results"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const AccountSettings = lazy(() => import("@/pages/AccountSettings"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("@/pages/PaymentCanceled"));
const MockCheckout = lazy(() => import("@/pages/MockCheckout"));
const Monitoring = lazy(() => import("@/pages/Monitoring"));
const Protection = lazy(() => import("@/pages/Protection"));
const SearchHistory = lazy(() => import("@/pages/SearchHistory"));
const Contact = lazy(() => import("@/pages/Contact"));
const Piracy = lazy(() => import("@/pages/Piracy"));
const PlagiarismChecker = lazy(() => import("@/pages/PlagiarismChecker"));

import "./App.css";

function ErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-6">We're having trouble loading the application.</p>
      <button 
        className="px-4 py-2 bg-primary text-white rounded-md"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </div>
  );
}

function AppRoutes() {
  const [isAppReady, setIsAppReady] = useState(false);
  
  useEffect(() => {
    // Allow a moment for the app to initialize
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isAppReady) {
    return <LoadingState />;
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/history" element={<SearchHistory />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/canceled" element={<PaymentCanceled />} />
        <Route path="/checkout" element={<MockCheckout />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/protection" element={<Protection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/piracy" element={<Piracy />} />
        <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught in App:", event.error);
      setError(event.error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (error) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="influence-guard-theme">
        <ErrorFallback />
      </ThemeProvider>
    );
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="influence-guard-theme">
          <Router>
            <AppRoutes />
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
