
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BarChart3, CheckCircle, Linkedin, Mail, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Contact() {
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  
  useEffect(() => {
    // This forces a component re-render
    setTimestamp(new Date().toISOString());
    
    // Scroll to the top of the page when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container max-w-5xl py-12 md:py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gradient">About Us</h1>
        
        {/* Company mission section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
            before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
            after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Our Mission
              </h3>
              <p className="mb-4 text-muted-foreground">
                We started Influence Guard with a simple mission: to give content creators and businesses complete control over how their work is used online.
              </p>
              <p className="text-muted-foreground">
                In today's digital landscape, protecting your intellectual property is more challenging than ever. Our team of experts combines advanced technology with personalized service to ensure your content remains yours.
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
            before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
            after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Our Team & Technology
              </h3>
              <p className="mb-4 text-muted-foreground">
                Founded by a team of content protection experts and technology innovators, Influence Guard brings together decades of experience in digital rights management, intellectual property law, and artificial intelligence.
              </p>
              <p className="text-muted-foreground">
                Our proprietary scanning technology processes over 1 million pieces of content daily, comparing visual fingerprints and text patterns to detect even slightly modified copies of your work.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Service level overview */}
        <div className="mb-12">
          <Card className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
            before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
            after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Choose Your Protection Level</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Self-Service Platform</h4>
                      <p className="text-sm text-muted-foreground">
                        Perfect for bloggers, photographers, and small businesses. Use our powerful tools to search and monitor your content yourself with our affordable subscription plans.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Fully Managed Service</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Ideal for agencies, large brands and professional creators with our comprehensive managed monitoring service.
                      </p>
                      <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Enterprise managed service</span>
                          <Button size="sm" asChild>
                            <a href="mailto:contact@influenceguard.com">Contact Sales</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Team member contact card */}
        <h2 className="text-2xl font-bold text-center mb-6">Our Team</h2>
        <Card className="mb-10 overflow-hidden border border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square md:aspect-auto relative overflow-hidden">
              <img 
                src="/lovable-uploads/5953bc93-b6b1-4b80-b98c-3ac53016c5b3.png" 
                alt="Mark Moran" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-3">Mark Moran</h2>
              <p className="text-muted-foreground mb-6">
                Skilled at finding hard to locate content
              </p>
              
              <div className="space-y-4 mb-6">
                <p>
                  I'm a skilled digital detective with a knack for uncovering valuable content across the vast expanse of the internet.
                </p>
                <p>
                  My expertise lies in combining technical know-how with creative problem-solving to find exactly what's needed fast, accurately, and ethically. Let's turn the internet's chaos into your competitive advantage.
                </p>
                {/* Adding a hidden timestamp to force refresh */}
                <span className="hidden">{timestamp}</span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contact@influenceguard.com</span>
                </div>
              </div>
              
              <Button 
                variant="default" 
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
        
        <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
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
