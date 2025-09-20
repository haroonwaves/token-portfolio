interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	className = '',
}: PaginationProps) {
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<div
			className={`mt-4 flex flex-col items-center justify-between space-y-2 border-t border-gray-700 pt-4 sm:mt-6 sm:flex-row sm:space-y-0 ${className}`}
		>
			<div className="text-xs text-gray-400 sm:text-sm">
				{startItem} - {endItem} of {totalItems} results
			</div>
			<div className="flex items-center space-x-2">
				<span className="text-xs text-gray-400 sm:text-sm">
					{currentPage} of {totalPages} pages
				</span>
				<button
					className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Prev
				</button>
				<button
					className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div>
	);
}
