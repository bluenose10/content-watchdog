
import * as React from "react";
import { Download, FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportFormat, exportSearchResults } from "@/lib/export-service";
import { SearchResult } from "@/lib/db-types";
import { useToast } from "@/hooks/use-toast";

interface ExportMenuProps {
  results: SearchResult[];
  filename?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function ExportMenu({ 
  results, 
  filename = "search-results", 
  buttonVariant = "outline",
  buttonSize = "default",
  disabled = false
}: ExportMenuProps) {
  const { toast } = useToast();

  const handleExport = (format: ExportFormat) => {
    try {
      if (!results || results.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no search results available to export.",
          variant: "destructive",
        });
        return;
      }
      
      exportSearchResults(results, format, filename);
      
      toast({
        title: "Export successful",
        description: `Data has been exported in ${format.toUpperCase()} format.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileJson className="mr-2 h-4 w-4" />
          JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
