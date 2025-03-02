
import { Lock } from "lucide-react";

interface SecurityNoticeProps {
  message: string;
  className?: string;
}

export function SecurityNotice({ message, className = "" }: SecurityNoticeProps) {
  return (
    <div className={`flex items-center justify-center text-xs text-muted-foreground gap-1 bg-accent/10 p-2 rounded-md ${className}`}>
      <Lock className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
}
