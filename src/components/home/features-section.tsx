
import { FeatureCard } from "@/components/ui/feature-card";
import { FEATURES } from "@/lib/constants";
import { AlertTriangle, Search, Bell, FileCheck, BarChart3, Shield } from "lucide-react";

export function FeaturesSection() {
  // Map feature titles to icons
  const getIconForFeature = (title: string) => {
    switch (title) {
      case "Advanced Search":
        return <Search className="h-6 w-6" />;
      case "Real-time Alerts":
        return <Bell className="h-6 w-6" />;
      case "Automated Protection":
        return <AlertTriangle className="h-6 w-6" />;
      case "DMCA Assistance":
        return <FileCheck className="h-6 w-6" />;
      case "Match Level System":
        return <BarChart3 className="h-6 w-6" />;
      default:
        return <Search className="h-6 w-6" />;
    }
  };

  // Select three features for the compact display
  const displayFeatures = FEATURES.slice(0, 3);

  return (
    <section id="features" className="h-full">
      <div className="h-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Key Features</h2>
          <p className="text-sm text-muted-foreground">
            Powerful tools for content protection
          </p>
        </div>

        <div className="space-y-4">
          {displayFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={getIconForFeature(feature.title)}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
