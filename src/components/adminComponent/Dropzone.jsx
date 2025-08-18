// npm install react-dropzone
import { useDropzone } from "react-dropzone";
import { useState } from "react";

const Dropzone = () => {
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        const mappedFiles = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        );
        setFiles(mappedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/webp": [],
            "image/svg+xml": [],
        },
        multiple: true, // Cho phép nhiều file
    });

    return (
        <div className="p-6 max-w-[600px] mx-auto m-4 shadow bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 admin-dark:text-gray-100">
                Dropzone
            </h3>

            {/* Khu vực kéo thả */}
            <div
                {...getRootProps()}
                className={`p-10 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center
          ${isDragActive
                        ? "border-indigo-500 bg-gray-100 admin-dark:bg-gray-700"
                        : "border-gray-300 bg-gray-50 admin-dark:bg-gray-900"
                    }
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-gray-200 admin-dark:bg-gray-600 flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-700 admin-dark:text-gray-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-3 3m3-3l3 3m-3-3V3"
                            />
                        </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 admin-dark:text-gray-100">
                        {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                    </h4>
                    <p className="text-gray-600 admin-dark:text-gray-400 text-sm mt-2 text-center">
                        Drag and drop your PNG, JPG, WebP, SVG images here or
                    </p>
                    <span className="mt-2 text-indigo-600 admin-dark:text-indigo-400 underline text-sm">
                        Browse File
                    </span>
                </div>
            </div>

            {/* Hiển thị preview file */}
            {files.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {files.map((file, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-lg overflow-hidden border border-gray-200 admin-dark:border-gray-600"
                        >
                            <img
                                src={file.preview}
                                alt={file.name}
                                className="w-full h-32 object-cover"
                                onLoad={() => URL.revokeObjectURL(file.preview)}
                            />
                            <p className="text-xs text-center truncate p-1 text-gray-600 admin-dark:text-gray-300">
                                {file.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropzone;
