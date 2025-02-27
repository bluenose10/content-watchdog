
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="about" className="h-full">
      <div className="h-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">About Us</h2>
          <p className="text-sm text-muted-foreground">Our mission and story</p>
        </div>
        
        <Card className="glass-card h-[calc(100%-4rem)]">
          <CardContent className="p-4 sm:p-6 h-full flex flex-col">
            <div className="space-y-4">
              <AnimatedGradientBorder 
                gradientClasses="from-primary/20 via-primary/40 to-primary/20"
                animationDuration="8s" 
                className="rounded-xl overflow-hidden"
              >
                <img 
                  src="https://placehold.co/600x300/png" 
                  alt="About Influence Guard" 
                  className="w-full h-auto rounded-lg"
                />
              </AnimatedGradientBorder>
              
              <div>            
                <p className="text-sm text-muted-foreground">
                  We started Influence Guard with a simple mission: to give content creators control over how their work is used online.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
