import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  themeMode?: boolean;
}

export default function PaginationNP({
  total,
  page,
  limit,
  totalPages,
  onPageChange,
  themeMode = false,
}: PaginationProps) {
  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Theme classes
  const buttonBaseClass = `px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`;
  const activeButtonClass = themeMode
    ? "bg-blue-600 text-white"
    : "bg-gray-900 text-white";
  const inactiveButtonClass = themeMode
    ? "text-gray-900 hover:bg-gray-100"
    : "text-gray-900 hover:text-gray-100 hover:bg-gray-800";
  const textClass = themeMode ? "text-gray-900" : "text-gray-100";
  const ellipsisClass = themeMode ? "text-gray-500" : "text-gray-400";

  return (
    <div className="flex items-center justify-between mt-6 select-none">
      <div className={`text-sm ${textClass}`}>
        Showing {Math.min((page - 1) * limit + 1, total)} to{" "}
        {Math.min(page * limit, total)} of {total} results
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`${buttonBaseClass} ${inactiveButtonClass}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() =>
              typeof pageNum === "number" ? onPageChange(pageNum) : null
            }
            disabled={pageNum === "..."}
            className={`${buttonBaseClass} ${
              pageNum === page
                ? activeButtonClass
                : pageNum === "..."
                  ? ellipsisClass
                  : inactiveButtonClass
            }`}
            aria-label={
              typeof pageNum === "number"
                ? `Go to page ${pageNum}`
                : "More pages"
            }
            aria-current={pageNum === page ? "page" : undefined}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`${buttonBaseClass} ${inactiveButtonClass}`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
