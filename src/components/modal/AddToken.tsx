import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { type SearchResult, fetchTokens, fetchTrending } from '@/api/coingecko';

import type { TokenInput } from '@/store/watchlistSlice';

interface AddTokenProps {
	onAddTokens: (tokens: TokenInput[]) => void;
	existingTokens: string[];
}

export function AddToken({ onAddTokens, existingTokens }: AddTokenProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [trendingTokens, setTrendingTokens] = useState<SearchResult[]>([]);
	const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(false);

	const debouncedSearch = useDebounce<string>(searchTerm, 300);

	const loadTrending = async () => {
		try {
			setLoading(true);
			const trending = await fetchTrending();
			setTrendingTokens(trending);
		} catch {
			toast.error('Failed to load trending tokens');
		} finally {
			setLoading(false);
		}
	};

	const searchForTokens = async (query: string) => {
		try {
			setLoading(true);
			const results = await fetchTokens(query);
			setSearchResults(results);
		} catch {
			toast.error('Failed to search tokens');
		} finally {
			setLoading(false);
		}
	};

	const handleTokenSelect = (tokenId: string) => {
		setSelectedTokens((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(tokenId)) newSet.delete(tokenId);
			else newSet.add(tokenId);
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
			setSearchTerm('');
			setSearchResults([]);
			setOpen(false);
		}
	};

	const isTokenSelected = (tokenId: string) => selectedTokens.has(tokenId);
	const isTokenAlreadyAdded = (tokenId: string) => existingTokens.includes(tokenId);

	const displayTokens = debouncedSearch.trim() ? searchResults : trendingTokens;
	const hasSelectedTokens = selectedTokens.size > 0;

	useEffect(() => {
		if (open) loadTrending();
		else setSearchTerm('');
	}, [open]);

	useEffect(() => {
		if (!debouncedSearch.trim()) return setSearchResults([]);
		searchForTokens(debouncedSearch);
	}, [debouncedSearch]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="custom-button!">
					<Plus className="h-4 w-4" />
					Add Token
				</Button>
			</DialogTrigger>
			<DialogContent className="dark-2! p-0" showCloseButton={false}>
				<DialogTitle className="sr-only">Add Token</DialogTitle>
				<div className="flex h-full flex-col">
					{/* Search Input */}
					<div className="mb-4 border-b px-3 py-2">
						<Input
							placeholder="Search tokens (e.g., ETH, SOL)..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="border-none bg-transparent! placeholder-[#71717A]! outline-none focus-visible:ring-0"
						/>
					</div>

					{/* Tokens List */}
					<Loader isLoading={loading}>
						<div className="flex-1">
							{!debouncedSearch.trim() && (
								<p className="px-3 py-1 text-sm text-[#71717A]">Trending</p>
							)}
							{!loading && displayTokens.length === 0 ? (
								<div className="flex h-[400px] flex-col items-center justify-center px-3 py-8 text-center text-[#A1A1AA]/60">
									<p className="text-lg font-medium">No tokens found</p>
									{debouncedSearch && <p className="text-sm">Try a different search term</p>}
								</div>
							) : (
								<ScrollArea className="h-[400px] px-3 py-2">
									<div className="space-y-1">
										{displayTokens.map((token) => (
											<div
												key={token.id}
												className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
													isTokenSelected(token.id) ? 'bg-[#A9E8510F]/60' : 'hover:dark'
												} ${isTokenAlreadyAdded(token.id) ? 'opacity-50' : ''}`}
												onClick={() =>
													!isTokenAlreadyAdded(token.id) && handleTokenSelect(token.id)
												}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														if (!isTokenAlreadyAdded(token.id)) handleTokenSelect(token.id);
													}
												}}
												role="button"
												tabIndex={0}
											>
												<div className="flex items-center space-x-3">
													<img
														src={token.thumb}
														alt={token.name}
														className="h-8 w-8 rounded-md"
														onError={(e) => {
															const target = e.target as HTMLImageElement;
															target.style.display = 'none';
														}}
													/>
													<div>
														<div className="text-sm font-normal text-[#F4F4F5]">
															{token.name} ({token.symbol.toUpperCase()})
														</div>
													</div>
												</div>
												<div className="flex items-center space-x-4">
													{(isTokenSelected(token.id) || isTokenAlreadyAdded(token.id)) && (
														<Star className="h-4 w-4" fill="#A9E851" stroke="none" />
													)}
													<RadioGroup onValueChange={(value) => handleTokenSelect(value)}>
														<RadioGroupItem
															className="custom-radio!"
															value={token.id}
															checked={isTokenSelected(token.id) || isTokenAlreadyAdded(token.id)}
														/>
													</RadioGroup>
												</div>
											</div>
										))}
									</div>
								</ScrollArea>
							)}
						</div>
					</Loader>

					{/* Footer */}
					<div className="flex items-center justify-end space-x-3 border-t border-gray-700 px-3 py-4">
						<Button
							className="custom-button!"
							onClick={handleAddTokens}
							disabled={!hasSelectedTokens}
						>
							Add to Watchlist
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
