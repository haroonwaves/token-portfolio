import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { RootState } from './store';
import { addTokens, removeToken, setHoldings, type TokenInput } from './store/watchlistSlice';
import { usePrices } from './hooks/usePrices';
import { Portfolio } from './components/portfolio';
import { Watchlist } from './components/watchlist';
import { AddToken } from './components/modal/AddToken';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

function App() {
	const dispatch = useDispatch();
	const { tokens } = useSelector((state: RootState) => state.watchlist);
	const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

	const tokenIds = useMemo(() => tokens.map((token: { id: string }) => token.id), [tokens]);

	const { prices, loading, refresh } = usePrices(tokenIds);

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

	const handleRefresh = async () => {
		await refresh();
	};

	console.log('prices', prices);

	return (
		<div className="bg-background min-h-screen">
			{/* Header */}
			<header className="bg-card border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold">Token Portfolio</h1>
							<p className="text-muted-foreground">Track your cryptocurrency investments</p>
						</div>
						<div className="flex items-center space-x-4">
							<Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
								<RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
								Refresh Prices
							</Button>
							<ConnectButton />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
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
		</div>
	);
}

export default App;
