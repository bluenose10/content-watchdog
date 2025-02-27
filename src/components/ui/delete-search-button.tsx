
import { useState } from "react";
import { Button } from "./button";
import { Trash2 } from "lucide-react";
import { deleteSearchQuery } from "@/lib/db-service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteSearchButtonProps {
  searchId: string;
  searchType: string;
}

export function DeleteSearchButton({ searchId, searchType }: DeleteSearchButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Show loading toast
      toast({
        title: "Deleting search record...",
        description: searchType === 'image' 
          ? "Removing image and search results" 
          : "Removing search results",
      });
      
      // Call the delete function
      await deleteSearchQuery(searchId);
      
      // Show success toast
      toast({
        title: "Successfully deleted",
        description: "The search record has been removed",
      });
      
      // Navigate back to search page
      navigate("/search");
    } catch (error) {
      console.error("Error deleting search:", error);
      
      // Show error toast
      toast({
        title: "Delete failed",
        description: "There was a problem deleting this search record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Search
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Search Record?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this search record 
            {searchType === 'image' && " and the uploaded image"}. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
