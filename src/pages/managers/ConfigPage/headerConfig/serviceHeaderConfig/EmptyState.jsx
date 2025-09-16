import { FileText } from "lucide-react";

export default function EmptyState({ text }) {
    return (
        <div className="text-center py-8 text-gray-200 admin-dark:text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{text}</p>
        </div>
    );
}

