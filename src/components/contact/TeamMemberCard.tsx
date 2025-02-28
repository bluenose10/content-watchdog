
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export function TeamMemberCard() {
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  
  useEffect(() => {
    // This forces a component re-render
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <Card className="mb-10 overflow-hidden border border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 max-w-3xl mx-auto">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="aspect-square md:aspect-auto relative overflow-hidden md:col-span-1">
          <img 
            src="/lovable-uploads/5953bc93-b6b1-4b80-b98c-3ac53016c5b3.png" 
            alt="Mark Moran" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardContent className="p-4 flex flex-col justify-center md:col-span-2">
          <h2 className="text-xl font-bold mb-2">Mark Moran</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Skilled at finding hard to locate content
          </p>
          
          <div className="space-y-3 mb-4">
            <p className="text-sm">
              I'm a skilled digital detective with a knack for uncovering valuable content across the vast expanse of the internet.
            </p>
            <p className="text-sm">
              My expertise lies in combining technical know-how with creative problem-solving to find exactly what's needed fast, accurately, and ethically.
            </p>
            {/* Adding a hidden timestamp to force refresh */}
            <span className="hidden">{timestamp}</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>contact@influenceguard.com</span>
            </div>
          </div>
          
          <Button 
            variant="default" 
            className="mt-4 flex items-center gap-2 text-sm" 
            size="sm"
            asChild
          >
            <a href="https://www.linkedin.com/in/mark-moran-blockchain-solutions-architect/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-3 w-3" />
              Connect on LinkedIn
            </a>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
