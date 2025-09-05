import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image, Trash2, Eye, Settings, Info } from 'lucide-react';


// ======================================================
// api server upload đã thay đổi - cấu hình lại api để dùng
// ======================================================

export default function ImageUpload({
    // CẤU HÌNH MẶC ĐỊNH CHO COMPONENT, NẾU CÓ CẤU HÌNH KHÁC TỪ BÊN NGOÀI THÌ SẼ BỊ GHI ĐÈ
    // Cấu hình cơ bản
    apiBaseUrl = `${import.meta.env.VITE_MAIN_BE_URL}`,
    uploadPath = '/api/upload',
    uploadMultiplePath = '/api/upload-multiple',
    imagesPath = '/api/images',
    deletePath = '/api/delete',

    // Giới hạn file
    maxFileSize = 5 * 1024 * 1024, // 5MB
    maxFiles = 1, // tối đa 1 file ảnh được thêm vào
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],

    // UI customization
    title = 'Upload Ảnh lên Server',
    showTitle = true,
    showPreview = true,
    showUploadedList = true,
    theme = 'default', // 'default', 'dark', 'minimal'

    // Callbacks
    onUploadSuccess = null,
    onUploadError = null,
    onDeleteSuccess = null,
    onDeleteError = null,
    onFileSelect = null,

    // Tùy chọn khác
    autoRefresh = true,
    enableDragDrop = true,
    showFileInfo = true,
    gridColumns = { sm: 2, md: 3, lg: 4 },

    // Validation tùy chỉnh
    customValidation = null,

    // Headers cho API calls
    headers = {},

    // Thư mục con (nếu muốn lưu vào thư mục con)
    subfolder = null,

    // đang là thêm ảnh mới = false || đang là chỉnh sửa ảnh cũ = true
    isUploadNewImage = null,

    // fileNameImage = để lấy ảnh khi đó là chỉnh sửa
    fileNameImage = null

}) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef();





    // Theme styles
    const themes = {
        default: {
            container: 'bg-white rounded-lg shadow-md',
            button: 'bg-blue-500 hover:bg-blue-600 text-white',
            deleteButton: 'text-red-500 hover:text-red-600',
            viewButton: 'text-blue-500 hover:text-blue-600'
        },
        dark: {
            container: 'bg-gray-800 rounded-lg shadow-md text-white',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            deleteButton: 'text-red-400 hover:text-red-300',
            viewButton: 'text-blue-400 hover:text-blue-300'
        },
        minimal: {
            container: 'border rounded-lg',
            button: 'bg-gray-900 hover:bg-gray-800 text-white',
            deleteButton: 'text-red-600 hover:text-red-500',
            viewButton: 'text-gray-600 hover:text-gray-500'
        }
    };

    const currentTheme = themes[theme] || themes.default;

    // Xử lý chọn file
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        processSelectedFiles(files);
    };

    // Xử lý drag & drop
    const handleDragOver = (e) => {
        e.preventDefault();
        if (enableDragDrop) {
            setDragOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);

        if (enableDragDrop) {
            const files = Array.from(e.dataTransfer.files);
            processSelectedFiles(files);
        }
    };

    // Xử lý files đã chọn
    const processSelectedFiles = (files) => {
        // Validate số lượng file
        if (files.length > maxFiles) {
            alert(`Chỉ được chọn tối đa ${maxFiles} file`);
            return;
        }

        // Validate từng file
        const validFiles = [];
        const errors = [];

        files.forEach(file => {
            const validation = validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        });

        if (errors.length > 0) {
            alert('Có lỗi với một số file:\n' + errors.join('\n'));
        }

        if (validFiles.length > 0) {
            setSelectedFiles(validFiles);

            // Tạo preview
            const previews = validFiles.map(file => ({
                file,
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size
            }));
            setPreviewImages(previews);

            // Callback
            onFileSelect && onFileSelect(validFiles);
        }
    };

    // Validate file
    const validateFile = (file) => {
        // Kiểm tra kích thước
        if (file.size > maxFileSize) {
            return {
                valid: false,
                error: `File quá lớn. Tối đa ${formatFileSize(maxFileSize)}`
            };
        }

        // Kiểm tra loại file
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
            };
        }

        // Custom validation
        if (customValidation) {
            const customResult = customValidation(file);
            if (!customResult.valid) {
                return customResult;
            }
        }

        return { valid: true };
    };

    // Upload files
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert('Vui lòng chọn ảnh để upload');
            return;
        }

        setUploading(true);
        setUploadProgress({});

        try {
            let result;
            const formData = new FormData();

            if (selectedFiles.length === 1) {
                formData.append('image', selectedFiles[0]);
                if (subfolder) formData.append('subfolder', subfolder);

                if (fileNameImage) { deleteImage(fileNameImage.split('/').pop()) }

                result = await uploadRequest(apiBaseUrl + uploadPath, formData);
            } else {
                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });
                if (subfolder) formData.append('subfolder', subfolder);

                result = await uploadRequest(apiBaseUrl + uploadMultiplePath, formData);
            }

            if (result.success) {
                const newImages = Array.isArray(result.data) ? result.data : [result.data];
                setUploadedImages(prev => [...prev, ...newImages]);

                // Reset form
                resetForm();

                // Callbacks
                onUploadSuccess && onUploadSuccess(result.data);



                // Auto refresh nếu được bật
                if (autoRefresh) {
                    // await fetchUploadedImages();
                    await fetchUploadedImage();
                }

                alert(result.message || 'Upload thành công!');
            } else {
                throw new Error(result.message || 'Upload thất bại');
            }
        } catch (error) {
            const errorMessage = error.message || 'Lỗi upload';
            alert('Lỗi upload: ' + errorMessage);
            onUploadError && onUploadError(error);
        } finally {
            setUploading(false);
            setUploadProgress({});
        }
    };

    // Upload request với progress
    const uploadRequest = async (url, formData) => {
        const requestHeaders = {
            ...headers
        };

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: requestHeaders
        });

        return await response.json();
    };

    // Reset form
    const resetForm = () => {
        setSelectedFiles([]);
        setPreviewImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Lấy danh sách ảnh đã upload
    // const fetchUploadedImages = async () => {
    //     try {
    //         const url = subfolder
    //             ? `${apiBaseUrl}${imagesPath}?subfolder=${subfolder}`
    //             : `${apiBaseUrl}${imagesPath}`;

    //         const response = await fetch(url, { headers });
    //         const result = await response.json();

    //         if (result.success) {
    //             setUploadedImages(result.data || []);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching images:', error);
    //     }
    // };


    const fetchUploadedImage = async () => {
        try {
            if (fileNameImage) {
                const response = await fetch(fileNameImage, { method: 'HEAD' }); // chỉ kiểm tra có tồn tại
                if (response.ok) {
                    setUploadedImages([{
                        url: fileNameImage,
                        filename: fileNameImage.split('/').pop()
                    }]);
                } else {
                    console.error('Ảnh không tồn tại:', fileNameImage);
                }
            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };



    // Xóa ảnh
    const deleteImage = async (filename) => {
        if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;

        try {
            const url = `${apiBaseUrl}${deletePath}/${filename}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers
            });
            const result = await response.json();

            if (result.success) {
                setUploadedImages(prev => prev.filter(img => img.filename !== filename));
                onDeleteSuccess && onDeleteSuccess(filename);
                alert('Xóa ảnh thành công');
            } else {
                throw new Error(result.message || 'Xóa thất bại');
            }
        } catch (error) {
            const errorMessage = error.message || 'Lỗi xóa ảnh';
            alert('Lỗi: ' + errorMessage);
            onDeleteError && onDeleteError(error);
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Load ảnh khi component mount
    // useEffect(() => {
    //     fetchUploadedImages();
    // }, [apiBaseUrl, imagesPath, subfolder]);

    useEffect(() => {
        fetchUploadedImage();
    }, [fileNameImage]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {showTitle && (
                <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {title}
                </h1>
            )}

            {/* Upload Section */}
            <div className={`${currentTheme.container} p-6 mb-8`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Upload className="mr-2" size={24} />
                    Chọn và Upload Ảnh
                    {showFileInfo && (
                        <span className="ml-2 text-sm text-gray-500">
                            (Max: {maxFiles} files, {formatFileSize(maxFileSize)} per file)
                        </span>
                    )}
                </h2>

                {/* Drag & Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mb-4 p-6 border-2 border-dashed rounded-lg transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        } ${enableDragDrop ? 'cursor-pointer' : ''}`}
                    onClick={() => enableDragDrop && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={allowedTypes.join(',')}
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="text-center">
                        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-lg mb-2">
                            {enableDragDrop ? 'Kéo thả file vào đây hoặc click để chọn' : 'Click để chọn file'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Hỗ trợ: {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                        </p>
                    </div>
                </div>

                {/* Manual File Input */}
                <div className="mb-4">
                    <input
                        type="file"
                        multiple
                        accept={allowedTypes.join(',')}
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {/* Preview Selected Files */}
                {showPreview && previewImages.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Preview ({previewImages.length} files):</h3>
                        <div className={`grid gap-4 grid-cols-${gridColumns.sm} md:grid-cols-${gridColumns.md} lg:grid-cols-${gridColumns.lg}`}>
                            {previewImages.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => {
                                            const newFiles = selectedFiles.filter((_, i) => i !== index);
                                            const newPreviews = previewImages.filter((_, i) => i !== index);
                                            setSelectedFiles(newFiles);
                                            setPreviewImages(newPreviews);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="mt-1 text-xs text-gray-600 truncate">
                                        {preview.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatFileSize(preview.size)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={handleUpload}
                        disabled={uploading || selectedFiles.length === 0}
                        className={`${currentTheme.button} disabled:bg-gray-400 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                    >
                        <Upload size={20} />
                        {uploading ? 'Đang upload...' : 'Upload Ảnh'}
                    </button>

                    {selectedFiles.length > 0 && (
                        <button
                            onClick={resetForm}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </div>

            {/* Uploaded Images Section */}
            {isUploadNewImage === true && showUploadedList && (
                <div className={`${currentTheme.container} p-6`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                            <Image className="mr-2" size={24} />
                            Ảnh đã Upload ({uploadedImages.length})
                        </h2>
                        {/* <button 
                            onClick={fetchUploadedImages}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Làm mới
                        </button> */}
                        <button
                            onClick={fetchUploadedImage}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Làm mới
                        </button>
                    </div>

                    {uploadedImages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Image size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Chưa có ảnh nào được upload</p>
                        </div>
                    ) : (
                        <div className={`grid gap-6 grid-cols-1 md:grid-cols-${gridColumns.md} lg:grid-cols-${gridColumns.lg}`}>
                            {uploadedImages.map((image, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden">
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-3">
                                        <p className="font-medium text-sm truncate mb-1">
                                            {image.filename}
                                        </p>
                                        {showFileInfo && image.sizeFormatted && (
                                            <p className="text-xs text-gray-500 mb-2">
                                                {image.sizeFormatted}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <a
                                                href={image.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center ${currentTheme.viewButton} text-sm`}
                                            >
                                                <Eye size={16} className="mr-1" />
                                                Xem
                                            </a>
                                            <button
                                                onClick={() => deleteImage(image.filename)}
                                                className={`flex items-center ${currentTheme.deleteButton} text-sm`}
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}