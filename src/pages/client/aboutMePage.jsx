import { useLanguage } from "@/contexts/LanguageContext";
import { useAboutData as fetchDataHook } from "@/hooks/useAboutData";
import { AboutDataProvider } from "@/contexts/AboutDataContext";

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
  const { lang } = useLanguage();
  const { data, loading, error } = fetchDataHook(lang);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-all duration-500 md:p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading about page data:", error);
    return (
      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-all duration-500 md:p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Page</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-all duration-500 md:p-4">
      <AboutDataProvider value={{ data, loading }}>
        <HeroBanner />
        <CompanyOverview />
        <StartupJourney />
        <MissionVision />
        <ServicesHighlight />
        <CTASection />
        <TeamSection />
        <CommitmentSection />
        <TechnologiesSection />
      </AboutDataProvider>
    </div>
  );
}
