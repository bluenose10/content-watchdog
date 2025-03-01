
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Mail, Shield } from "lucide-react";
import { AccountTypeDisplay } from "./AccountTypeDisplay";
import { AccessLevel } from "@/hooks/useProtectedRoute";

interface ProfileFormProps {
  userId: string | undefined;
  userName: string;
  setUserName: (name: string) => void;
  email: string;
  isEditing: boolean;
  accessLevel: AccessLevel;
  isAdmin: boolean;
}

export function ProfileForm({ 
  userId, 
  userName, 
  setUserName, 
  email, 
  isEditing,
  accessLevel,
  isAdmin
}: ProfileFormProps) {
  
  return (
    <div className="flex-1 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserRound size={16} className="text-muted-foreground" />
          <Label htmlFor="name">Full Name</Label>
        </div>
        {isEditing ? (
          <Input 
            id="name" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your full name" 
          />
        ) : (
          <div className="py-2 px-3 rounded-md border bg-muted/50">{userName || "Not provided"}</div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-muted-foreground" />
          <Label htmlFor="email">Email Address</Label>
        </div>
        <div className="py-2 px-3 rounded-md border bg-muted/50">{email}</div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-muted-foreground" />
          <Label>Account Type</Label>
        </div>
        <AccountTypeDisplay accessLevel={accessLevel} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
