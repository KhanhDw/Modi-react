//npm install react-dropzone
import { useDropzone } from "react-dropzone";

const DropzoneComponent = () => {
    const onDrop = (acceptedFiles) => {
        console.log("Dropped files:", acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/webp": [],
            "image/svg+xml": [],
        },
    });

    return (
        <div className="p-6 max-w-[600px] mx-auto m-4 shadow bg-white border border-gray-200 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Dropzone</h3>
            <div
                {...getRootProps()}
                className={`p-10 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center
          ${isDragActive ? "border-indigo-500 bg-gray-100" : "border-gray-300 bg-gray-50"}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-700"
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
                    <h4 className="text-lg font-semibold text-gray-800">
                        {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                    </h4>
                    <p className="text-gray-600 text-sm mt-2 text-center">
                        Drag and drop your PNG, JPG, WebP, SVG images here or
                    </p>
                    <span className="mt-2 text-indigo-600 underline text-sm">Browse File</span>
                </div>
            </div>
        </div>
    );
};

export default DropzoneComponent;
