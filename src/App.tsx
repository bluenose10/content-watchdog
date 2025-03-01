
import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/context/LanguageContext';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Search from '@/pages/Search';
import Results from '@/pages/Results';
import ResetPassword from '@/pages/ResetPassword';
import Protection from '@/pages/Protection';
import PlagiarismChecker from '@/pages/PlagiarismChecker';
import ContentAuthenticity from '@/pages/ContentAuthenticity';
import Analytics from '@/pages/Analytics';
import Monitoring from '@/pages/Monitoring';
import AccountSettings from '@/pages/AccountSettings';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCanceled from '@/pages/PaymentCanceled';
import MockCheckout from '@/pages/MockCheckout';
import SearchHistory from '@/pages/SearchHistory';
import Contact from '@/pages/Contact';
import Piracy from '@/pages/Piracy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';

function App() {
  const queryClient = new QueryClient()

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/results" element={<Results />} />
                <Route path="/search/history" element={<SearchHistory />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/protection" element={<Protection />} />
                <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
                <Route path="/content-authenticity" element={<ContentAuthenticity />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/monitoring" element={<Monitoring />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/canceled" element={<PaymentCanceled />} />
                <Route path="/checkout" element={<MockCheckout />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/piracy" element={<Piracy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
