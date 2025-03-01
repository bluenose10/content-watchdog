
import { Button } from "@/components/ui/button";
import { Sliders } from "lucide-react";

interface AdvancedSearchButtonProps {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  disabled?: boolean;
}

export function AdvancedSearchButton({ 
  showAdvanced, 
  setShowAdvanced, 
  disabled = false 
}: AdvancedSearchButtonProps) {
  return (
    <div className="mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2 text-xs"
        onClick={() => setShowAdvanced(!showAdvanced)}
        disabled={disabled}
      >
        <Sliders className="w-3.5 h-3.5" />
        {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
      </Button>
    </div>
  );
}
