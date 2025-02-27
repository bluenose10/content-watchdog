
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtSign, Hash, Image } from "lucide-react";
import { useState } from "react";
import { NameSearch } from "./NameSearch";
import { HashtagSearch } from "./HashtagSearch";
import { ImageSearch } from "./ImageSearch";

interface SearchTabsProps {
  onNameSearch: (query: string) => void;
  onHashtagSearch: (query: string) => void;
  onImageSearch: (file: File) => void;
  isLoading: boolean;
}

export function SearchTabs({ 
  onNameSearch, 
  onHashtagSearch, 
  onImageSearch,
  isLoading 
}: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState("name");

  return (
    <Tabs 
      defaultValue="name" 
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="name" className="text-xs sm:text-sm">
          <AtSign className="h-3 w-3 mr-1" />
          Name
        </TabsTrigger>
        <TabsTrigger value="hashtag" className="text-xs sm:text-sm">
          <Hash className="h-3 w-3 mr-1" />
          Hashtag
        </TabsTrigger>
        <TabsTrigger value="image" className="text-xs sm:text-sm">
          <Image className="h-3 w-3 mr-1" />
          Image
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="name">
        <NameSearch onSearch={onNameSearch} isLoading={isLoading && activeTab === "name"} />
      </TabsContent>
      
      <TabsContent value="hashtag">
        <HashtagSearch onSearch={onHashtagSearch} isLoading={isLoading && activeTab === "hashtag"} />
      </TabsContent>
      
      <TabsContent value="image">
        <ImageSearch onSearch={onImageSearch} isLoading={isLoading && activeTab === "image"} />
      </TabsContent>
    </Tabs>
  );
}
