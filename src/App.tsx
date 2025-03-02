
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/context/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Search from "@/pages/Search";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import AccountSettings from "@/pages/AccountSettings";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCanceled from "@/pages/PaymentCanceled";
import MockCheckout from "@/pages/MockCheckout";
import Monitoring from "@/pages/Monitoring";
import Protection from "@/pages/Protection";
import SearchHistory from "@/pages/SearchHistory";

import "./App.css";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="influence-guard-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/history" element={<SearchHistory />} />
              <Route path="/results" element={<Results />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/canceled" element={<PaymentCanceled />} />
              <Route path="/checkout" element={<MockCheckout />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/protection" element={<Protection />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
