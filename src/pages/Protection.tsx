
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TakedownForm } from "@/components/protection/TakedownForm";
import { UserHeader } from "@/components/protection/UserHeader";
import { ProtectionTools } from "@/components/protection/ProtectionTools";
import { TakedownProcess } from "@/components/protection/TakedownProcess";
import { LegalResources } from "@/components/protection/LegalResources";

export default function Protection() {
  const { user } = useAuth();
  const { isReady } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTakedownForm, setShowTakedownForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "social" | "hosting" | null>(null);
  
  if (!isReady || isLoading) {
    return <LoadingState />;
  }

  const fullName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const firstName = fullName.split(' ')[0];
  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleTemplateSelect = (type: "standard" | "social" | "hosting") => {
    setSelectedTemplate(type);
    setShowTakedownForm(true);
  };

  const handleNewTakedownRequest = () => {
    setSelectedTemplate("standard");
    setShowTakedownForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-12">
        <UserHeader fullName={fullName} avatarUrl={avatarUrl} />
        
        <Tabs defaultValue="protection" className="mb-8">
          <TabsList className="mb-4 flex flex-col sm:flex-row w-full sm:w-auto gap-1 sm:gap-0">
            <TabsTrigger value="protection">Protection Tools</TabsTrigger>
            <TabsTrigger value="takedowns">Takedown Process</TabsTrigger>
            <TabsTrigger value="resources">Legal Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="protection">
            <ProtectionTools />
          </TabsContent>
          
          <TabsContent value="takedowns">
            <TakedownProcess 
              onNewTakedownRequest={handleNewTakedownRequest}
              onTemplateSelect={handleTemplateSelect}
            />
          </TabsContent>
          
          <TabsContent value="resources">
            <LegalResources />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

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
