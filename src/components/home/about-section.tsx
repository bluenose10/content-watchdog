
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle, Clock, Shield, Users, Award, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section id="about" className="py-6 md:py-10 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">About Influence Guard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by over 5,000+ content creators to protect their digital assets
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 md:space-y-8">
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
          
          <div className="space-y-6 md:space-y-8">
            <Card className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
              before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
              after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Choose Your Protection Level</h3>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full shrink-0">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-sm md:text-base">Self-Service Platform</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Perfect for bloggers, photographers, and small businesses. Use our powerful tools to search and monitor your content yourself with our affordable subscription plans.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full shrink-0">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-medium mb-1 text-sm md:text-base">Fully Managed Service</h4>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">
                        Ideal for agencies, large brands and professional creators. Let our experts handle everything with our comprehensive managed monitoring service:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <span className="text-xs md:text-sm">24/7 continuous monitoring across all platforms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <span className="text-xs md:text-sm">All content formats supported (video, images, text, audio)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CalendarClock className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <span className="text-xs md:text-sm">Weekly detailed reports with actionable recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Award className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <span className="text-xs md:text-sm">Dedicated content protection specialist</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <BarChart3 className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <span className="text-xs md:text-sm">92% success rate for content removal</span>
                        </li>
                      </ul>
                      <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                          <div>
                            <span className="text-xs md:text-sm font-medium">Enterprise managed service</span>
                            <p className="text-lg md:text-xl font-bold text-primary">$1,999.00 <span className="text-xs md:text-sm font-normal text-muted-foreground">/month</span></p>
                          </div>
                          <Button size="sm" asChild>
                            <Link to="/contact">Contact Sales</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
