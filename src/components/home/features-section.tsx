
import { FeatureCard } from "@/components/ui/feature-card";
import { FEATURES } from "@/lib/constants";
import { AlertTriangle, Search, Bell, FileCheck, BarChart3, Shield, Camera, FileText, Video, Hash } from "lucide-react";

export function FeaturesSection() {
  // Enhanced features with specific capabilities
  const enhancedFeatures = [
    {
      title: "Smart Content Detection",
      description: "Our AI can recognize your images, videos, and text even when they've been cropped, filtered, or partially modified.",
      icon: <Camera className="h-5 w-5 md:h-6 md:w-6" />
    },
    {
      title: "Multi-Platform Monitoring",
      description: "We scan 50+ platforms including Instagram, TikTok, Twitter, Pinterest, and millions of websites for your content.",
      icon: <Bell className="h-5 w-5 md:h-6 md:w-6" />
    },
    {
      title: "Automated Takedowns",
      description: "One-click DMCA notices with 92% success rate, saving you hours of manual work and legal hassle.",
      icon: <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
    }
  ];

  return (
    <section className="h-full">
      <div className="h-full">
        <div className="space-y-4">
          {enhancedFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
