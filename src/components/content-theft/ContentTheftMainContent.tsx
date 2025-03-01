
import { CopyrightSection } from "./CopyrightSection";
import { PlagiarismSection } from "./PlagiarismSection";
import { ContentTheftSection } from "./ContentTheftSection";
import { KeyDifferencesSection } from "./KeyDifferencesSection";
import { OverlapsSection } from "./OverlapsSection";
import { BusinessImpactSection } from "./BusinessImpactSection";
import { PlagiarismCheckerSection } from "./PlagiarismCheckerSection";

export const ContentTheftMainContent = () => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <PlagiarismCheckerSection />
      <CopyrightSection />
      <PlagiarismSection />
      <ContentTheftSection />
      <KeyDifferencesSection />
      <OverlapsSection />
      <BusinessImpactSection />
    </div>
  );
};
