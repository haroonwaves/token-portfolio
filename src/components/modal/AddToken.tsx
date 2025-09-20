import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { type SearchResult, fetchTokens, fetchTrending } from '@/api/coingecko';
import { Search, Plus } from 'lucide-react';

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
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Token
				</Button>
			</DialogTrigger>
			<DialogContent className="flex max-h-[80vh] max-w-2xl flex-col overflow-hidden">
				<DialogHeader>
					<DialogTitle>Add Tokens to Watchlist</DialogTitle>
				</DialogHeader>

				<div className="flex flex-1 flex-col space-y-4 overflow-hidden">
					{/* Search Input */}
					<div className="relative">
						<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
						<Input
							placeholder="Search for tokens..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Error State */}
					{error && (
						<div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">{error}</div>
					)}

					{/* Loading State */}
					{loading && (
						<div className="text-muted-foreground py-8 text-center">
							<div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
							<p className="mt-2">Loading...</p>
						</div>
					)}

					{/* Tokens List */}
					{!loading && !error && (
						<div className="flex-1 overflow-y-auto">
							{displayTokens.length === 0 ? (
								<div className="text-muted-foreground py-8 text-center">
									<p>No tokens found</p>
									{searchQuery && <p className="text-sm">Try a different search term</p>}
								</div>
							) : (
								<div className="space-y-2">
									{displayTokens.map((token) => (
										<Card
											key={token.id}
											className={`cursor-pointer transition-colors ${
												isTokenSelected(token.id)
													? 'ring-primary bg-primary/5 ring-2'
													: 'hover:bg-muted/50'
											} ${isTokenAlreadyAdded(token.id) ? 'opacity-50' : ''}`}
											onClick={() => !isTokenAlreadyAdded(token.id) && handleTokenSelect(token.id)}
										>
											<CardContent className="p-4">
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
															<div className="font-medium">{token.name}</div>
															<div className="text-muted-foreground text-sm">
																{token.symbol.toUpperCase()}
															</div>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														{isTokenAlreadyAdded(token.id) && (
															<Badge variant="secondary">Already Added</Badge>
														)}
														{isTokenSelected(token.id) && !isTokenAlreadyAdded(token.id) && (
															<Badge variant="default">Selected</Badge>
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
					<div className="flex items-center justify-between border-t pt-4">
						<div className="text-muted-foreground text-sm">
							{selectedTokens.size > 0 && (
								<span>
									{selectedTokens.size} token{selectedTokens.size !== 1 ? 's' : ''} selected
								</span>
							)}
						</div>
						<div className="flex space-x-2">
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleAddTokens} disabled={!hasSelectedTokens}>
								Add to Watchlist
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
