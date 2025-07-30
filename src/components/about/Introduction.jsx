const Heart = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const Target = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default function Introduction() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <Heart className="w-8 h-8 text-red-400" />
            <h2 className="text-4xl font-bold text-white">Sứ Mệnh Của Chúng Tôi</h2>
          </div>
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-semibold text-white mb-4 leading-relaxed">
              "Chúng tôi không chỉ code – Chúng tôi xây dựng giải pháp để bạn kinh doanh tốt hơn!"
            </blockquote>
            <p className="text-gray-300 text-lg leading-relaxed">
              Chúng tôi tin rằng mỗi doanh nghiệp, mỗi dự án đều có nhu cầu và câu chuyện riêng. Vì vậy, mỗi dòng code
              chúng tôi viết ra đều nhằm mục đích giải quyết đúng nỗi đau của khách hàng và tạo ra giá trị thực tế,
              không rập khuôn, không sao chép.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { number: "100+", label: "Khách hàng tin tưởng", color: "from-cyan-500 to-blue-500" },
            { number: "200+", label: "Dự án hoàn thành", color: "from-purple-500 to-pink-500" },
            { number: "3+", label: "Năm kinh nghiệm", color: "from-green-500 to-teal-500" },
            { number: "24/7", label: "Hỗ trợ khách hàng", color: "from-orange-500 to-red-500" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 group"
            >
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}
              >
                {stat.number}
              </div>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
