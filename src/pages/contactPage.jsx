import React, { useState, useRef, useEffect } from "react"
import { MapPin, Phone, Mail } from "lucide-react"

const ContactInfoItem = ({ icon: Icon, title, content }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-red-600" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
)

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  securityCode: "",
  message: "",
}

export default function ContactPage() {
  const [formData, setFormData] = useState(initialFormState)
  const generateCaptcha = () => Math.floor(10000 + Math.random() * 90000).toString()
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.securityCode !== captcha) {
      alert("Mã bảo mật không đúng. Vui lòng thử lại.")
      setCaptcha(generateCaptcha())
      return
    }

    // xử lý gửi
    console.log("Form submitted:", formData)

    setFormSubmitted(true)
    setFormData(initialFormState)
    setCaptcha(generateCaptcha())
  }

  // Tự đóng modal sau 3 giây
  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => setFormSubmitted(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [formSubmitted])

  return (
    <div className="min-h-screen bg-white text-gray-900 py-10 px-4 sm:px-6 lg:px-8 2xl:my-20">
      {/* Modal */}
      {formSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white px-6 py-8 rounded-xl shadow-xl text-center w-full max-w-sm">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Thành công!</h2>
            <p className="text-gray-700">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.</p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Grid tổng */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Thông tin và form */}
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 uppercase tracking-wide">liên hệ với chúng tôi</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Công Ty ?? Modi
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Mọi thắc mắc và yêu cầu cần hỗ trợ từ chúng tôi, vui lòng để lại thông tin tại đây.
            </p>
          </div>

          <div className="space-y-6">
            <ContactInfoItem
              icon={MapPin}
              title="Địa chỉ"
              content="Tầng 2, số 7A2 Nam Thành Công, Phường Láng Hạ, Quận Đống Đa, Tp. Hà Nội."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ContactInfoItem icon={Phone} title="Điện thoại" content="081 646 4646" />
              <ContactInfoItem icon={Mail} title="Email" content="info@tpv.vn" />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg border p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Họ tên (*)"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 border rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Điện thoại (*)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email (*)"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 border rounded-lg"
                />
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    name="securityCode"
                    placeholder="Mã bảo mật (*)"
                    value={formData.securityCode}
                    onChange={handleInputChange}
                    required
                    className="flex-1 h-12 px-2 border rounded-lg"
                  />
                  <div className="w-full sm:w-1/3 bg-black text-white px-4 py-2 rounded-lg font-mono text-lg flex items-center justify-center">
                    {captcha}
                  </div>
                </div>
              </div>

              <textarea
                name="message"
                placeholder="Nội dung (*)"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border rounded-lg resize-none"
              />

              <button
                type="submit"
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-lg"
              >
                Gửi Liên Hệ
              </button>
            </form>
          </div>
        </div>

        {/* Right: Bản đồ */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7634.251582934594!2d105.40702300391352!3d10.387019187656323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a0cec7943ea5d%3A0xc448a0419b717198!2zQ3R5IFROSEggxJDhuqd1IHTGsCAtIFRoxrDGoW5nIE3huqFpIE3hu5ljIMSQaeG7gW4!5e1!3m2!1sen!2s!4v1753229049435!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
              title="Bản đồ Công ty Ty Modi"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

  )
}
