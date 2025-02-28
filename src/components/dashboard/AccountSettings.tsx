
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserRound, Mail, Shield, Settings } from "lucide-react";

export const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>(user?.user_metadata?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");

  const getUserInitials = () => {
    if (name) {
      return name.split(" ").map(part => part[0]).join("").toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  const handleSaveProfile = async () => {
    try {
      // In a real implementation, this would update the user profile
      // await supabase.auth.updateUser({ data: { name } });
      
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
          Account Settings
        </CardTitle>
        <CardDescription>
          Manage your account details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={name} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="mt-2">
              Change Photo
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserRound size={16} className="text-muted-foreground" />
                <Label htmlFor="name">Full Name</Label>
              </div>
              {isEditing ? (
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                />
              ) : (
                <div className="py-2 px-3 rounded-md border bg-muted/50">{name || "Not provided"}</div>
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
              <div className="flex items-center">
                <div className="py-2 px-3 rounded-md border bg-muted/50 text-sm">
                  Free Plan
                </div>
                <Button variant="link" size="sm" className="ml-2">
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
            <Button variant="secondary" className="ml-2">
              Change Password
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
