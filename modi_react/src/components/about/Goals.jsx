const Star = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

export default function Goals() {
  const reasons = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Không "bán code", chúng tôi "giải quyết vấn đề"',
      description: "Lắng nghe mục tiêu kinh doanh và đề xuất giải pháp phù hợp từ công nghệ đến giao diện",
      color: "text-cyan-400",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Tốc độ nhanh – Chất lượng cao",
      description: "Thời gian thực hiện rõ ràng, cam kết đúng tiến độ. Code được tối ưu hóa, dễ mở rộng",
      color: "text-purple-400",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Giá cả minh bạch – Hỗ trợ dài hạn",
      description: "Không phát sinh chi phí ẩn, hợp đồng rõ ràng. Hỗ trợ kỹ thuật miễn phí sau bàn giao",
      color: "text-green-400",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Thiết kế theo thương hiệu riêng",
      description: "Giao diện không trùng lặp, phản ánh phong cách và đặc điểm thương hiệu của bạn",
      color: "text-pink-400",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Vì Sao Bạn Nên Chọn Chúng Tôi?</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-6"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div
                    className={`${reason.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
