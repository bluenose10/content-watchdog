
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TakedownForm } from "@/components/protection/TakedownForm";
import { useNavigate } from "react-router-dom";
import { ProtectionHeader } from "@/components/protection/ProtectionHeader";
import { ProtectionToolsTab } from "@/components/protection/ProtectionToolsTab";
import { TakedownProcessTab } from "@/components/protection/TakedownProcessTab";
import { LegalResourcesTab } from "@/components/protection/LegalResourcesTab";

export default function Protection() {
  const { user } = useAuth();
  const { isReady } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTakedownForm, setShowTakedownForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "social" | "hosting" | null>(null);
  const navigate = useNavigate();
  
  if (!isReady || isLoading) {
    return <LoadingState />;
  }

  const fullName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <ProtectionHeader fullName={fullName} avatarUrl={avatarUrl} />
        
        <Tabs defaultValue="protection" className="mb-8">
          <TabsList className="mb-4 flex flex-col sm:flex-row w-full sm:w-auto gap-1 sm:gap-0">
            <TabsTrigger value="protection">Protection Tools</TabsTrigger>
            <TabsTrigger value="takedowns">Takedown Process</TabsTrigger>
            <TabsTrigger value="resources">Legal Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="protection">
            <ProtectionToolsTab />
          </TabsContent>
          
          <TabsContent value="takedowns">
            <TakedownProcessTab />
          </TabsContent>
          
          <TabsContent value="resources">
            <LegalResourcesTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Dialog for takedown form */}
      <Dialog open={showTakedownForm} onOpenChange={setShowTakedownForm}>
        <DialogContent className="max-w-2xl">
          {selectedTemplate && (
            <TakedownForm
              templateType={selectedTemplate}
              onBack={() => setShowTakedownForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
