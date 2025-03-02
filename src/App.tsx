
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/context/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense, lazy, useEffect, useState } from "react";
import { LoadingState } from "@/components/dashboard/LoadingState";

// Function to handle lazy loading with error handling
const lazyLoadWithErrorBoundary = (importFunc, name) => {
  return lazy(() => 
    importFunc().catch(err => {
      console.error(`Error loading ${name}:`, err);
      return { default: ErrorFallback };
    })
  );
};

// ErrorFallback component for when a module fails to load
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

// Lazy load pages with error handling
const Index = lazyLoadWithErrorBoundary(() => import("@/pages/Index"), "Index");
const Dashboard = lazyLoadWithErrorBoundary(() => import("@/pages/Dashboard"), "Dashboard");
const Analytics = lazyLoadWithErrorBoundary(() => import("@/pages/Analytics"), "Analytics");
const Search = lazyLoadWithErrorBoundary(() => import("@/pages/Search"), "Search");
const Results = lazyLoadWithErrorBoundary(() => import("@/pages/Results"), "Results");
const NotFound = lazyLoadWithErrorBoundary(() => import("@/pages/NotFound"), "NotFound");
const Login = lazyLoadWithErrorBoundary(() => import("@/pages/Login"), "Login");
const SignUp = lazyLoadWithErrorBoundary(() => import("@/pages/SignUp"), "SignUp");
const ResetPassword = lazyLoadWithErrorBoundary(() => import("@/pages/ResetPassword"), "ResetPassword");
const PrivacyPolicy = lazyLoadWithErrorBoundary(() => import("@/pages/PrivacyPolicy"), "PrivacyPolicy");
const TermsOfService = lazyLoadWithErrorBoundary(() => import("@/pages/TermsOfService"), "TermsOfService");
const CookiePolicy = lazyLoadWithErrorBoundary(() => import("@/pages/CookiePolicy"), "CookiePolicy");
const AccountSettings = lazyLoadWithErrorBoundary(() => import("@/pages/AccountSettings"), "AccountSettings");
const PaymentSuccess = lazyLoadWithErrorBoundary(() => import("@/pages/PaymentSuccess"), "PaymentSuccess");
const PaymentCanceled = lazyLoadWithErrorBoundary(() => import("@/pages/PaymentCanceled"), "PaymentCanceled");
const MockCheckout = lazyLoadWithErrorBoundary(() => import("@/pages/MockCheckout"), "MockCheckout");
const Monitoring = lazyLoadWithErrorBoundary(() => import("@/pages/Monitoring"), "Monitoring");
const Protection = lazyLoadWithErrorBoundary(() => import("@/pages/Protection"), "Protection");
const SearchHistory = lazyLoadWithErrorBoundary(() => import("@/pages/SearchHistory"), "SearchHistory");
const Contact = lazyLoadWithErrorBoundary(() => import("@/pages/Contact"), "Contact");
const Piracy = lazyLoadWithErrorBoundary(() => import("@/pages/Piracy"), "Piracy");
const PlagiarismChecker = lazyLoadWithErrorBoundary(() => import("@/pages/PlagiarismChecker"), "PlagiarismChecker");

import "./App.css";

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
