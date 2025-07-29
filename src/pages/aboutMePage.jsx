
function AboutPage() {
    return (
        <div className="h-full w-full pt-[104px] px-1 flex flex-col">
            <div className="relative w-full h-[70vh] overflow-hidden rounded-3xl">
                {/* Ảnh nền */}
                <img
                    src="/images/banner1.jpg"
                    alt="Về chúng tôi"
                    className="w-full h-full object-cover rounded-3xl"
                />

                {/* Overlay màu tối nhẹ */}
                <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

                {/* Text nằm giữa */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Về Chúng Tôi</h1>
                    <p className="text-lg md:text-xl font-medium max-w-2xl">
                        <a href="#" className="text-gray-300 uppercase text-sm">Trang chủ</a> - <a href="#" className="text-gray-300 uppercase text-sm">Về Chúng Tôi</a>
                    </p>
                </div>
            </div>


            <div className="pt-[60px] pb-[60px] px-[170px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Cột trái */}
                    <div>
                        <h3 className="text-sm text-[14133b] font-bold mb-3">Về chúng tôi</h3>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a4b] leading-snug">
                            eHub được phát triển bởi Công ty Cổ phần Truyền thông và Đầu tư Tỷ Phú Việt
                        </h2>

                        <div className="my-6">
                            {/* Icon nút play */}
                            <button className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-500 text-xl">▶</span>
                            </button>
                        </div>

                        <p className="text-[494c63] leading-relaxed text-base">
                            Modi là nền tảng kết nối và cung cấp dịch vụ toàn diện cho doanh nghiệp,
                            mang đến các giải pháp phù hợp theo từng giai đoạn phát triển, từ khởi nghiệp
                            đến mở rộng quy mô thị trường và xuất khẩu quốc tế. Trong kỷ nguyên số,
                            Cổng xác thực Modi triển khai giải pháp xác thực hiện đại, xây dựng nền
                            móng vững chắc cho quá trình phát triển bền vững.
                        </p>
                    </div>

                    {/* Cột phải */}
                    <div className="pt-[56px]">
                        <div>
                            <p className="text-[#14133b] text-[17px]"> <span className="font-bold">Tầm nhìn: </span>
                                Trở thành nền tảng xác thực và cung cấp dịch vụ toàn diện hàng đầu cho doanh nghiệp Việt.
                                Chúng tôi đồng hành cùng doanh nghiệp trên mọi chặng đường phát triển,
                                hướng đến nâng tầm giá trị Việt trong kỷ nguyên chuyển đổi số toàn cầu.
                            </p>
                        </div>

                        <div className="pt-[25px]">
                            <p className="text-[#14133b] text-[17px]"> <span className="font-bold">Sứ mệnh: </span>
                                Chúng tôi mang đến các giải pháp xác thực và dịch vụ toàn diện giúp doanh nghiệp
                                dễ dàng tiếp cận thông tin, thực hiện các thủ tục quan trọng và tận dụng cơ hội phát triển theo từng giai đoạn.
                                Với bản đồ hành trình doanh nghiệp trực quan, eHub tạo điều kiện để các doanh nghiệp Việt tự tin khởi nghiệp,
                                phát triển vững chắc và vươn xa trên thị trường quốc tế.</p>
                        </div>
                    </div>
                </div>
            </div>

            <marquee behavior="" direction="" className="text-[120px] text-[#e4edf3] font-semibold">Đồng hành cùng doanh nghiệp</marquee>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start px-4 md:px-[100px] pt-[60px] pb-[90px]">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-4">
                        <img
                            src="/images/img-16.webp"
                            alt="woman-working"
                            className="rounded-xl object-cover"
                            style={{ width: 270, height: 270 }}
                        />
                        <img
                            src="/images/img-17.webp"
                            alt="ben-thanh"
                            className="rounded-xl object-cover"
                            style={{ width: 270, height: 270 }}
                        />
                    </div>

                    <div className="flex items-center">
                        <img
                            src="/images/img-18.webp"
                            alt="document"
                            className="rounded-xl object-cover"
                            style={{ width: 270, height: 410 }}
                        />
                    </div>
                </div>

                {/* Cột phải - Nội dung */}
                <div>
                    <p className="text-[14px] text-[#333] font-bold mb-2">Bối cảnh thị trường</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a4b] mb-6">
                        Doanh nghiệp tại Việt Nam
                    </h2>

                    {/* Box 1 */}
                    <div className="bg-red-100 rounded-lg mb-4 flex items-start p-5 gap-4">
                        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-red-500 text-white text-sm font-bold rounded">
                            1
                        </div>
                        <div>
                            <p className="font-semibold text-[#1a1a4b] mb-1">Tỷ trọng SME tại Việt Nam</p>
                            <p className="text-gray-700 text-[15px] leading-relaxed">
                                SME đóng vai trò quan trọng trong nền kinh tế Việt Nam, chiếm tới <strong>96%</strong> tổng số <strong>doanh nghiệp</strong> và <strong>47% tổng sản phẩm nội địa (GDP)</strong>. Tuy nhiên, các doanh nghiệp này thường gặp khó khăn trong việc quản lý quy trình pháp lý và tìm kiếm dịch vụ chất lượng để mở rộng thị trường.
                            </p>
                        </div>
                    </div>

                    {/* Box 2 */}
                    <div className="bg-red-100 rounded-lg flex items-start p-5 gap-4">
                        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-red-500 text-white text-sm font-bold rounded">
                            2
                        </div>
                        <div>
                            <p className="font-semibold text-[#1a1a4b] mb-1">
                                Nhu cầu về quản lý thủ tục và dịch vụ pháp lý
                            </p>
                            <p className="text-gray-700 text-[15px] leading-relaxed">
                                Theo một báo cáo của Bộ Kế hoạch và Đầu tư, nhiều doanh nghiệp SME gặp khó khăn với các thủ tục hành chính phức tạp và thiếu thông tin về quy trình pháp lý. Đặc biệt, trong quá trình xuất khẩu, nhiều doanh nghiệp không biết cách xin các chứng nhận quốc tế như <strong>ISO</strong> hay <strong>FDA</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#08192f] text-white py-20 px-6 md:px-20 rounded-3xl w-full text-center relative overflow-hidden">
                {/* Nội dung chính */}
                <div className="relative z-10">
                    <p className="text-[14px] font-bold mb-3">Mục tiêu Modi</p>
                    <h2 className="text-2xl md:text-3xl font-bold leading-relaxed max-w-3xl mx-auto mb-10">
                        Kết nối, lắng nghe, chia sẻ và tư vấn giải quyết các nhu cầu của Doanh nghiệp, đồng hành trong việc xây dựng và bảo vệ uy tín thương hiệu, thông qua các giải pháp xác thực, nền tảng kết nối, tìm kiếm đối tác, phát triển kênh thương mại điện tử, mở rộng thị trường
                    </h2>

                    {/* Hai khối giải pháp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-[70px]">

                        <div className="relative rounded-xl overflow-hidden group">
                            <img
                                src="/images/hinh1.png"
                                alt="Hình 1"
                                className="w-full h-90 object-cover rounded-xl transform transition duration-500 group-hover:scale-110"
                            />
                            {/* Lớp phủ mờ */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    pointerEvents: 'none',
                                }}
                            ></div>


                            <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                                <p className="text-[15px] mb-4 text-left font-semibold">
                                    eHub hỗ trợ doanh nghiệp theo dõi và quản lý toàn diện các thủ tục pháp lý cần thiết – từ xác thực danh tính, đăng ký kinh doanh, bảo hộ nhãn hiệu đến chứng nhận chất lượng và giấy phép xuất khẩu.
                                </p>
                                <button className="bg-[#df3d27] text-white px-5 py-2 rounded font-semibold text-sm w-fit self-start">
                                    Giải quyết vấn đề quản lý quy trình pháp lý
                                </button>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="relative rounded-xl overflow-hidden group">
                            <img
                                src="/images/hinh2.png"
                                alt="Hình 2"
                                className="w-full h-90 object-cover rounded-xl transform transition duration-500 group-hover:scale-110"
                            />
                            {/* Lớp phủ mờ */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    pointerEvents: 'none',
                                }}
                            ></div>

                            <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                                <p className="text-[15px] mb-4 text-left font-semibold">
                                    Nền tảng này sẽ cung cấp Marketplace cho phép doanh nghiệp tìm kiếm, thuê và đánh giá các nhà cung cấp dịch vụ như luật sư, logistics, hoặc tư vấn chiến lược. Điều này không chỉ giúp tiết kiệm thời gian mà còn tăng tính minh bạch và hiệu quả của quá trình tìm kiếm đối tác.
                                </p>
                                <button className="bg-[#df3d27] text-white px-5 py-2 rounded font-semibold text-sm w-fit self-start">
                                    Kết nối với nhà cung cấp dịch vụ
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <section className="py-16 px-5 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-sm font-bold">Tính năng</p>
                    <h2 className="text-3xl font-bold mt-2">Modi đối với Doanh nghiệp</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div
                        className="rounded-xl border border-gray-200 p-6 transition duration-300 cursor-pointer hover:text-white"
                        style={{ backgroundColor: 'white' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#4f46e5';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 70, 229, 0.5)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.color = '';
                        }}
                    >
                        <h3 className="text-lg font-bold mb-2">Bản đồ hành trình doanh nghiệp</h3>
                        <p className="text-sm text-inherit">
                            Hiển thị từng cột mốc trong hành trình phát triển của doanh nghiệp, từ khởi nghiệp đến mở rộng thị trường quốc tế. Ví dụ, khi một doanh nghiệp muốn đăng ký nhãn hiệu cho sản phẩm mới, họ sẽ thấy toàn bộ các bước cần thực hiện cùng với các tùy chọn tự thực hiện hoặc thuê dịch vụ.
                        </p>
                    </div>

                    <div
                        className="rounded-xl border border-gray-200 p-6 transition duration-300 cursor-pointer hover:text-white"
                        style={{ backgroundColor: 'white' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#287f7a';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 127, 122, 0.5)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.color = '';
                        }}
                    >
                        <h3 className="text-lg font-bold mb-2">Marketplace dịch vụ</h3>
                        <p className="text-sm text-inherit">
                            Doanh nghiệp có thể thuê dịch vụ pháp lý, logistics, hoặc tư vấn chất lượng trực tiếp trên nền tảng eHub. Các nhà cung cấp dịch vụ được đánh giá và xếp hạng công khai dựa trên trải nghiệm thực tế của người dùng khác
                        </p>
                    </div>

                    <div
                        className="rounded-xl border border-gray-200 p-6 transition duration-300 cursor-pointer hover:text-white"
                        style={{ backgroundColor: 'white' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ca9c5e';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(202, 156, 94, 0.5)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.color = '';
                        }}
                    >
                        <h3 className="text-lg font-bold mb-2">Tích hợp ECheck và Numbala</h3>
                        <p className="text-sm text-inherit">
                            ECheck giúp doanh nghiệp xác thực hàng hóa thông qua mã vạch, đảm bảo sản phẩm đạt tiêu chuẩn chất lượng, trong khi Numbala giúp doanh nghiệp tiếp cận thị trường thương mại điện tử và logistics.
                        </p>
                    </div>

                    <div
                        className="rounded-xl border border-gray-200 p-6 transition duration-300 cursor-pointer hover:text-white"
                        style={{ backgroundColor: 'white' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ff6a31';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 106, 49, 0.5)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.color = '';
                        }}
                    >
                        <h3 className="text-lg font-bold mb-2">Tư vấn thông minh với ChatGPT</h3>
                        <p className="text-sm text-inherit">
                            Tích hợp công nghệ trí tuệ nhân tạo (AI) ChatGPT giúp cung cấp hướng dẫn chi tiết về các thủ tục cần thiết, giúp doanh nghiệp tiết kiệm thời gian và chi phí tìm kiếm thông tin.
                        </p>
                    </div>
                </div>
            </section>

            <div className="py-15 px-5">
                {/* Tiêu đề giữ căn giữa trong max-w-6xl */}
                <div className="max-w-6xl mx-auto text-center mb-8">
                    <h2 className="text-sm font-bold">
                        Hệ sinh thái tập đoàn
                    </h2>
                </div>

                {/* Logo nằm hẳn bên trái trang */}
                <div className="flex gap-10 mx-[185px]">
                    <img src="/images/echeck-logo.png" alt="eCheckX" className="h-10" />
                    <img src="/images/numlab-logo.svg" alt="Numlab" className="h-10" />
                </div>
            </div>


        </div>
    );
}


export default AboutPage;
