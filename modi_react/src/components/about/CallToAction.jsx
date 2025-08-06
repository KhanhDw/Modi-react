const Phone = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const Mail = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const Globe = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
)

export default function CallToAction() {
  const contacts = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: "Zalo/Hotline",
      value: "[Số điện thoại]",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "[Email liên hệ]",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: "Website",
      value: "[Địa chỉ website]",
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Kết Nối Với Chúng Tôi Ngay Hôm Nay!</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-8"></div>

        <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          Nếu bạn đang tìm một đối tác công nghệ đáng tin cậy, linh hoạt và có tâm, thì đừng chần chừ – chúng tôi là lựa
          chọn đúng đắn của bạn.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contacts.map((contact, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${contact.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {contact.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{contact.label}</h3>
                <p className="text-gray-400 text-sm">{contact.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 group">
            <span className="group-hover:scale-110 transition-transform inline-block">Tư Vấn Miễn Phí Ngay</span>
          </button>
          <button className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 group">
            <span className="group-hover:scale-110 transition-transform inline-block">Xem Portfolio</span>
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">💬 Fanpage: [Link Facebook/Zalo OA]</div>
      </div>
    </section>
  )
}
