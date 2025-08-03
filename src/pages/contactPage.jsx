import React, { useState, useEffect } from "react"
import CaptchaImage from '../components/feature/CaptchaImage';
import { useSearchParams } from 'react-router-dom';
import getServiceBySlug from '../utils/slugData.jsx';
import { useLanguage } from "../contexts/LanguageContext.jsx";

// Trạng thái ban đầu của form
const initialFormState = {
  name: "",
  phone: "",
  email: "",
  securityCode: "",
  message: "",
}

export default function ContactPage() {

  const { t } = useLanguage();


  const [searchParams] = useSearchParams();
  const serviceOrderURL = getServiceBySlug(searchParams.get('service-order')) ? getServiceBySlug(searchParams.get('service-order')).name : "";



  const [formData, setFormData] = useState(initialFormState)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const generateCaptcha = (length = 5) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const [captchaText, setCaptchaText] = useState(generateCaptcha());

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Thư viện cung cấp hàm xác thực
    if (formData.securityCode.trim().toLowerCase() === captchaText.toLowerCase()) {
      // Xử lý thành công
      setFormSubmitted(true);
      setFormData(initialFormState);
      setCaptchaText(generateCaptcha()); // tạo captcha mới
    } else {
      alert("Mã bảo mật không đúng. Vui lòng thử lại.");
      setFormData(prev => ({ ...prev, securityCode: "" }));
      setCaptchaText(generateCaptcha());
    }
  }

  // Tự động đóng modal sau 3 giây
  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => setFormSubmitted(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [formSubmitted])







  return (
    <div className=" dark:bg-slate-900 text-gray-900 dark:text-slate-200 py-10 px-4 sm:px-6 lg:px-8 2xl:py-5 transition-colors duration-300">

      {/* Modal thông báo thành công */}
      {formSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className=" dark:bg-slate-800 px-6 py-8 rounded-xl shadow-xl text-center w-full max-w-sm border border-transparent dark:border-slate-700">
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">Thành công!</h2>
            <p className="text-gray-700 dark:text-slate-300">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.</p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="mt-6 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition"
            >
              {t("contactPage.contextBtnModalInformation")}
            </button>
          </div>
        </div>
      )}

      {/* Grid layout chính */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Cột trái: Thông tin và form */}
        <div className="space-y-5">
          <div className="space-y-4">
            <p className="text-sm text-red-600 dark:text-red-400 uppercase tracking-wider font-semibold"> {t("contactPage.title")}</p>
            <h1 className="text-2xl sm:text-xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {t("contactPage.nameCompany")}
            </h1>
            <p className="text-gray-600 dark:text-slate-400  sm:text-sm leading-relaxed">
              {t("contactPage.description")}
             
            </p>
            {serviceOrderURL && (
              <div className="text-center text-gray-600 dark:text-slate-400 text-base sm:text-lg font-bold leading-relaxed border-2 border-red-500 dark:border-red-400 rounded-lg p-2">
                <span className="block sm:inline">{t("contactPage.titleOrderName")}: </span>
                <span className="block sm:inline dark:text-amber-300 text-red-500">{serviceOrderURL}</span>
              </div>)
            }
          </div>


          {/* Form liên hệ */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder={t("contactPage.inputName")+`(*)`}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={t("contactPage.inputPhoneNumber")+`(*)`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email (*)"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="securityCode"
                  placeholder={t("contactPage.inputPin")+`(*)`}
                  value={formData.securityCode}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                />
                <div className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-2 rounded-lg font-mono text-2xl flex items-center justify-center tracking-widest">
                  <div className="w-full h-12 rounded-lg">
                    <CaptchaImage captchaText={captchaText} />
                  </div>
                </div>
              </div>

              <textarea
                name="message"
                placeholder={t("contactPage.inputContext")}
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg resize-none focus:ring-2 focus:ring-red-500 outline-none transition"
              />

              <button
                type="submit"
                className="w-full h-14 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold text-lg rounded-lg transition-transform transform hover:scale-105"
              >
                {t("contactPage.btnSendContact")}
              </button>
            </form>
          </div>
        </div>

        {/* Cột phải: Bản đồ */}
        <div className="lg:sticky lg:top-8 self-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden h-[650px] xs:h-[320px] md:h-[400px] lg:h-[600px] xl:h-[650px] 2xl:h-[800px]  border border-gray-200 dark:border-slate-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7634.251582934594!2d105.40702300391352!3d10.387019187656323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a0cec7943ea5d%3A0xc448a0419b717198!2zQ3R5IFROSEggxJDhuqd1IHTGsCAtIFRoxrDGoW5nIE3huqFpIE3hu5ljIMSQaeG7gW4!5e1!3m2!1sen!2s!4v1753229049435!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
              title="Bản đồ Công ty Ty Modi"
              style={{ filter: 'grayscale(0) invert(0) contrast(1)' }} // Default style for light mode
            ></iframe>
            {/* Để kích hoạt style dark mode cho iframe, bạn cần dùng Javascript để thêm class, 
                vì Tailwind không thể trực tiếp style iframe từ CSS. 
                Hoặc bạn có thể dùng một bộ lọc CSS đơn giản như ví dụ dưới đây trong file CSS toàn cục:
                .dark iframe {
                   filter: grayscale(1) invert(0.9) contrast(0.8);
                }
            */}
          </div>
        </div>
      </div>
    </div>
  )
}