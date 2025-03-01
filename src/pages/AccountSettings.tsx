
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { AccountTabs } from "@/components/account/AccountTabs";

export default function AccountSettings() {
  const { isReady } = useProtectedRoute(true);

  // Show loading state while auth is being checked
  if (!isReady) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 pt-8 text-primary">Account Settings</h1>
        <AccountTabs />
      </main>
      <Footer />
    </div>
  );
}
