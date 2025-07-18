const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

export default function Team() {
  const customers = [
    {
      type: "Doanh nghiệp khởi nghiệp",
      description: "Muốn có web đẹp để gọi vốn và quảng bá",
      icon: "🚀",
      color: "from-cyan-500 to-blue-500",
    },
    {
      type: "Cửa hàng online",
      description: "Muốn bán hàng trên website riêng thay vì phụ thuộc Shopee/Facebook",
      icon: "🛍️",
      color: "from-purple-500 to-pink-500",
    },
    {
      type: "Bạn trẻ khởi nghiệp",
      description: "Cần sản phẩm demo để khởi nghiệp, làm đồ án hoặc dự thi",
      icon: "💡",
      color: "from-green-500 to-teal-500",
    },
    {
      type: "Tổ chức giáo dục",
      description: "Muốn số hóa quy trình quản lý và đào tạo",
      icon: "🎓",
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section className="py-20 px-4 bg-black/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-cyan-400" />
            <h2 className="text-4xl font-bold text-white">Khách Hàng Của Chúng Tôi</h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-6"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {customers.map((customer, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${customer.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    {customer.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {customer.type}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{customer.description}</p>
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
