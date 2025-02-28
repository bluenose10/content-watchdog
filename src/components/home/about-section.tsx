
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle, Clock, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section id="about" className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">About Influence Guard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in protecting digital content across the web
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Card className="glass-card">
              <CardContent className="p-6">
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
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Our Team
                </h3>
                <p className="text-muted-foreground">
                  Founded by a team of content protection experts and technology innovators, Influence Guard brings together decades of experience in digital rights management, intellectual property law, and artificial intelligence.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <AnimatedGradientBorder 
              gradientClasses="from-primary/20 via-primary/40 to-primary/20"
              animationDuration="8s" 
              className="rounded-xl overflow-hidden"
            >
              <img 
                src="https://placehold.co/600x400/png" 
                alt="Influence Guard Team" 
                className="w-full h-auto rounded-lg"
              />
            </AnimatedGradientBorder>
            
            <div className="bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/30">
              <h3 className="text-xl font-semibold mb-4">Choose Your Protection Level</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Self-Service Platform</h4>
                    <p className="text-sm text-muted-foreground">
                      Use our powerful tools to search and monitor your content yourself with our affordable subscription plans.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Fully Managed Service</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Let our experts handle everything with our comprehensive managed monitoring service:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span className="text-sm">24/7 continuous monitoring across all platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span className="text-sm">All content formats supported (video, images, text, audio)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CalendarClock className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span className="text-sm">Weekly detailed reports with actionable recommendations</span>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">Enterprise managed service</span>
                          <p className="text-xl font-bold text-primary">$1,999.00 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
                        </div>
                        <Button size="sm" asChild>
                          <Link to="/contact">Contact Sales</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
