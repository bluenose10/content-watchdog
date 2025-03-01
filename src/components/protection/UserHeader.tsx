
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface UserHeaderProps {
  fullName: string;
  avatarUrl?: string;
}

export const UserHeader = ({ fullName, avatarUrl }: UserHeaderProps) => {
  const userInitials = getInitials(fullName);
  
  return (
    <div className="flex items-center gap-4 mb-8 pt-8">
      <Avatar className="h-16 w-16 border-2 border-primary/10">
        <AvatarImage src={avatarUrl} alt={fullName} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold text-primary">Content Protection</h1>
        <p className="text-muted-foreground">Tools and resources to protect your digital content</p>
      </div>
    </div>
  );
};
