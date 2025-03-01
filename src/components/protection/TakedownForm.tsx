
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TakedownFormProps {
  templateType?: "standard" | "social" | "hosting";
  onBack: () => void;
}

export const TakedownForm = ({ templateType = "standard", onBack }: TakedownFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pre-filled content based on template type
  const getTemplateContent = () => {
    switch (templateType) {
      case "social":
        return "Dear [Platform Name],\n\nI am the copyright owner of [Content Description] which has been posted on your platform without my permission at [URL].\n\nI request that you remove this content as it infringes my copyright under the Digital Millennium Copyright Act (DMCA).\n\nI have a good faith belief that the use of the material in the manner complained of is not authorized by me, the copyright owner.\n\nThank you for your prompt attention to this matter.";
      
      case "hosting":
        return "To Whom It May Concern at [Hosting Provider],\n\nI am writing to notify you of unauthorized content hosted on your servers that infringes upon my exclusive copyright.\n\nThe infringing material is located at: [URL]\n\nMy original work can be found at: [Original URL]\n\nI request that you immediately remove or disable access to this material as required under the DMCA.\n\nI have a good faith belief that use of the copyrighted materials described above as allegedly infringing is not authorized by the copyright owner, its agent, or the law.";
      
      default: // standard
        return "Subject: DMCA Takedown Notice\n\nDear Sir/Madam,\n\nI am the copyright owner of [Content Description] which appears at [Original URL].\n\nI have discovered that this content has been copied without my permission to: [Infringing URL]\n\nThis letter is an official notification under Section 512(c) of the Digital Millennium Copyright Act (DMCA), and I seek the removal of the aforementioned infringing material.\n\nI am providing this notice in good faith and with the reasonable belief that my rights are being infringed.";
    }
  };

  const [formData, setFormData] = useState({
    contentUrl: "",
    originalUrl: "",
    description: "",
    noticeText: getTemplateContent(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Takedown request submitted",
        description: "Your DMCA takedown request has been sent successfully.",
      });
      onBack();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h3 className="text-lg font-medium">
          {templateType === "social" 
            ? "Social Media Takedown Request" 
            : templateType === "hosting" 
              ? "Hosting Provider Takedown Request" 
              : "Standard DMCA Takedown Request"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contentUrl">URL of infringing content</Label>
          <Input 
            id="contentUrl" 
            name="contentUrl" 
            placeholder="https://example.com/infringing-content" 
            value={formData.contentUrl} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="originalUrl">URL of your original content</Label>
          <Input 
            id="originalUrl" 
            name="originalUrl" 
            placeholder="https://yoursite.com/original-content" 
            value={formData.originalUrl} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Content description</Label>
          <Input 
            id="description" 
            name="description" 
            placeholder="Briefly describe your content" 
            value={formData.description} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noticeText">Takedown Notice</Label>
          <Textarea 
            id="noticeText" 
            name="noticeText" 
            rows={10} 
            value={formData.noticeText} 
            onChange={handleChange}
            className="font-mono text-sm"
            required
          />
          <p className="text-xs text-muted-foreground">
            Edit the template above to include your specific details. Replace all [placeholder] text.
          </p>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Takedown Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
