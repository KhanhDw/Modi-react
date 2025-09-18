import React, { useState, useEffect } from "react"
import CaptchaImage from '../components/feature/CaptchaImage';
import { useSearchParams } from 'react-router-dom';
import getServiceBySlug from '../utils/slugData.jsx';
import { useLanguage } from "../contexts/LanguageContext.jsx";
import useSocket from "@/hook/useSocket";

// Trạng thái ban đầu của form
const initialFormState = {
  ho_ten: "",
  so_dien_thoai: "",
  email: "",
  securityCode: "",
  noi_dung: "",
}

export default function ContactPage() {
  const { t } = useLanguage();
  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const serviceOrderURL = getServiceBySlug(searchParams.get('service-order')) ? getServiceBySlug(searchParams.get('service-order')).name : "";
  const [formData, setFormData] = useState(initialFormState)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const [captchaError, setCaptchaError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  //chuẩn hóa nhập email
  const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    const regex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
    return regex.test(trimmedEmail);
  }

  //chuẩn hóa nhập sdt viet nam
  const validatePhone = (phone) => {
    const trimmedPhone = phone.trim();
    const regex = /^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    return regex.test(trimmedPhone);
  }

  useEffect(() => {
    if (!socket) return;
    socket.on("dataChanged", (data) => {
      console.log("📩 Data changed:", data);
    });
    return () => socket.off("dataChanged");
  }, [socket]);

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

    if (name === 'securityCode' && captchaError) setCaptchaError(""); // Ẩn lỗi khi nhập lại

    // Ẩn lỗi khi nhập lại email và số điện thoại
    if (name === 'email' && emailError) {
      setEmailError("");
    }

    if (name === 'so_dien_thoai' && phoneError) {
      setPhoneError("");
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // kiểm tra captcha trước
    if (formData.securityCode.trim().toLowerCase() !== captchaText.toLowerCase()) {

      //Check lỗi captcha vi - en
      setCaptchaError(t("contactPage.contextModalCaptchaError"));

      // Kiểm tra lỗi email và số điện thoại trước khi submit
      if (!validateEmail(formData.email)) setEmailError(t("contactPage.emailInvalid"));
      if (!validatePhone(formData.so_dien_thoai)) setPhoneError(t("contactPage.phoneInvalid"));

      setFormData(prev => ({ ...prev, securityCode: "" }));
      setCaptchaText(generateCaptcha());
      return; // dừng lại, không gửi API
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // gửi dữ liệu trước khi reset
      });

      // const data = await response.json();
      // console.log('Kết quả từ server:', data);
      // alert(data.message);

      // Sau khi gửi thành công mới reset form
      setFormSubmitted(true);
      setFormData(initialFormState);
      setCaptchaText(generateCaptcha());
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  // Tự động đóng modal sau 3 giây
  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => setFormSubmitted(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [formSubmitted])

  return (
    <div className="text-gray-900 dark:text-slate-200 py-10 px-4 sm:px-6 lg:px-8 2xl:py-5 transition-colors duration-300">

      {/* Modal thông báo thành công */}
      {formSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className=" dark:bg-slate-800 bg-gray-50 px-6 py-8 rounded-xl shadow-xl text-center w-full max-w-sm border border-transparent dark:border-slate-700">
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">{t("contactPage.contextModalSuccess")}</h2>
            <p className="text-black font-medium dark:text-slate-300">{t("contactPage.contextModalNoti")}</p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="mt-4 px-5 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition cursor-pointer"
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
                  name="ho_ten"
                  placeholder={t("contactPage.inputName") + `(*)`}
                  value={formData.ho_ten}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition dark:focus:border-none focus:border-none"
                />
                <input
                  type="tel"
                  name="so_dien_thoai"
                  placeholder={t("contactPage.inputPhoneNumber") + `(*)`}
                  value={formData.so_dien_thoai}
                  onChange={handleInputChange}
                  maxLength={10}
                  required
                  className="w-full h-12 px-4 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition dark:focus:border-none focus:border-none"
                />

                {phoneError && (
                  <span className="col-span-1 sm:col-span-2 xs:text-sm dark:text-red-400 text-red-500 font-medium">{phoneError}</span>
                )}

              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email (*)"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition dark:focus:border-none focus:border-none"
                />

                {emailError && (
                  <span className="col-span-1 sm:col-span-2 xs:text-sm dark:text-red-400 text-red-500 font-medium">{emailError}</span>
                )}

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 items-center">
                <input
                  type="text"
                  name="securityCode"
                  placeholder={t("contactPage.inputPin") + `(*)`}
                  value={formData.securityCode}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition dark:focus:border-none focus:border-none"
                />
                <div className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-mono text-2xl flex items-center justify-center tracking-widest">
                  <div className="w-full h-12 rounded-lg">
                    <CaptchaImage captchaText={captchaText} />
                  </div>
                </div>
                {/* Thông báo lỗi hiện khi có lỗi */}
                {captchaError && (
                  <span className="col-span-1 sm:col-span-2 xs:text-sm dark:text-red-400 text-red-500 font-medium">
                    {captchaError}
                  </span>
                )}
              </div>

              <textarea
                name="noi_dung"
                placeholder={t("contactPage.inputContext")}
                value={formData.noi_dung}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full placeholder-gray-400 dark:placeholder-gray-500 px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg resize-none focus:ring-2 focus:ring-red-500 outline-none transition dark:focus:border-none focus:border-none"
              />

              <button
                type="submit"
                className="w-full h-14 xs:h-10 sm:h-12 md:h-14 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-lg rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
              >
                <span className="font-semibold xs:text-sm md:text-base">{t("contactPage.btnSendContact")}</span>
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