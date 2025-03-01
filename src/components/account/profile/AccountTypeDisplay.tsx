
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { AccessLevel } from "@/hooks/useProtectedRoute";

interface AccountTypeDisplayProps {
  accessLevel: AccessLevel;
  isAdmin: boolean;
}

export function AccountTypeDisplay({ accessLevel, isAdmin }: AccountTypeDisplayProps) {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate('/#pricing');
  };

  if (isAdmin) {
    return (
      <div className="flex items-center">
        <div className="py-2 px-3 rounded-md border bg-muted/50 text-sm">
          Admin Account
        </div>
        <Badge variant="destructive" className="ml-2">
          Admin
        </Badge>
      </div>
    );
  } else if (accessLevel === AccessLevel.PREMIUM) {
    return (
      <div className="py-2 px-3 rounded-md border bg-muted/50 text-sm">
        Premium Plan
      </div>
    );
  } else {
    return (
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
    );
  }
}
