
import { CopyrightSection } from "./CopyrightSection";
import { PlagiarismSection } from "./PlagiarismSection";
import { ContentTheftSection } from "./ContentTheftSection";
import { KeyDifferencesSection } from "./KeyDifferencesSection";
import { OverlapsSection } from "./OverlapsSection";
import { BusinessImpactSection } from "./BusinessImpactSection";

export const ContentTheftMainContent = () => {
  return (
    <div className="lg:col-span-2 space-y-12">
      <CopyrightSection />
      <PlagiarismSection />
      <ContentTheftSection />
      <KeyDifferencesSection />
      <OverlapsSection />
      <BusinessImpactSection />
    </div>
  );
};
