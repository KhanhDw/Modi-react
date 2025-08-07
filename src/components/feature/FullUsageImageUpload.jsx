
import ImageUpload from "./ImageUpload"
import React, { useState, useEffect } from "react";


function FullUsageImageUpload({ fileImageUploadSuccess = "", isUploadNewImage, uploadedFilenameProps }) {

    const [uploadedFilename, setUploadedFilename] = useState("");


    useEffect(() => {
        if (uploadedFilename && typeof fileImageUploadSuccess === "function") {
            console.log("✅ updated uploadedFilename:", uploadedFilename);
            fileImageUploadSuccess(uploadedFilename);
        }
    }, [uploadedFilename]);




    const handleUploadSuccess = (uploadedFiles) => {
        console.log('Upload thành công:', uploadedFiles);
        // Có thể gọi API khác, cập nhật state parent, etc.

        setUploadedFilename(uploadedFiles.filename);


        console.log(uploadedFilename + " :goij goij :" + uploadedFiles.filename);
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
                apiBaseUrl="MAIN_BE_URL"
                uploadPath="/api/upload"
                uploadMultiplePath="/api/upload-multiple"
                imagesPath="/api/images"
                deletePath="/api/delete"

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

                // Thư mục con muốn lưu ảnh
                // subfolder="products"

                isUploadNewImage={isUploadNewImage}
                fileNameImage={uploadedFilenameProps}
            />
        </div>
    );
}


export default FullUsageImageUpload;