
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCheck, Shield, Star, Image, FileText, Video } from "lucide-react";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="h-full">
      <div className="h-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to Protect Your Content?</h2>
          <p className="text-sm text-muted-foreground">Join thousands of creators who trust us</p>
        </div>
        
        <div className="bg-primary text-primary-foreground rounded-xl p-5 h-[calc(100%-4rem)] flex flex-col">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCheck className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">Protection for all your content types</p>
              </div>
              <div className="flex items-center gap-2">
                <Image className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">Photos & Images</p>
              </div>
              <div className="flex items-center gap-2">
                <Video className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">Videos & Reels</p>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">Articles & Blog Posts</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">92% success rate in content takedowns</p>
              </div>
            </div>
            
            <p className="text-sm text-primary-foreground/80 mb-4 text-center">
              Our customers have protected over 1.5 million pieces of content and recovered thousands in lost revenue.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90 button-animation">
              <Link to="/signup">
                Start Protecting Your Content Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
