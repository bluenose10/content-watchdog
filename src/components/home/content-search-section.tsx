
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { SearchTabs } from "./search/SearchTabs";
import { handleTextSearch, handleImageSearch } from "./search/searchService";

export function ContentSearchSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleNameSearch = async (query: string, params?: any) => {
    try {
      setIsLoading(true);
      console.log("Name search with query:", query, "and params:", params);
      const searchId = await handleTextSearch(query, "name", user, params);
      navigate(`/results?id=${searchId}`);
    } catch (error) {
      console.error("Name search error:", error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHashtagSearch = async (query: string, params?: any) => {
    try {
      setIsLoading(true);
      console.log("Hashtag search with query:", query, "and params:", params);
      const searchId = await handleTextSearch(query, "hashtag", user, params);
      navigate(`/results?id=${searchId}`);
    } catch (error) {
      console.error("Hashtag search error:", error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSearchSubmit = async (file: File, params?: any) => {
    try {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to use image search",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      setIsLoading(true);
      console.log("Image search with file:", file.name, "and params:", params);
      const searchId = await handleImageSearch(file, user, params);
      navigate(`/results?id=${searchId}`);
    } catch (error) {
      console.error("Image search error:", error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="search" className="h-full">
      <div className="h-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Content Search</h2>
          <p className="text-sm text-muted-foreground">
            Find and protect your content
          </p>
        </div>

        <Card className="glass-card">
          <CardContent className="p-4 sm:p-6">
            <SearchTabs
              onNameSearch={handleNameSearch}
              onHashtagSearch={handleHashtagSearch}
              onImageSearch={handleImageSearchSubmit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
