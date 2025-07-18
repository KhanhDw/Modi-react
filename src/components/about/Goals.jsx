import { Target } from "lucide-react"

export default function Goals() {
  const goals = [
    "Cung cấp giải pháp web chất lượng cao",
    "Đồng hành cùng khách hàng phát triển bền vững",
    "Ứng dụng công nghệ mới nhất vào sản phẩm",
    "Xây dựng đội ngũ chuyên gia hàng đầu",
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <Target className="w-16 h-16 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Tầm Nhìn 2030</h3>
              <p className="text-gray-300 leading-relaxed">
                Trở thành công ty hàng đầu trong lĩnh vực phát triển web tại Việt Nam, mang đến giải pháp công nghệ tiên
                tiến cho mọi doanh nghiệp.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-8 h-8 text-purple-400" />
              <h2 className="text-4xl font-bold text-white">Mục Tiêu</h2>
            </div>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
