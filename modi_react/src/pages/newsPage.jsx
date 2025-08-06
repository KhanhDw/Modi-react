import { Clock, User } from "lucide-react"

export default function NewsInterface() {
  const newsArticles = [
    {
      id: 1,
      title: "Công nghệ AI mới thay đổi cách chúng ta làm việc",
      description:
        "Khám phá những tiến bộ mới nhất trong trí tuệ nhân tạo và tác động của chúng đến thị trường lao động hiện tại.",
      image: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
      author: "Nguyễn Văn A",
      publishDate: "15/01/2024",
    },
    {
      id: 2,
      title: "Thị trường chứng khoán Việt Nam tăng trưởng mạnh",
      description: "Phân tích xu hướng tăng trưởng của thị trường chứng khoán trong quý này và dự báo cho tương lai.",
      image: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
      author: "Trần Thị B",
      publishDate: "14/01/2024",
    },
    {
      id: 3,
      title: "Khám phá ẩm thực đường phố Sài Gòn",
      description: "Hành trình khám phá những món ăn đường phố độc đáo và hấp dẫn nhất tại thành phố Hồ Chí Minh.",
      image: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
      author: "Lê Văn C",
      publishDate: "13/01/2024",
    },
    {
      id: 4,
      title: "Bóng đá Việt Nam chuẩn bị cho SEA Games",
      description:
        "Đội tuyển bóng đá Việt Nam đang tích cực chuẩn bị cho giải đấu SEA Games sắp tới với đội hình mạnh nhất.",
      image: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
      author: "Phạm Văn D",
      publishDate: "12/01/2024",
    },
    {
      id: 5,
      title: "Du lịch Đà Lạt mùa hoa mimosa",
      description: "Mùa hoa mimosa vàng rực rỡ đang nở rộ tại Đà Lạt, tạo nên khung cảnh thơ mộng cho du khách.",
      image: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
      author: "Hoàng Thị E",
      publishDate: "11/01/2024",
    },
    {
      id: 6,
      title: "Startup Việt Nam nhận đầu tư triệu đô",
      description: "Một startup công nghệ tại Việt Nam vừa nhận được khoản đầu tư lớn từ các quỹ đầu tư quốc tế.",
      image: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
      author: "Vũ Văn F",
      publishDate: "10/01/2024",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Article */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={newsArticles[0].image || "/placeholder.svg"}
                  alt={newsArticles[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{newsArticles[0].title}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                  {newsArticles[0].description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{newsArticles[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{newsArticles[0].publishDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.slice(1).map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.publishDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600">
            Xem thêm tin tức
          </button>
        </div>
      </div>
    </div>
  )
}
