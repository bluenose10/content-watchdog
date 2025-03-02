
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useProtectedRoute, AccessLevel } from "@/hooks/useProtectedRoute";
import { AvatarUploader } from "./profile/AvatarUploader";
import { ProfileForm } from "./profile/ProfileForm";
import { ProfileActions } from "./profile/ProfileActions";

export function ProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>(user?.user_metadata?.name || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.user_metadata?.avatar_url || "");
  const { accessLevel, isAdmin } = useProtectedRoute(true);

  const handleSaveProfile = async () => {
    try {
      // In a real implementation, this would update the user profile
      const { error } = await supabase.auth.updateUser({
        data: { 
          name,
          avatar_url: avatarUrl
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={20} />
          Profile Information
        </CardTitle>
        <CardDescription>
          Manage your account details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <AvatarUploader 
            userId={user?.id}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            name={name}
            email={user?.email}
          />
          
          <ProfileForm 
            userId={user?.id}
            userName={name}
            setUserName={setName}
            email={user?.email || ""}
            isEditing={isEditing}
            accessLevel={accessLevel}
            isAdmin={isAdmin}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ProfileActions 
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onSave={handleSaveProfile}
        />
      </CardFooter>
    </Card>
  );
}
