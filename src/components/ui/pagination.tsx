import { Button } from '@/components/ui/button';

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
		<div className={`flex items-center justify-between space-y-2 ${className}`}>
			<div className="m-0 text-sm text-[#A1A1AA]">
				{startItem} - {endItem} of {totalItems} results
			</div>
			<div className="flex items-center space-x-2">
				<span className="text-sm text-[#A1A1AA]">
					{currentPage} of {totalPages} pages
				</span>
				<Button
					className="hover:lighten cursor-pointer"
					variant="ghost"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Prev
				</Button>
				<Button
					className="hover:lighten cursor-pointer"
					variant="ghost"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={totalItems === 0 || currentPage === totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
