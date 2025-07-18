import { Users } from "lucide-react"

export default function Team() {
  const teamData = [
    { role: "Frontend", count: "5+", color: "from-cyan-500 to-blue-500" },
    { role: "Backend", count: "4+", color: "from-purple-500 to-pink-500" },
    { role: "UI/UX", count: "3+", color: "from-green-500 to-teal-500" },
    { role: "DevOps", count: "2+", color: "from-orange-500 to-red-500" },
  ]

  return (
    <section className="py-20 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Users className="w-8 h-8 text-cyan-400" />
          <h2 className="text-4xl font-bold text-white">Đội Ngũ</h2>
        </div>
        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
          Đội ngũ chuyên gia giàu kinh nghiệm, luôn sẵn sàng biến ý tưởng thành hiện thực
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {teamData.map((team, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${team.color} flex items-center justify-center text-white font-bold text-xl`}
              >
                {team.count}
              </div>
              <h3 className="text-white font-semibold">{team.role}</h3>
              <p className="text-gray-400 text-sm">Chuyên gia</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
