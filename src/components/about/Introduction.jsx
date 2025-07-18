import { Code, CheckCircle } from "lucide-react"

export default function Introduction() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl font-bold text-white">Giới Thiệu</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Chúng tôi là đội ngũ chuyên gia với nhiều năm kinh nghiệm trong lĩnh vực phát triển web. Sứ mệnh của chúng
              tôi là biến ý tưởng của bạn thành hiện thực số.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-2xl font-bold text-cyan-400">100+</h3>
                <p className="text-gray-300">Dự án hoàn thành</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-2xl font-bold text-purple-400">5+</h3>
                <p className="text-gray-300">Năm kinh nghiệm</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform duration-500">
              <div className="space-y-4">
                {["Chất lượng cao", "Giao hàng đúng hạn", "Hỗ trợ 24/7", "Công nghệ hiện đại"].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
