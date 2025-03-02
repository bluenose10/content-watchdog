
import { Layout } from "@/components/layout/layout";
import { useEffect } from "react";
import { MissionCard } from "@/components/contact/MissionCard";
import { TechnologyCard } from "@/components/contact/TechnologyCard";
import { ServiceLevelCard } from "@/components/contact/ServiceLevelCard";
import { TeamMemberCard } from "@/components/contact/TeamMemberCard";
import { EducationCard } from "@/components/contact/EducationCard";

export default function Contact() {
  useEffect(() => {
    // Scroll to the top of the page when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container max-w-5xl py-16 md:py-24">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gradient">About Us</h1>
        
        {/* Company mission section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <MissionCard />
          <TechnologyCard />
        </div>
        
        {/* Service level overview */}
        <div className="mb-12">
          <ServiceLevelCard />
        </div>
        
        {/* Team member contact card */}
        <TeamMemberCard />
        
        {/* Education background */}
        <div className="mt-12">
          <EducationCard />
        </div>
      </div>
    </Layout>
  );
}
