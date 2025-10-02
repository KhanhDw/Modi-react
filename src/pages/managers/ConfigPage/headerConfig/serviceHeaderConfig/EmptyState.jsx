import { FileText } from "lucide-react";

export default function EmptyState({ text }) {
  return (
    <div className="text-center py-8 text-gray-500 admin-dark:text-gray-400 font-semibold">
      <FileText className="h-10 w-10 mx-auto mb-4 opacity-50" />
      <p>{text}</p>
    </div>
  );
}
