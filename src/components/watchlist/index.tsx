import { useMemo, useState, useCallback, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Loader } from '@/components/ui/loader';
import { ListRow } from '@/components/watchlist/ListRow';

import { type Token } from '@/store/watchlistSlice';
import { type CoinGeckoCoin } from '@/api/coingecko';
import type { Row } from '@/components/watchlist/ListRow';

interface WatchlistProps {
	tokens: Token[];
	prices: CoinGeckoCoin[];
	loading: boolean;
}

export function Watchlist({ tokens, prices, loading }: WatchlistProps) {
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

	return (
		<Loader isLoading={loading}>
			<div className="rounded-xl border">
				<Table className="overflow-hidden">
					<TableHeader>
						<TableRow className="dark-2 hover:dark-2! rounded-t-xl!">
							<TableHead className="rounded-tl-xl! px-7 py-5 text-left font-medium text-[#A1A1AA]">
								Token
							</TableHead>
							<TableHead className="text-left font-medium text-[#A1A1AA]">Price</TableHead>
							<TableHead className="text-left font-medium text-[#A1A1AA]">24h %</TableHead>
							<TableHead className="text-left font-medium text-[#A1A1AA]">Sparkline (7d)</TableHead>
							<TableHead className="text-left font-medium text-[#A1A1AA]">Holdings</TableHead>
							<TableHead className="text-left font-medium text-[#A1A1AA]">Value</TableHead>
							<TableHead className="w-12 rounded-tr-xl! font-medium text-[#A1A1AA]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tokens.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="py-8">
									<div className="flex h-26 flex-col items-center justify-center text-[#A1A1AA]/60">
										<p className="text-lg font-medium">No tokens in watchlist</p>
										<p className="text-sm">Add tokens to start tracking prices</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							paginatedData.map((token) => <ListRow key={token.id} tokens={tokens} row={token} />)
						)}
						<TableRow>
							<TableCell colSpan={7} className="rounded-b-xl border-t px-7 py-4">
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									totalItems={tokens.length}
									itemsPerPage={itemsPerPage}
									onPageChange={handlePageChange}
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</Loader>
	);
}
