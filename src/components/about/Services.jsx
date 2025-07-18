import { Code, Lightbulb, Award, ArrowRight } from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: <Code className="w-12 h-12" />,
      title: "Phát Triển Web",
      description: "Xây dựng website hiện đại, responsive và tối ưu SEO",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: "Thiết Kế UI/UX",
      description: "Tạo trải nghiệm người dùng tuyệt vời và giao diện đẹp mắt",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Tối Ưu Hóa",
      description: "Cải thiện hiệu suất và tốc độ tải trang website",
      color: "from-green-500 to-teal-500",
    },
  ]

  return (
    <section className="py-20 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Sản Phẩm & Dịch Vụ</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Chúng tôi cung cấp giải pháp web toàn diện từ thiết kế đến triển khai
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
                <div className="mt-6 flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span className="mr-2">Tìm hiểu thêm</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
