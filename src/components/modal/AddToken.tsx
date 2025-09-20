import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { type SearchResult, fetchTokens, fetchTrending } from '@/api/coingecko';

import type { TokenInput } from '@/store/watchlistSlice';

interface AddTokenProps {
	onAddTokens: (tokens: TokenInput[]) => void;
	existingTokens: string[];
}

export function AddToken({ onAddTokens, existingTokens }: AddTokenProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [trendingTokens, setTrendingTokens] = useState<SearchResult[]>([]);
	const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load trending tokens when modal opens
	useEffect(() => {
		if (open) {
			loadTrending();
		}
	}, [open]);

	// Search tokens with debounce
	useEffect(() => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		const timeoutId = setTimeout(() => {
			searchForTokens(searchQuery);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchQuery]);

	const loadTrending = async () => {
		try {
			setLoading(true);
			setError(null);
			const trending = await fetchTrending();
			setTrendingTokens(trending);
		} catch (err) {
			setError('Failed to load trending tokens');
			console.error('Error loading trending:', err);
		} finally {
			setLoading(false);
		}
	};

	const searchForTokens = async (query: string) => {
		try {
			setLoading(true);
			setError(null);
			const results = await fetchTokens(query);
			setSearchResults(results);
		} catch (err) {
			setError('Failed to search tokens');
			console.error('Error searching tokens:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleTokenSelect = (tokenId: string) => {
		setSelectedTokens((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(tokenId)) {
				newSet.delete(tokenId);
			} else {
				newSet.add(tokenId);
			}
			return newSet;
		});
	};

	const handleAddTokens = () => {
		const allTokens = [...searchResults, ...trendingTokens];
		const tokensToAdd = allTokens
			.filter((token) => selectedTokens.has(token.id))
			.filter((token) => !existingTokens.includes(token.id))
			.map((token) => ({
				id: token.id,
				name: token.name,
				symbol: token.symbol,
				image: token.thumb,
			}));

		if (tokensToAdd.length > 0) {
			onAddTokens(tokensToAdd);
			setSelectedTokens(new Set());
			setSearchQuery('');
			setSearchResults([]);
			setOpen(false);
		}
	};

	const isTokenSelected = (tokenId: string) => selectedTokens.has(tokenId);
	const isTokenAlreadyAdded = (tokenId: string) => existingTokens.includes(tokenId);

	const displayTokens = searchQuery.trim() ? searchResults : trendingTokens;
	const hasSelectedTokens = selectedTokens.size > 0;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600">
					+ Add Token
				</button>
			</DialogTrigger>
			<DialogContent className="dark max-h-[80vh] max-w-2xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Search + Add Token Modal</DialogTitle>
				</DialogHeader>

				<div className="flex flex-1 flex-col space-y-6">
					{/* Search Input */}
					<div className="relative">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
						<input
							placeholder="Search tokens (e.g., ETH, SOL)..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-lg border border-gray-600 bg-gray-700 py-3 pr-4 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
						/>
					</div>

					{/* Error State */}
					{error && (
						<div className="rounded-lg bg-red-900/20 p-3 text-sm text-red-400">{error}</div>
					)}

					{/* Loading State */}
					{loading && (
						<div className="py-8 text-center text-gray-400">
							<div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-500"></div>
							<p className="mt-2">Loading...</p>
						</div>
					)}

					{/* Tokens List */}
					{!loading && !error && (
						<div className="flex-1 overflow-y-auto">
							{!searchQuery.trim() && <h3 className="mb-4 font-medium text-white">Trending</h3>}
							{displayTokens.length === 0 ? (
								<div className="py-8 text-center text-gray-400">
									<p>No tokens found</p>
									{searchQuery && <p className="text-sm">Try a different search term</p>}
								</div>
							) : (
								<div className="space-y-2">
									{displayTokens.map((token) => (
										<Card
											key={token.id}
											className={`cursor-pointer rounded-lg p-4 transition-colors ${
												isTokenSelected(token.id)
													? 'border border-green-500 bg-green-900/20'
													: 'hover:bg-gray-700'
											} ${isTokenAlreadyAdded(token.id) ? 'opacity-50' : ''}`}
											onClick={() => !isTokenAlreadyAdded(token.id) && handleTokenSelect(token.id)}
										>
											<CardContent>
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-3">
														<img
															src={token.thumb}
															alt={token.name}
															className="h-8 w-8 rounded-full"
															onError={(e) => {
																const target = e.target as HTMLImageElement;
																target.style.display = 'none';
															}}
														/>
														<div>
															<div className="font-medium text-white">{token.name}</div>
															<div className="text-sm text-gray-400">
																{token.symbol.toUpperCase()}
															</div>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														{isTokenAlreadyAdded(token.id) && (
															<span className="text-sm text-gray-500">Already Added</span>
														)}
														{isTokenSelected(token.id) && !isTokenAlreadyAdded(token.id) && (
															<div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
																<div className="h-2 w-2 rounded-full bg-white"></div>
															</div>
														)}
														{!isTokenSelected(token.id) && !isTokenAlreadyAdded(token.id) && (
															<div className="h-4 w-4 rounded-full border border-gray-500"></div>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</div>
					)}

					{/* Footer */}
					<div className="flex items-center justify-between border-t border-gray-700 pt-4">
						<div className="text-sm text-gray-400">
							{selectedTokens.size > 0 && (
								<span>
									{selectedTokens.size} token{selectedTokens.size !== 1 ? 's' : ''} selected
								</span>
							)}
						</div>
						<div className="flex space-x-3">
							<button
								onClick={() => setOpen(false)}
								className="rounded-lg bg-gray-700 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-600"
							>
								Add to Watchlist
							</button>
							<button
								onClick={handleAddTokens}
								disabled={!hasSelectedTokens}
								className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
