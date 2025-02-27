
import { FeatureCard } from "@/components/ui/feature-card";
import { FEATURES } from "@/lib/constants";
import { AlertTriangle, Search, Bell, FileCheck, BarChart3 } from "lucide-react";

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

  return (
    <section id="features" className="section-padding">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Powerful Protection Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive tools help you find and protect your content across the web
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {FEATURES.map((feature, index) => (
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
