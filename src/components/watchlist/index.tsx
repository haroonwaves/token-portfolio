import { useMemo, useState, useCallback } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart } from 'recharts';
import { type Token } from '@/store/watchlistSlice';
import { type CoinGeckoCoin } from '@/api/coingecko';
import { Trash2 } from 'lucide-react';

interface WatchlistProps {
	tokens: Token[];
	prices: CoinGeckoCoin[];
	onUpdateHoldings: (id: string, holdings: number) => void;
	onRemoveToken: (id: string) => void;
}

interface SparklineProps {
	data: number[];
	color?: string;
}

function Sparkline({ data, color = 'hsl(var(--chart-1))' }: SparklineProps) {
	if (!data || data.length === 0) {
		return <div className="text-muted-foreground h-8 w-20 text-xs">No data</div>;
	}

	const chartData = data.map((value, index) => ({
		index,
		value,
	}));

	return (
		<div className="h-8 w-20">
			<ChartContainer
				config={{
					value: {
						label: 'Price',
						color,
					},
				}}
			>
				<LineChart data={chartData}>
					<Line
						type="monotone"
						dataKey="value"
						stroke={color}
						strokeWidth={1.5}
						dot={false}
						activeDot={false}
					/>
					<ChartTooltip content={<ChartTooltipContent />} />
				</LineChart>
			</ChartContainer>
		</div>
	);
}

export function Watchlist({ tokens, prices, onUpdateHoldings, onRemoveToken }: WatchlistProps) {
	const [editingHoldings, setEditingHoldings] = useState<{ [key: string]: string }>({});

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

	const handleHoldingsChange = useCallback((id: string, value: string) => {
		setEditingHoldings((prev) => ({ ...prev, [id]: value }));
	}, []);

	const handleHoldingsBlur = useCallback(
		(id: string) => {
			const value = editingHoldings[id];
			if (value !== undefined) {
				const numericValue = parseFloat(value) || 0;
				onUpdateHoldings(id, numericValue);
				setEditingHoldings((prev) => {
					const newState = { ...prev };
					delete newState[id];
					return newState;
				});
			}
		},
		[editingHoldings, onUpdateHoldings]
	);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

	const formatPrice = (value: number) => {
		if (value < 0.01) return `$${value.toFixed(6)}`;
		return formatCurrency(value);
	};

	const formatPercentage = (value: number) => {
		return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
	};

	if (tokens.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Watchlist</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-muted-foreground py-8 text-center">
						<p className="text-lg font-medium">No tokens in watchlist</p>
						<p className="text-sm">Add tokens to start tracking your portfolio</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Watchlist</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Token</TableHead>
								<TableHead className="text-right">Price</TableHead>
								<TableHead className="text-right">24h</TableHead>
								<TableHead className="text-center">7d Chart</TableHead>
								<TableHead className="text-right">Holdings</TableHead>
								<TableHead className="text-right">Value</TableHead>
								<TableHead className="w-12"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableData.map((token) => (
								<TableRow key={token.id}>
									<TableCell>
										<div className="flex items-center space-x-3">
											<img
												src={token.image}
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
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatPrice(token.currentPrice)}
									</TableCell>
									<TableCell className="text-right">
										<Badge variant={token.isPositive ? 'default' : 'destructive'}>
											{formatPercentage(token.change24h)}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Sparkline
											data={token.sparklineData}
											color={token.isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'}
										/>
									</TableCell>
									<TableCell className="text-right">
										<Input
											type="number"
											value={editingHoldings[token.id] ?? token.holdings}
											onChange={(e) => handleHoldingsChange(token.id, e.target.value)}
											onBlur={() => handleHoldingsBlur(token.id)}
											className="w-24 text-right"
											min="0"
											step="0.000001"
										/>
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatCurrency(token.value)}
									</TableCell>
									<TableCell>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onRemoveToken(token.id)}
											className="h-8 w-8 p-0"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
