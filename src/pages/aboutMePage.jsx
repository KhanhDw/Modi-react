import HeroBanner from "../components/about/HeroBanner"
import Mission from "../components/about/Mission"
import Services from "../components/about/Services"
import WhyChooseUs from "../components/about/WhyChooseUs"
import Customers from "../components/about/Customers"
import Contact from "../components/about/Contact"

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
          <HeroBanner />
          <Mission />
          <Services />
          <WhyChooseUs />
          <Customers />
          <Contact />
        </div>
  )
}
