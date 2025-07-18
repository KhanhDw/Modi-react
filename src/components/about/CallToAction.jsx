export default function CallToAction() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Sẵn sàng bắt đầu dự án của bạn?</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về dự án web của bạn
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/25">
            Liên Hệ Ngay
          </button>
          <button className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
            Xem Portfolio
          </button>
        </div>
      </div>
    </section>
  )
}
