import { useMemo, useState, useCallback, useEffect } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { ListRow } from '@/components/watchlist/ListRow';

import { type Token } from '@/store/watchlistSlice';
import { type CoinGeckoCoin } from '@/api/coingecko';
import type { Row } from '@/components/watchlist/ListRow';

interface WatchlistProps {
	tokens: Token[];
	prices: CoinGeckoCoin[];
}

export function Watchlist({ tokens, prices }: WatchlistProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const tableData = useMemo(() => {
		return tokens.map((token) => {
			const price = prices.find((p) => p.id === token.id);
			const currentPrice = price?.current_price || 0;
			const change24h = price?.price_change_percentage_24h || 0;
			const value = currentPrice * token.holdings;
			const sparklineData = price?.sparkline_in_7d?.price || [];

			return {
				...token,
				currentPrice,
				change24h,
				value,
				sparklineData,
				isPositive: change24h >= 0,
			};
		});
	}, [tokens, prices]);

	const paginatedData: Row[] = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return tableData.slice(startIndex, endIndex);
	}, [tableData, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(tokens.length / itemsPerPage);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	// Reset to page 1 when tokens change
	useEffect(() => {
		setCurrentPage(1);
	}, [tokens.length]);

	if (tokens.length === 0) {
		return (
			<div className="py-8 text-center text-gray-400">
				<p className="text-lg font-medium">No tokens in watchlist</p>
				<p className="text-sm">Add tokens to start tracking your portfolio</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-left">Token</TableHead>
							<TableHead className="text-left">Price</TableHead>
							<TableHead className="text-left">24h %</TableHead>
							<TableHead className="text-left">Sparkline (7d)</TableHead>
							<TableHead className="text-left">Holdings</TableHead>
							<TableHead className="text-left">Value</TableHead>
							<TableHead className="w-12"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedData.map((token) => (
							<ListRow key={token.id} tokens={tokens} row={token} />
						))}
					</TableBody>
				</Table>
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={tokens.length}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}
