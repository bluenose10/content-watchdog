
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectionToolsTab } from "../protection/ProtectionToolsTab";
import { TakedownProcessTab } from "../protection/TakedownProcessTab";
import { LegalResourcesTab } from "../protection/LegalResourcesTab";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ProtectionTab() {
  const { user } = useAuth();
  const fullName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <Card>
      <CardHeader className="pt-8">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Content Protection</span>
        </CardTitle>
        <CardDescription>
          Manage your content protection and takedown tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Hello, {fullName}</h2>
          <p className="text-muted-foreground">
            As a premium member, you have access to our suite of content protection tools. 
            Monitor your content, initiate takedowns, and access legal resources.
          </p>
        </div>

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
      </CardContent>
    </Card>
  );
}
