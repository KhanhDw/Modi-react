import { MapPin, Phone, Mail } from "lucide-react"
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { Link } from "react-router-dom";


const services = [
  'Thiết kế website',
  'Thiết kế App',
  'Marketing sản phẩm',
  '...',
  '...',
  '...',
  '...',
  '...',
  '...',
  '...',
]



const privacy_statement = [
  'Giới thiệu',
  'Chính sách bảo mật',

]



export default function Footer() {
  return (
    <footer className="p-8 m-4 text-white bg-gray-900 rounded-4xl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
          {/* Left Section - Company Info */}
          <div className="space-y-6">
            <div>
              <div className='flex items-center justify-center h-10 px-3 py-2 mb-3 overflow-hidden rounded-2xl w-fit'>
                <img src="./logoModi.png" className='h-10 w-fit' alt='logo' />
              </div>
              <h2 className="mb-6 text-xl font-semibold">Công ty ?? Mộc Điền</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="flex-shrink-0 mt-1 text-red-500" size={20} />
                <div>
                  <p>182 Trần Bình Trọng, Phường Chợ Quán,</p>
                  <p>Thành phố Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="flex-shrink-0 mt-1 text-red-500" size={20} />
                <div>
                  <p>182 Trần Bình Trọng, Phường Chợ Quán,</p>
                  <p>Thành phố Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="flex-shrink-0 text-blue-500" size={20} />
                <p>0123454678</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="flex-shrink-0 text-red-500" size={20} />
                <p>modl-company@modl.vn</p>
              </div>
            </div>
          </div>

          {/* Middle Section - Services */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">Dịch vụ</h3>

            <div className="grid grid-cols-2 gap-x-8">
              <ul className="space-y-3">
                {services.slice(0, Math.ceil(services.length / 2)).map((service, index) => (
                  <li key={index} className="transition-all duration-200 hover:text-green-400">
                    <Link to="/">{service}</Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3">
                {services.slice(Math.ceil(services.length / 2)).map((service, index) => (
                  <li key={index + 100} className="transition-all duration-200 hover:text-green-400">
                    <Link to="/">{service}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* Right Section - About & Links */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Về Chúng Tôi</h3>
              <p className="text-sm leading-relaxed text-justify text-gray-300">
                Môc Điền là công ty công nghệ – marketing hỗ trợ doanh nghiệp Việt xây dựng thương hiệu, quản lý hiệu
                quả. Chúng tôi cung cấp các giải pháp website, hệ thống quản lý
                và chiến lược tiếp thị phù hợp với từng mô hình kinh doanh.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Chính sách</h3>
              <div className="grid grid-cols-2 gap-x-8">
                <ul className="space-y-3">
                  {privacy_statement.slice(0, Math.ceil(privacy_statement.length / 2)).map((service, index) => (
                    <li key={index} className="transition-all duration-200 hover:text-green-400">
                      <Link to="/">{service}</Link>
                    </li>
                  ))}
                </ul>

                <ul className="space-y-3">
                  {privacy_statement.slice(Math.ceil(privacy_statement.length / 2)).map((service, index) => (
                    <li key={index + 100} className="transition-all duration-200 hover:text-green-400">
                      <Link to="/">{service}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Social */}
        <div className="flex flex-col items-center justify-between pt-6 border-t border-gray-700 md:flex-row">
          <p className="mb-4 text-sm text-gray-400 md:mb-0">© Copyright 2025 All Rights Reserved</p>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-10 h-10 transition-colors rounded cursor-pointer hover:bg-blue-700">
              <FaLinkedin size={30} className="text-white" />
            </div>
            <div className="flex items-center justify-center w-10 h-10 transition-colors rounded cursor-pointer hover:bg-blue-600">
              <FaFacebookSquare size={30} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
