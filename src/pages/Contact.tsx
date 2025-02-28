
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function Contact() {
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  
  useEffect(() => {
    // This forces a component re-render
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <Layout>
      <div className="container max-w-4xl py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        <Card className="mb-10 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square md:aspect-auto relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Profile Photo" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-3">Mark Moran {/* Key change: John Smith to Mark Moran */}</h2>
              <p className="text-muted-foreground mb-6">
                Founder & Content Protection Specialist
              </p>
              
              <div className="space-y-4 mb-6">
                <p>
                  With over 10 years of experience in digital rights management and content protection, 
                  I've helped hundreds of creators and businesses secure their intellectual property across the web.
                </p>
                <p>
                  I hold certifications in cybersecurity and copyright law, with a background in computer science 
                  from the University of Technology.
                </p>
                {/* Adding a hidden timestamp to force refresh */}
                <span className="hidden">{timestamp}</span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contact@influenceguard.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-6 flex items-center gap-2" 
                asChild
              >
                <a href="https://www.linkedin.com/in/mark-moran-blockchain-solutions-architect/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
              </Button>
            </CardContent>
          </div>
        </Card>
        
        <div className="bg-muted/50 rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Educational Background</h2>
          <ul className="space-y-4">
            <li>
              <div className="font-medium">Master's Degree in Cyber Security</div>
              <div className="text-sm text-muted-foreground">Edge Hill University, UK</div>
            </li>
            <li>
              <div className="font-medium">BSc (Hons) In Computing</div>
              <div className="text-sm text-muted-foreground">Edge Hill University, UK</div>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
