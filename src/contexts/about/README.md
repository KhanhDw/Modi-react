# About Page Contexts

Thư mục này chứa các Context cho trang About, được tổ chức riêng biệt để dễ quản lý và tái sử dụng.

## Cấu trúc

\`\`\`
contexts/about/
├── ThemeContext.jsx     # Quản lý Dark/Light mode
├── LanguageContext.jsx  # Quản lý đa ngôn ngữ
└── README.md           # Hướng dẫn sử dụng
\`\`\`

## ThemeContext

### Sử dụng:
\`\`\`jsx
import { ThemeProvider, useTheme } from '../contexts/about/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <YourComponent />
    </ThemeProvider>
  )
}

function YourComponent() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <div className={isDark ? 'dark-theme' : 'light-theme'}>
      <button onClick={toggleTheme}>
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  )
}
\`\`\`

## LanguageContext

### Sử dụng:
\`\`\`jsx
import { LanguageProvider, useLanguage } from '../contexts/about/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <YourComponent />
    </LanguageProvider>
  )
}

function YourComponent() {
  const { language, toggleLanguage, t } = useLanguage()
  
  return (
    <div>
      <h1>{t('welcomeMessage')}</h1>
      <button onClick={toggleLanguage}>
        {language === 'vi' ? 'English' : 'Tiếng Việt'}
      </button>
    </div>
  )
}
\`\`\`

### Thêm ngôn ngữ mới:
1. Mở `LanguageContext.jsx`
2. Thêm key mới vào object `translations`
3. Cập nhật logic `toggleLanguage` nếu cần

### Thêm text mới:
1. Thêm key-value vào tất cả ngôn ngữ trong `translations`
2. Sử dụng `t('newKey')` trong component

## Tái sử dụng cho trang khác

### Cách 1: Copy và customize
\`\`\`bash
cp -r contexts/about contexts/contact
# Sau đó chỉnh sửa theo nhu cầu trang contact
\`\`\`

### Cách 2: Tạo global contexts
\`\`\`bash
mkdir contexts/global
# Tạo contexts dùng chung cho toàn bộ app
\`\`\`

## Best Practices

1. **Naming**: Đặt tên rõ ràng cho từng context
2. **Error handling**: Luôn có try-catch cho localStorage
3. **Default values**: Luôn có giá trị mặc định
4. **Documentation**: Comment rõ ràng cách sử dụng
5. **Separation**: Tách riêng context cho từng trang/feature
