
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Lock, BellRing, CreditCard } from "lucide-react";
import { ProfileTab } from "./ProfileTab";
import { SecurityTab } from "./SecurityTab";
import { NotificationsTab } from "./NotificationsTab";
import { BillingTab } from "./BillingTab";

export function AccountTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <UserRound size={16} />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock size={16} />
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <BellRing size={16} />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center gap-2">
          <CreditCard size={16} />
          Billing
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>
      
      <TabsContent value="security">
        <SecurityTab />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
      
      <TabsContent value="billing">
        <BillingTab />
      </TabsContent>
    </Tabs>
  );
}
