import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { addTokens } from '@/store/watchlistSlice';
import { AddToken } from '@/components/modal/AddToken';
import { Portfolio } from '@/components/portfolio';
import { Watchlist } from '@/components/watchlist';

import type { RootState } from '@/store';
import type { TokenInput } from '@/store/watchlistSlice';
import { usePrices } from '@/hooks/usePrices';

export function Content() {
	const dispatch = useDispatch();
	const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

	const { tokens } = useSelector((state: RootState) => state.watchlist);
	const tokenIds = useMemo(() => tokens.map((token: { id: string }) => token.id), [tokens]);

	const { prices, refresh } = usePrices(tokenIds);

	// Update last updated timestamp when prices change
	useEffect(() => {
		if (prices.length > 0) setLastUpdated(new Date());
	}, [prices]);

	const handleAddTokens = (newTokens: TokenInput[]) => {
		dispatch(addTokens(newTokens));
	};

	return (
		<main>
			<div className="mx-auto px-4 py-4 lg:px-24 lg:py-8">
				<div className="space-y-6 sm:space-y-8">
					{/* Portfolio Section */}
					<div className="dark-2 rounded-2xl p-4 lg:p-8">
						<Portfolio
							tokens={tokens}
							prices={prices}
							lastUpdated={lastUpdated}
							onRefresh={refresh}
						/>
					</div>

					{/* Watchlist Section */}
					<div className="dark-2 rounded-2xl p-4 lg:p-8">
						<div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
							<div className="flex items-center space-x-2">
								<div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-500">
									<span className="text-sm text-white">★</span>
								</div>
								<h2 className="text-xl font-semibold text-white">Watchlist</h2>
							</div>
							<div className="flex items-center space-x-3">
								<button
									onClick={refresh}
									className="rounded-lg bg-gray-700 px-3 py-2 text-xs text-gray-300 hover:bg-gray-600 disabled:opacity-50 sm:px-4 sm:text-sm"
								>
									Refresh Prices
								</button>
								<AddToken
									onAddTokens={handleAddTokens}
									existingTokens={tokens.map((t: { id: string }) => t.id)}
								/>
							</div>
						</div>
						<Watchlist tokens={tokens} prices={prices} />
					</div>

					{/* Empty State */}
					{tokens.length === 0 && (
						<div className="py-16 text-center">
							<div className="mx-auto max-w-md">
								<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-700">
									<span className="text-4xl">📊</span>
								</div>
								<h3 className="mb-2 text-xl font-semibold text-white">
									Start Building Your Portfolio
								</h3>
								<p className="mb-6 text-gray-400">
									Add tokens to your watchlist to track their performance and manage your holdings.
								</p>
								<AddToken onAddTokens={handleAddTokens} existingTokens={[]} />
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
