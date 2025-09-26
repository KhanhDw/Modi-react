import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
    if (totalPages <= 1) return null; // Nếu chỉ có 1 trang thì ẩn luôn

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
            >
                Trước
            </Button>

            {currentPage > 3 && (
                <>
                    <Button onClick={() => setCurrentPage(1)}>1</Button>
                    <span className="px-2">...</span>
                </>
            )}

            {getPageNumbers().map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 ${currentPage === page ? "bg-blue-600 text-white" : ""}`}
                >
                    {page}
                </Button>
            ))}

            {currentPage < totalPages - 2 && (
                <>
                    <span className="px-2">...</span>
                    <Button onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
                </>
            )}

            <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
            >
                Sau
            </Button>
        </div>
    );
}
