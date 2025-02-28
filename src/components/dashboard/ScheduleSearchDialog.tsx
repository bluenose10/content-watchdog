
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createSearchQuery } from "@/lib/db-service";
import { SearchQuery } from "@/lib/db-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "../home/search/ImageSearch";

interface ScheduleSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleCreated: (search: SearchQuery) => void;
}

export function ScheduleSearchDialog({ 
  open, 
  onOpenChange,
  onScheduleCreated
}: ScheduleSearchDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<"name" | "hashtag" | "image">("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [scheduleInterval, setScheduleInterval] = useState("daily");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to schedule searches",
        variant: "destructive",
      });
      return;
    }
    
    if (searchType !== "image" && !searchQuery) {
      toast({
        title: "Search query required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    
    if (searchType === "image" && !selectedImage) {
      toast({
        title: "Image required",
        description: "Please upload an image to search for",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a new search query with scheduling
      const newSearch: SearchQuery = {
        user_id: user.id,
        query_type: searchType,
        query_text: searchType !== "image" ? searchQuery : undefined,
        scheduled: true,
        schedule_interval: scheduleInterval,
      };
      
      // If image search, upload the image
      if (searchType === "image" && selectedImage) {
        // In a real implementation, you'd upload the image here
        // and set the image_url property
        // newSearch.image_url = imageUrl;
        toast({
          title: "Demo mode",
          description: "Image upload is not implemented in this demo",
        });
      }
      
      // Save the scheduled search
      const createdSearch = await createSearchQuery(newSearch);
      
      toast({
        title: "Search scheduled",
        description: `Your search will run ${scheduleInterval}`,
      });
      
      // Reset form and close dialog
      setSearchQuery("");
      setSelectedImage(null);
      setSearchType("name");
      setScheduleInterval("daily");
      onOpenChange(false);
      
      // Notify parent component
      onScheduleCreated(createdSearch);
      
    } catch (error) {
      console.error("Error creating scheduled search:", error);
      toast({
        title: "Failed to schedule search",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Automated Search</DialogTitle>
          <DialogDescription>
            Set up recurring content searches to monitor your content automatically.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="name" onValueChange={(value) => setSearchType(value as any)}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="name">Name</TabsTrigger>
                <TabsTrigger value="hashtag">Hashtag</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="name" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-query">Name or Username</Label>
                  <Input
                    id="name-query"
                    placeholder="Enter a name or username to monitor"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="hashtag" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hashtag-query">Hashtag</Label>
                  <Input
                    id="hashtag-query"
                    placeholder="Enter a hashtag to monitor (without #)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <ImageUpload
                    onImageSelected={(file) => setSelectedImage(file)}
                    maxSizeMB={5}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2">
              <Label htmlFor="schedule">Run Schedule</Label>
              <Select value={scheduleInterval} onValueChange={setScheduleInterval}>
                <SelectTrigger id="schedule">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every hour</SelectItem>
                  <SelectItem value="daily">Every day</SelectItem>
                  <SelectItem value="weekly">Every week</SelectItem>
                  <SelectItem value="monthly">Every month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Schedule Search"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
