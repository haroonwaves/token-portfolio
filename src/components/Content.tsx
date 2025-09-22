import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { addTokens } from '@/store/watchlistSlice';
import { AddToken } from '@/components/modal/AddToken';
import { Portfolio } from '@/components/portfolio';
import { Watchlist } from '@/components/watchlist';
import { usePrices } from '@/hooks/usePrices';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Star } from 'lucide-react';

import type { RootState } from '@/store';
import type { TokenInput } from '@/store/watchlistSlice';

export function Content() {
	const dispatch = useDispatch();
	const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

	const { tokens } = useSelector((state: RootState) => state.watchlist);
	const tokenIds = useMemo(() => tokens.map((token: { id: string }) => token.id), [tokens]);

	const { prices, refresh, loading, error } = usePrices(tokenIds);

	useEffect(() => {
		if (prices.length > 0) setLastUpdated(new Date());
	}, [prices]);

	const handleAddTokens = (newTokens: TokenInput[]) => {
		dispatch(addTokens(newTokens));
	};

	return (
		<main>
			<div className="lg:p mx-auto px-2 py-8 lg:px-24">
				<div className="space-y-12 sm:space-y-18">
					{/* Portfolio Section */}
					<div className="dark-2 rounded-xl p-4 lg:p-8">
						<Portfolio
							tokens={tokens}
							prices={prices}
							lastUpdated={lastUpdated}
							loading={loading}
							error={error}
						/>
					</div>

					{/* Watchlist Section */}
					<div>
						<div className="mb-6 flex flex-row items-center justify-between">
							<div className="flex flex-row items-center space-x-2">
								<Star className="h-7 w-7" fill="#A9E851" stroke="none" />
								<h4 className="flex items-center text-xl leading-none font-medium text-white">
									Watchlist
								</h4>
							</div>
							<div className="flex items-center space-x-3">
								<Button
									onClick={refresh}
									className={`custom-button-2!`}
									disabled={loading || (tokens.length === 0 && !error)}
								>
									<RefreshCcw
										className={`h-4 w-4 transition-transform duration-300 ${loading ? 'animate-spin' : ''}`}
										stroke="#A1A1AA"
									/>
									<span className="m-0 hidden p-0 md:inline">Refresh Prices</span>
								</Button>
								<AddToken
									onAddTokens={handleAddTokens}
									existingTokens={tokens.map((t: { id: string }) => t.id)}
								/>
							</div>
						</div>
						<Watchlist tokens={tokens} prices={prices} loading={loading} />
					</div>
				</div>
			</div>
		</main>
	);
}
