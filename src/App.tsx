
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import Protection from "./pages/Protection";
import Results from "./pages/Results";
import Search from "./pages/Search";
import Analytics from "./pages/Analytics";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import { TanStackQueryProvider } from "./context/QueryProvider";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import MockCheckout from "./pages/MockCheckout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TanStackQueryProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/protection" element={<Protection />} />
              <Route path="/results" element={<Results />} />
              <Route path="/search" element={<Search />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/canceled" element={<PaymentCanceled />} />
              <Route path="/checkout" element={<MockCheckout />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </TanStackQueryProvider>
    </ThemeProvider>
  );
}

export default App;
