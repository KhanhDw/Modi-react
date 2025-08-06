
import ImageUpload from "./ImageUpload"



function FullUsageImageUpload() {
    const handleUploadSuccess = (uploadedFiles) => {
        console.log('Upload thành công:', uploadedFiles);
        // Có thể gọi API khác, cập nhật state parent, etc.
    };

    const handleUploadError = (error) => {
        console.error('Upload lỗi:', error);
        // Xử lý lỗi, hiển thị thông báo, etc.
    };

    const customValidation = (file) => {
        // Validation tùy chỉnh
        if (file.name.includes('test')) {
            return {
                valid: false,
                error: 'Không được chứa từ "test" trong tên file'
            };
        }
        return { valid: true };
    };

    return (
        <div>
            <ImageUpload
                // API Configuration
                apiBaseUrl="http://localhost:3000"
                uploadPath="/api/upload"
                uploadMultiplePath="/api/upload-multiple"
                imagesPath="/api/images"
                deletePath="/api/images"

                // File Limits
                maxFileSize={10 * 1024 * 1024} // 10MB
                maxFiles={1}
                allowedTypes={['image/jpg', 'image/jpeg', 'image/png', 'image/webp']}

                // UI Customization
                title="Upload Ảnh Sản Phẩm"
                showTitle={true}
                showPreview={true}
                showUploadedList={true}
                theme="minimal" // 'default', 'dark', 'minimal"

                // Callbacks
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                onDeleteSuccess={(filename) => console.log('Đã xóa:', filename)}
                onDeleteError={(error) => console.error('Lỗi xóa:', error)}
                onFileSelect={(files) => console.log('Đã chọn files:', files)}

                // Advanced Options
                autoRefresh={true}
                enableDragDrop={true}
                showFileInfo={true}
                gridColumns={{ sm: 1, md: 2, lg: 3 }}
                customValidation={customValidation}

                // Headers cho API calls
                headers={{
                    'Authorization': 'Bearer your-token',
                    'X-Custom-Header': 'value'
                }}

                // Thư mục con
                subfolder="products"
            />
        </div>
    );
}


export default FullUsageImageUpload;