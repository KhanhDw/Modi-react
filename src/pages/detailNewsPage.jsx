import { Clock, User, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function NewsDetail() {
    const article = {
        title: "Công nghệ AI mới thay đổi cách chúng ta làm việc",
        author: "Nguyễn Văn A",
        publishDate: "15/01/2024",
        image: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
        content: [
            {
                type: "paragraph",
                text: "Trí tuệ nhân tạo (AI) đang trở thành một phần không thể thiếu trong cuộc sống và công việc hàng ngày của chúng ta. Từ những ứng dụng đơn giản như trợ lý ảo đến các hệ thống phức tạp trong y tế và tài chính, AI đang thay đổi cách chúng ta tiếp cận và giải quyết vấn đề.",
            },
            {
                type: "paragraph",
                text: "Theo báo cáo mới nhất từ McKinsey Global Institute, khoảng 70% các doanh nghiệp trên toàn cầu đã bắt đầu tích hợp AI vào quy trình làm việc của họ. Con số này dự kiến sẽ tăng lên 85% trong vòng 3 năm tới.",
            },
            {
                type: "heading",
                text: "Những thay đổi tích cực",
            },
            {
                type: "paragraph",
                text: "AI mang lại nhiều lợi ích đáng kể cho môi trường làm việc hiện đại. Đầu tiên, nó giúp tự động hóa các tác vụ lặp đi lặp lại, cho phép nhân viên tập trung vào những công việc sáng tạo và có giá trị cao hơn.",
            },
            {
                type: "paragraph",
                text: "Thứ hai, AI cải thiện độ chính xác trong việc phân tích dữ liệu và đưa ra quyết định. Các thuật toán machine learning có thể xử lý lượng thông tin khổng lồ trong thời gian ngắn, giúp doanh nghiệp đưa ra những quyết định kinh doanh thông minh hơn.",
            },
            {
                type: "image",
                src: "https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg",
                caption: "Giao diện phân tích dữ liệu được hỗ trợ bởi AI",
            },
            {
                type: "heading",
                text: "Thách thức cần vượt qua",
            },
            {
                type: "paragraph",
                text: "Tuy nhiên, việc áp dụng AI cũng đặt ra không ít thách thức. Một trong những lo ngại lớn nhất là vấn đề thất nghiệp do tự động hóa. Nhiều công việc truyền thống có nguy cơ bị thay thế bởi máy móc thông minh.",
            },
            {
                type: "paragraph",
                text: "Bên cạnh đó, vấn đề bảo mật thông tin và quyền riêng tư cũng trở thành mối quan tâm hàng đầu. Việc AI có thể truy cập và xử lý lượng lớn dữ liệu cá nhân đòi hỏi các biện pháp bảo vệ nghiêm ngặt.",
            },
            {
                type: "heading",
                text: "Tương lai của AI trong công việc",
            },
            {
                type: "paragraph",
                text: "Các chuyên gia dự đoán rằng tương lai sẽ không phải là cuộc chiến giữa con người và máy móc, mà là sự hợp tác hài hòa. AI sẽ đóng vai trò như một công cụ hỗ trợ mạnh mẽ, giúp con người làm việc hiệu quả hơn.",
            },
            {
                type: "paragraph",
                text: "Để thích ứng với xu hướng này, người lao động cần không ngừng học hỏi và nâng cao kỹ năng. Các kỹ năng mềm như tư duy sáng tạo, giao tiếp và giải quyết vấn đề sẽ trở nên quan trọng hơn bao giờ hết.",
            },
            {
                type: "paragraph",
                text: "Cuối cùng, việc áp dụng AI thành công đòi hỏi sự đầu tư không chỉ về công nghệ mà còn về con người. Các doanh nghiệp cần có chiến lược đào tạo và phát triển nhân sự phù hợp để tận dụng tối đa tiềm năng của trí tuệ nhân tạo.",
            },
        ],
    }

    const renderContent = (item, index) => {
        switch (item.type) {
            case "heading":
                return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                        {item.text}
                    </h2>
                )
            case "paragraph":
                return (
                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                        {item.text}
                    </p>
                )
            case "image":
                return (
                    <div key={index} className="my-8">
                        <img src={item.src || "/placeholder.svg"} alt={item.caption} className="w-full rounded-lg shadow-md" />
                        {item.caption && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">{item.caption}</p>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link to={"/news"}>
                    <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Quay lại</span>
                    </button>
                </Link>

                {/* Article Header */}
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {/* Hero Image */}
                    <div className="w-full h-64 md:h-96">
                        <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Article Content */}
                    <div className="p-8 md:p-12">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span className="font-medium">{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{article.publishDate}</span>
                            </div>
                        </div>

                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none">
                            {article.content.map((item, index) => renderContent(item, index))}
                        </div>
                    </div>
                </article>

                {/* Related Articles Section */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Bài viết khác</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={`https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg`}
                                    alt={`Bài viết liên quan ${item}`}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        Tiêu đề bài viết liên quan số {item}
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span>Tác giả {item}</span>
                                        <span>1{item}/01/2024</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
