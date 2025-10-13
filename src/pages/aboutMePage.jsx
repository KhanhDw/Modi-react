import { HeroBanner } from "@/components/about_v2/hero-banner";
import { CompanyOverview } from "@/components/about_v2/company-overview";
import { StartupJourney } from "@/components/about_v2/startup-journey";
import { MissionVision } from "@/components/about_v2/mission-vision";
import { ServicesHighlight } from "@/components/about_v2/services-highlight";
import { CTASection } from "@/components/about_v2/cta-section";
import { TeamSection } from "@/components/about_v2/team-section";
import { CommitmentSection } from "@/components/about_v2/commitment-section";
import { TechnologiesSection } from "@/components/about_v2/technologies-section";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-all duration-500 md:p-4">
      <HeroBanner />
      <CompanyOverview />
      <StartupJourney />
      <MissionVision />
      <ServicesHighlight />
      <CTASection />
      <TeamSection />
      <CommitmentSection />
      <TechnologiesSection />
    </div>
  );
}
