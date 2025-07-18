"use client"

import { createContext, useContext, useState, useEffect } from "react"

/**
 * Language Context for About Page
 * Quản lý đa ngôn ngữ cho trang About
 *
 * Usage:
 * import { LanguageProvider, useLanguage } from '../contexts/about/LanguageContext'
 *
 * const { language, toggleLanguage, t } = useLanguage()
 * <p>{t("welcomeMessage")}</p>
 *
 * Để thêm ngôn ngữ mới:
 * 1. Thêm key mới vào translations object
 * 2. Thêm logic trong toggleLanguage nếu cần
 */

const LanguageContext = createContext()

const translations = {
  vi: {
    // Hero Banner
    whoAreWe: "Chúng Tôi Là Ai?",
    welcome: "Chào mừng bạn đến với [Tên thương hiệu/công ty bạn] – điểm đến lý tưởng cho mọi ý tưởng số hóa của bạn!",
    description:
      "Chúng tôi là đội ngũ trẻ, sáng tạo và chuyên nghiệp trong lĩnh vực lập trình web và ứng dụng theo yêu cầu. Chúng tôi đã và đang đồng hành cùng hàng trăm cá nhân, doanh nghiệp trong việc biến ý tưởng thành giải pháp công nghệ hiệu quả.",
    codeQuality: "Code chất",
    reasonablePrice: "Giá hợp lý",
    dedicatedSupport: "Hỗ trợ tận tâm",

    // Mission
    ourMission: "Sứ Mệnh Của Chúng Tôi",
    missionQuote: "Chúng tôi không chỉ code – Chúng tôi xây dựng giải pháp để bạn kinh doanh tốt hơn!",
    missionDescription:
      "Chúng tôi tin rằng mỗi doanh nghiệp, mỗi dự án đều có nhu cầu và câu chuyện riêng. Vì vậy, mỗi dòng code chúng tôi viết ra đều nhằm mục đích giải quyết đúng nỗi đau của khách hàng và tạo ra giá trị thực tế, không rập khuôn, không sao chép.",

    // Mission Stats
    trustedClients: "Khách hàng tin tưởng",
    completedProjects: "Dự án hoàn thành",
    yearsExperience: "Năm kinh nghiệm",
    customerSupport: "Hỗ trợ khách hàng",

    // Services
    whatWeBring: "Chúng Tôi Mang Đến Điều Gì?",
    servicesDescription:
      "Giải pháp công nghệ toàn diện từ ý tưởng đến sản phẩm hoàn thiện, được tùy chỉnh riêng cho từng khách hàng",
    websiteDesign: "Thiết kế & lập trình website",
    mobileApp: "Ứng dụng di động",
    additionalServices: "Dịch vụ đi kèm",

    // Service Items
    websiteItem1: "Website giới thiệu doanh nghiệp chuyên nghiệp, tinh gọn",
    websiteItem2: "Website bán hàng chuẩn SEO, giao diện đẹp mắt, dễ sử dụng",
    websiteItem3: "Website quản lý nội bộ: điểm danh, nhân sự, đơn hàng, khách hàng...",

    mobileItem1: "App đặt xe, đặt hàng, chăm sóc khách hàng, giáo dục...",
    mobileItem2: "Tích hợp Google Map, Firebase, thông báo đẩy (Push Notification)",
    mobileItem3: "Giao diện thân thiện, tối ưu trải nghiệm người dùng",

    additionalItem1: "Bảo trì và cập nhật website/app định kỳ",
    additionalItem2: "Viết content chuẩn SEO, lên demo giao diện miễn phí",
    additionalItem3: "Tư vấn xây dựng thương hiệu số, hỗ trợ chạy quảng cáo",

    // Why Choose Us
    whyChooseUs: "Vì Sao Bạn Nên Chọn Chúng Tôi?",
    reason1Title: 'Không "bán code", chúng tôi "giải quyết vấn đề"',
    reason1Description:
      "Chúng tôi lắng nghe mục tiêu kinh doanh của bạn và đề xuất giải pháp phù hợp – từ công nghệ đến giao diện.",
    reason2Title: "Tốc độ nhanh – Chất lượng cao",
    reason2Description:
      "Thời gian thực hiện rõ ràng, cam kết đúng tiến độ. Code được tối ưu hóa, dễ mở rộng và bảo trì.",
    reason3Title: "Giá cả minh bạch – Hỗ trợ dài hạn",
    reason3Description:
      "Không phát sinh chi phí ẩn, hợp đồng rõ ràng. Sau bàn giao, vẫn hỗ trợ kỹ thuật miễn phí trong thời gian cam kết.",
    reason4Title: "Thiết kế theo thương hiệu riêng",
    reason4Description: "Giao diện không bị trùng lặp, phản ánh được phong cách và đặc điểm thương hiệu của bạn.",

    // Customers
    ourCustomers: "Khách Hàng Của Chúng Tôi Là Ai?",
    customersDescription: "Chúng tôi phục vụ đa dạng các đối tượng khách hàng với nhu cầu số hóa khác nhau",
    startups: "Doanh nghiệp khởi nghiệp",
    startupsDescription: "Muốn có web đẹp để gọi vốn và quảng bá thương hiệu",
    stores: "Cửa hàng",
    storesDescription: "Muốn bán hàng online trên website riêng thay vì phụ thuộc vào Shopee/Facebook",
    youngPeople: "Các bạn trẻ",
    youngPeopleDescription: "Cần sản phẩm demo để khởi nghiệp, làm đồ án hoặc dự thi",
    education: "Các tổ chức giáo dục, đào tạo",
    educationDescription: "Muốn số hóa quy trình quản lý và giảng dạy hiệu quả",

    // Contact
    contactUs: "Kết Nối Với Chúng Tôi Ngay Hôm Nay!",
    contactDescription:
      "Nếu bạn đang tìm một đối tác công nghệ đáng tin cậy, linh hoạt và có tâm, thì đừng chần chừ – chúng tôi là lựa chọn đúng đắn của bạn.",
    freeConsultationText: "Liên hệ tư vấn miễn phí:",
    freeConsultation: "Tư Vấn Miễn Phí Ngay",
    viewPortfolio: "Xem Portfolio",

    // Contact Labels
    phoneLabel: "Zalo/Hotline",
    emailLabel: "Email",
    websiteLabel: "Website",
    fanpageLabel: "Fanpage",
    phonePlaceholder: "[Số điện thoại]",
    emailPlaceholder: "[Email liên hệ]",
    websitePlaceholder: "[Địa chỉ website]",
    fanpagePlaceholder: "[Link Facebook/Zalo OA]",
  },
  en: {
    // Hero Banner
    whoAreWe: "Who Are We?",
    welcome: "Welcome to [Your Brand/Company Name] – the ideal destination for all your digitalization ideas!",
    description:
      "We are a young, creative and professional team in the field of custom web and application programming. We have been and are accompanying hundreds of individuals and businesses in turning ideas into effective technology solutions.",
    codeQuality: "Quality Code",
    reasonablePrice: "Reasonable Price",
    dedicatedSupport: "Dedicated Support",

    // Mission
    ourMission: "Our Mission",
    missionQuote: "We don't just code – We build solutions to help you do business better!",
    missionDescription:
      "We believe that every business, every project has its own needs and story. Therefore, every line of code we write aims to solve the right customer pain points and create real value, not templated, not copied.",

    // Mission Stats
    trustedClients: "Trusted Clients",
    completedProjects: "Completed Projects",
    yearsExperience: "Years Experience",
    customerSupport: "Customer Support",

    // Services
    whatWeBring: "What Do We Bring?",
    servicesDescription: "Comprehensive technology solutions from idea to finished product, customized for each client",
    websiteDesign: "Website Design & Development",
    mobileApp: "Mobile Applications",
    additionalServices: "Additional Services",

    // Service Items
    websiteItem1: "Professional, streamlined business introduction websites",
    websiteItem2: "SEO-optimized e-commerce websites with beautiful, user-friendly interfaces",
    websiteItem3: "Internal management websites: attendance, HR, orders, customers...",

    mobileItem1: "Ride-hailing, ordering, customer care, education apps...",
    mobileItem2: "Google Maps, Firebase integration, push notifications",
    mobileItem3: "User-friendly interface, optimized user experience",

    additionalItem1: "Regular website/app maintenance and updates",
    additionalItem2: "SEO content writing, free interface demos",
    additionalItem3: "Digital branding consultation, advertising support",

    // Why Choose Us
    whyChooseUs: "Why Should You Choose Us?",
    reason1Title: 'We don\'t "sell code", we "solve problems"',
    reason1Description:
      "We listen to your business goals and propose suitable solutions – from technology to interface.",
    reason2Title: "Fast Speed – High Quality",
    reason2Description:
      "Clear implementation timeline, committed to schedule. Code is optimized, easy to expand and maintain.",
    reason3Title: "Transparent Pricing – Long-term Support",
    reason3Description:
      "No hidden costs, clear contracts. After delivery, we still provide free technical support during the commitment period.",
    reason4Title: "Custom Brand Design",
    reason4Description: "Interface is not duplicated, reflects your brand's style and characteristics.",

    // Customers
    ourCustomers: "Who Are Our Customers?",
    customersDescription: "We serve diverse customer segments with different digitalization needs",
    startups: "Startup Businesses",
    startupsDescription: "Want beautiful websites for fundraising and brand promotion",
    stores: "Stores",
    storesDescription: "Want to sell online on their own website instead of depending on Shopee/Facebook",
    youngPeople: "Young People",
    youngPeopleDescription: "Need demo products for startups, thesis projects or competitions",
    education: "Educational Organizations",
    educationDescription: "Want to digitize management and teaching processes effectively",

    // Contact
    contactUs: "Connect With Us Today!",
    contactDescription:
      "If you are looking for a reliable, flexible and caring technology partner, don't hesitate – we are the right choice for you.",
    freeConsultationText: "Contact for free consultation:",
    freeConsultation: "Free Consultation Now",
    viewPortfolio: "View Portfolio",

    // Contact Labels
    phoneLabel: "Zalo/Hotline",
    emailLabel: "Email",
    websiteLabel: "Website",
    fanpageLabel: "Fanpage",
    phonePlaceholder: "[Phone Number]",
    emailPlaceholder: "[Contact Email]",
    websitePlaceholder: "[Website Address]",
    fanpagePlaceholder: "[Facebook/Zalo OA Link]",
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("vi") // Mặc định tiếng Việt

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("about-language")
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.log("LocalStorage not available")
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "vi" ? "en" : "vi"
    setLanguage(newLanguage)
    try {
      localStorage.setItem("about-language", newLanguage)
    } catch (error) {
      console.log("LocalStorage not available")
    }
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
