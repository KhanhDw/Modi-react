// import HeroBanner from "@/components/about_v1/HeroBanner"
// import Mission from "@/components/about_v1/Mission"
// import Services from "@/components/about_v1/Services"
// import WhyChooseUs from "@/components/about_v1/WhyChooseUs"
// import Customers from "@/components/about_v1/Customers"
// import Contact from "@/components/about_v1/Contact"


import { HeroBanner } from "@/components/about_v2/hero-banner"
import { CompanyOverview } from "@/components/about_v2/company-overview"
import { StartupJourney } from "@/components/about_v2/startup-journey"
import { MissionVision } from "@/components/about_v2/mission-vision"
import { ServicesHighlight } from "@/components/about_v2/services-highlight"
import { CTASection } from "@/components/about_v2/cta-section"
import { TeamSection } from "@/components/about_v2/team-section"
import { CommitmentSection } from "@/components/about_v2/commitment-section"
import { TechnologiesSection } from "@/components/about_v2/technologies-section"




/**
 * About Page Component
 * Trang giới thiệu công ty với đầy đủ tính năng:
 * - Dark/Light mode
 * - Multi-language (VI/EN)
 * - Responsive design
 * - Smooth animations
 *
 * Structure:
 * - ThemeProvider: Quản lý theme
 * - LanguageProvider: Quản lý ngôn ngữ
 * - ThemeToggle: Nút điều khiển
 * - Các sections: Hero, Mission, Services, etc.
 */

export default function About() {
  return (
    <div className="min-h-screen transition-all duration-500 md:p-4">
      {/* 
      <HeroBanner />
      <Mission />
      <Services />
      <WhyChooseUs />
      <Customers />
      <Contact /> 
      */}

      {/* -------- */}
      {/* Vesion 2 */}
      {/* -------- */}


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
  )
}





