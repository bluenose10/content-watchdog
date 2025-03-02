
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute, AccessLevel, PremiumFeature } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TakedownForm } from "@/components/protection/TakedownForm";
import { useNavigate } from "react-router-dom";
import { ProtectionHeader } from "@/components/protection/ProtectionHeader";
import { ProtectionToolsTab } from "@/components/protection/ProtectionToolsTab";
import { TakedownProcessTab } from "@/components/protection/TakedownProcessTab";
import { LegalResourcesTab } from "@/components/protection/LegalResourcesTab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Protection() {
  const { user } = useAuth();
  const { isReady, accessLevel } = useProtectedRoute(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTakedownForm, setShowTakedownForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "social" | "hosting" | null>(null);
  const navigate = useNavigate();
  
  const isPremium = accessLevel === AccessLevel.PREMIUM || accessLevel === AccessLevel.ADMIN;

  if (!isReady || isLoading) {
    return <LoadingState />;
  }

  const fullName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleRedirectToUpgrade = () => {
    navigate('/checkout');
  };

  // If not premium, show upgrade message
  if (!isPremium) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container px-4 py-12">
          <div className="max-w-3xl mx-auto mt-12">
            <Alert className="bg-amber-50 border-amber-200 mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800 text-lg">Premium Feature</AlertTitle>
              <AlertDescription className="text-amber-700">
                Content protection tools are available exclusively to premium members. 
                Upgrade your account to access powerful tools to protect your content.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-lg border border-primary/20 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3 text-primary">Unlock Content Protection</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Monitor your content across the web, automatically file takedown notices, 
                and access professional legal resources to protect your intellectual property.
              </p>
              <Button size="lg" onClick={handleRedirectToUpgrade}>
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Premium users see full protection tools
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
