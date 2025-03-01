
import { useState, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Mail, Shield, Settings, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>(user?.user_metadata?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.user_metadata?.avatar_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserInitials = () => {
    if (name) {
      return name.split(" ").map(part => part[0]).join("").toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

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

  const handlePhotoButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update state with new avatar URL
      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);
      
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been uploaded successfully.",
      });
      
      // Auto-save the profile with the new avatar
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) throw updateError;
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your photo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpgradeClick = () => {
    navigate('/#pricing');
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
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handlePhotoButtonClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} className="mr-2" />
                  Change Photo
                </>
              )}
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
                <Button 
                  variant="link" 
                  size="sm" 
                  className="ml-2"
                  onClick={handleUpgradeClick}
                >
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
}
