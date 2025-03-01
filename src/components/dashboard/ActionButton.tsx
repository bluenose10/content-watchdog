
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionButtonProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "default" | "danger";
}

export function ActionButton({ to, icon: Icon, title, description, variant = "default" }: ActionButtonProps) {
  const isDefaultVariant = variant === "default";
  
  const bgClasses = isDefaultVariant
    ? "bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10"
    : "bg-gradient-to-r from-red-500/5 to-amber-500/5 hover:from-red-500/10 hover:to-amber-500/10";
  
  const iconColorClass = getIconColorClass(title);
  
  return (
    <Button variant="secondary" className={`justify-start h-auto py-3 px-4 ${bgClasses}`} asChild>
      <Link to={to}>
        <Icon className={`mr-2 h-4 w-4 ${iconColorClass}`} />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </Link>
    </Button>
  );
}

// Helper function to get the appropriate icon color class based on the button title
function getIconColorClass(title: string): string {
  switch (title) {
    case "New Search":
      return "text-indigo-600 dark:text-indigo-400";
    case "Monitoring":
      return "text-blue-600 dark:text-blue-400";
    case "Analytics":
      return "text-violet-600 dark:text-violet-400";
    case "Authenticity":
      return "text-purple-600 dark:text-purple-400";
    case "Plagiarism":
      return "text-green-600 dark:text-green-400";
    case "DMCA Filing":
      return "text-amber-600 dark:text-amber-400";
    case "Protection":
      return "text-red-600 dark:text-red-400";
    case "Account":
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-primary";
  }
}
