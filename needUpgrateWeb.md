thêm chức năng thêm mạng xã hội tại footer cho admin có thể thêm tùy ý và cấu hình url

CREATE TABLE pages_config (
id INT AUTO_INCREMENT PRIMARY KEY,
slug VARCHAR(100) UNIQUE, -- ví dụ: 'about', 'home'
title VARCHAR(255), -- tên trang
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

1 about Giới thiệu 2025-09-04 16:47:28
2 home Trang chủ 2025-09-05 20:16:12
3 header Đầu trang 2025-09-07 10:50:06
4 footer Chân trang 2025-09-07 11:38:12

CREATE TABLE sections (
id INT AUTO_INCREMENT PRIMARY KEY,
pages_config_id INT,
type VARCHAR(50), -- 'banner', 'about', 'vision_mission'
position INT DEFAULT 0, -- thứ tự hiển thị
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (pages_config_id) REFERENCES pages_config(id) ON DELETE CASCADE
);

1 1 about_intro 1 2025-09-04 16:47:28
2 1 company_intro 2 2025-09-04 16:47:28
3 1 vision_mission 3 2025-09-04 16:47:28
4 2 banner 1 2025-09-05 20:16:12
5 2 nenTang 2 2025-09-06 14:56:09
8 2 cards 3 2025-09-06 15:18:03
9 2 dichvu 4 2025-09-06 15:19:15
10 2 loiich 5 2025-09-06 15:19:35
11 2 khauhieu 6 2025-09-06 15:19:51
12 2 khachhang 7 2025-09-06 15:20:03
13 2 loiich 5 2025-09-06 15:37:05
14 2 khachhang 7 2025-09-06 15:37:21
15 3 logo 1 2025-09-07 10:51:50
16 4 company_info 1 2025-09-07 11:42:07
17 4 services 2 2025-09-07 11:42:07
19 4 social 3 2025-09-07 15:52:15

CREATE TABLE section_items (
id INT AUTO_INCREMENT PRIMARY KEY,
section_id INT,
title JSON, -- {"vi": "Tầm nhìn", "en": "Vision"}
description JSON, -- {"vi": "Mô tả tiếng Việt", "en": "English description"}
image_url VARCHAR(500),
position INT DEFAULT 0,
FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

1 1 {"en": "Moc Dien1111113333", "vi": "Mộc Điền Điền Điền1223"} {"en": "We are a young team passionate about delivering creative, modern, and user-friendly websites.", "vi": "Chúng Chúng Chúng tôi là đội ngũ trẻ, đam mê mang đến những website sáng tạo, hiện đại, và thân thiện với ngư... 0
2 2 {"en": "We are Sang Tao Web", "vi": "Chúng tôi là Sáng Tạo Web Web Web1122"} {"en": "Sang Tao Web is a new web design company, founded with a passion for delivering unique online experiences. We focus on beautiful design, high performance, and user-friendliness, helping your business stand out in the digital world.\n\nOur young t... /image/1757038814734_72c1699d1597c989062cf8ddb0130561.jpg 0
3 3 {"en": "Our Mission", "vi": "Sứ mệnh của chúng tôi tôi"} {"en": "We are committed to delivering creative, easy-to-use websites that help businesses build strong brands. Each project is an opportunity for us to demonstrate passion and expertise, creating memorable digital experiences.", "vi": "Chúng tôi cam k... 1
4 3 {"en": "Our Vision", "vi": "Tầm nhìn của chúng tôi tôi tôi"} {"en": "To become the leading web design company in the region, delivering breakthrough online solutions.We aim to shape the future of web design in Vietnam.", "vi": "Trở thành công ty thiết kế web hàng đầu khu vực, mang đến giải pháp... 2
7 4 {"en": "Title 1fffff123", "vi": "Tiêu đề 1111212321adsd"} {"en": "sssss21312", "vi": "fsdfsdf12321sấ"} /image/1757143732677_daniel-leone-g30P1zcOzXo-unsplash.jpg
8 4 {"en": "Title 2ggggg12321", "vi": "Tiêu đề 22222221312312"} {"en": "ssssddd123", "vi": "sdfsdfsdfds21312321sa"} /image/1757143732674_clay-banks-u27Rrbs9Dwc-unsplash.jpg
9 5 {"en": "Component 2 Title", "vi": "Tiêu đề Component 2 nền tảngffffásdfsd"} {"en": "Component 2 Description", "vi": "Mô tả Component 2ền tảngáda"} 1
10 8 {"en": "Card 1", "vi": "Card 1fffád"} {"en": "Card 1 description", "vi": "Mô tả card 1fá"} /image/1757170236577_daniel-leone-g30P1zcOzXo-unsplash.jpg 1
11 8 {"en": "Card 2", "vi": "Card 2ff"} {"en": "Card 2 description", "vi": "Mô tả card 2f"} /image/1757170236572_9d75af094a82d6c7f8daf835835f618f.jpg 2
12 8 {"en": "Card 3", "vi": "Card 3ff"} {"en": "Card 3 description", "vi": "Mô tả card 3f"} /image/1757170236576_3eb2536a32b01bfc189dc4cf33d91004.jpg 3
13 9 {"en": "Title 1", "vi": "Tiêu đề 1fda"} {"en": "Description 1", "vi": "Mô tả 1fMô tả 3f Mô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fM... /image/1757214506205_hinh-nen-may-tinh-4k-3-1344x840.jpg 1
14 9 {"en": "Title 2", "vi": "Tiêu đề 2f"} {"en": "Description 2", "vi": "Mô tả 2fMô tả 3f Mô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fM... /image/1757214592245_pexels-eberhardgross-1612353.jpg 2
15 9 {"en": "Title 3", "vi": "Tiêu đề 3f"} {"en": "Description 3", "vi": "Mô tả 3f Mô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fM... /image/1757214838723_3eb2536a32b01bfc189dc4cf33d91004.jpg 3
16 9 {"en": "Title 4", "vi": "Tiêu đề 4f"} {"en": "Description 4", "vi": "Mô tả 3f Mô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fM... /image/1757214838734_9d75af094a82d6c7f8daf835835f618f.jpg 4
17 9 {"en": "Title 5", "vi": "Tiêu đề 5f"} {"en": "Description 5", "vi": "Mô tả 5fMô tả 3f Mô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fMô tả 3fM... /image/1757214241567_desk-593327_1920.jpg 5
18 10 {"en": "Benefits for Businesses", "vi": "Lợi ích cho doanh nghiệpf"} {"en": "- Enhance business value\n- Increase credibility\n- Support trade promotion\n- Support online & offline sales", "vi": "Nâng tầm thương hiệu – khẳng định vị thế doanh nghiệp\nGia tăng uy tín – tạo niềm tin vững chắc... 1
19 10 {"en": "Benefits for Consumers", "vi": "Lợi ích cho người tiêu dùngff"} {"en": "- Save time & cost\n- Better brand awareness\n- Improve business efficiency\n- Flexible expansion", "vi": "Tiết kiệm thời gian & chi phí\nNhận diện thương hiệu tốt hơn\nNâng cao hiệu quả kinh doanhf\nLinh hoạt mở rộng"} 2
20 11 {"en": "Marquee message", "vi": "Thông điệp chữ chạydfgdfdfád"} {} 1
21 12 {"en": "Our Clients", "vi": "Khách hàng tiêu biểu"} {"en": "Client description", "vi": "Mô tả khách hàngaa"} /image/1757165192385_daniel-leone-g30P1zcOzXo-unsplash.jpg 1
22 15 {} {} /image/1757237650931_3eb2536a32b01bfc189dc4cf33d91004.jpg 1
23 16 {"en": "Logo", "vi": "Logo"} {} /image/1757219270094_9d75af094a82d6c7f8daf835835f618f.jpg 1
24 16 {"en": "Company Name", "vi": "Tên công ty"} {"en": "Sang Tao Web Company", "vi": "Công ty TNHH Mộc Điền"} 2
25 16 {"en": "Address", "vi": "Địa chỉ"} {"en": "123 ABC Street, District 1, HCMC", "vi": "123 Đường ABC, Quận 1, TP.HCM"} 3
26 16 {"en": "Phone", "vi": "Điện thoại"} {"en": "+84 123 456 789", "vi": "0123 456 789"} 4
27 16 {"en": "Email", "vi": "Email"} {"en": "contact@sangtaoweb.vn", "vi": "contact@sangtaoweb.vn"} 5
28 16 {"en": "About us", "vi": "Về chúng tôi"} {"en": "We are a professional web design company.", "vi": "Chúng tôi là công ty thiết kế web chuyên nghiệp."} 6
29 17 {"en": "Kickstart Online", "vi": "Khởi Đầu Online11"} {"en": "/services/khoi-dau-online1122322", "vi": "/services/khoi-dau-online1122322"} 1
30 17 {"en": "One-Me", "vi": "One-Me"} {"en": "/services/one-me", "vi": "/services/one-me"} 2
31 17 {"en": "Brand Building", "vi": "Xây Dựng Thương Hiệu"} {"en": "/services/brand-building", "vi": "/services/brand-building"} 3
32 17 {"en": "Online Sales", "vi": "Bán Hàng Online"} {"en": "/services/ban-hang-online", "vi": "/services/ban-hang-online"} 4
33 17 {"en": "Service Booking", "vi": "Đặt Lịch Dịch Vụ"} {"en": "/services/dat-lich-dich-vu", "vi": "/services/dat-lich-dich-vu"} 5
34 17 {"en": "Comprehensive Management", "vi": "Quản Lý Toàn Diện"} {"en": "/services/quan-ly-toan-dien", "vi": "/services/quan-ly-toan-dien"} 6
35 17 {"en": "Website + App", "vi": "Website + Ứng Dụng"} {"en": "/services/website-ung-dung", "vi": "/services/website-ung-dung"} 7
36 17 {"en": "RE:VISION", "vi": "RE:VISION"} {"en": "/services/revision", "vi": "/services/revision"} 8
37 17 {"en": "Website Design", "vi": "Thiết kế website"} {"en": "/services/thiet-ke-website", "vi": "/services/thiet-ke-website"} 9
38 17 {"en": "App Design", "vi": "Thiết kế App"} {"en": "/services/thiet-ke-app", "vi": "/services/thiet-ke-app"} 10
39 17 {"en": "Product Marketing", "vi": "Marketing sản phẩm"} {"en": "/services/marketing-san-pham", "vi": "/services/marketing-san-pham"} 11
40 17 {"en": "SEO", "vi": "SEO"} {"en": "/services/seo", "vi": "/services/seo"} 12
53 19 {"en": "Facebook", "vi": "Facebook"} {"en": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate", "vi": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate"} 1
54 19 {"en": "YouTube", "vi": "YouTube"} {"en": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate", "vi": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate"} 2
55 19 {"en": "TikTok", "vi": "TikTok"} {"en": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate", "vi": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate"} 3
56 19 {"en": "LinkedIn", "vi": "LinkedIn"} {"en": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate", "vi": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate"} 4
57 19 {"en": "Instagram", "vi": "Instagram"} {"en": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate", "vi": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate"} 5
58 19 {"en": "Twitter / X", "vi": "Twitter"} {"en": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate", "vi": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate"} 6
59 19 {"en": "Zalo", "vi": "Zalo"} {"en": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate", "vi": "https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate"} 7
