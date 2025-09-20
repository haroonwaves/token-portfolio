import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addTokens, removeToken, setHoldings } from '@/store/watchlistSlice';
import { AddToken } from '@/components/modal/AddToken';
import { Portfolio } from '@/components/portfolio';
import { Watchlist } from '@/components/watchlist';

import type { RootState } from '@/store';
import type { TokenInput } from '@/store/watchlistSlice';
import type { CoinGeckoCoin } from '@/api/coingecko';

interface ContentProps {
	handleRefresh: () => void;
	prices: CoinGeckoCoin[];
}

export function Content({ handleRefresh, prices }: Readonly<ContentProps>) {
	const dispatch = useDispatch();
	const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

	const { tokens } = useSelector((state: RootState) => state.watchlist);

	// Update last updated timestamp when prices change
	useEffect(() => {
		if (prices.length > 0) setLastUpdated(new Date());
	}, [prices]);

	const handleAddTokens = (newTokens: TokenInput[]) => {
		dispatch(addTokens(newTokens));
	};

	const handleRemoveToken = (tokenId: string) => {
		dispatch(removeToken(tokenId));
	};

	const handleUpdateHoldings = (tokenId: string, holdings: number) => {
		dispatch(setHoldings({ id: tokenId, holdings }));
	};

	return (
		<main className="container mx-auto px-2 py-4">
			<div className="space-y-8">
				{/* Add Token Section */}
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Your Portfolio</h2>
						<p className="text-muted-foreground">
							Manage your token holdings and track performance
						</p>
					</div>
					<AddToken
						onAddTokens={handleAddTokens}
						existingTokens={tokens.map((t: { id: string }) => t.id)}
					/>
				</div>

				{/* Portfolio and Watchlist Grid */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					{/* Portfolio Card */}
					<div className="lg:col-span-1">
						<Portfolio
							tokens={tokens}
							prices={prices}
							lastUpdated={lastUpdated}
							onRefresh={handleRefresh}
						/>
					</div>

					{/* Watchlist Table */}
					<div className="lg:col-span-1">
						<Watchlist
							tokens={tokens}
							prices={prices}
							onUpdateHoldings={handleUpdateHoldings}
							onRemoveToken={handleRemoveToken}
						/>
					</div>
				</div>

				{/* Empty State */}
				{tokens.length === 0 && (
					<div className="py-16 text-center">
						<div className="mx-auto max-w-md">
							<div className="bg-muted mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
								<span className="text-4xl">📊</span>
							</div>
							<h3 className="mb-2 text-xl font-semibold">Start Building Your Portfolio</h3>
							<p className="text-muted-foreground mb-6">
								Add tokens to your watchlist to track their performance and manage your holdings.
							</p>
							<AddToken onAddTokens={handleAddTokens} existingTokens={[]} />
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
