import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { type Token } from '@/store/watchlistSlice';
import { type CoinGeckoCoin } from '@/api/coingecko';

interface PortfolioProps {
	tokens: Token[];
	prices: CoinGeckoCoin[];
	lastUpdated?: Date;
	onRefresh?: () => void;
}

// Utility function to generate deterministic colors for tokens
const tokenColor = (id: string): string => {
	let h = 0;
	for (let i = 0; i < id.length; i++) {
		h = (h * 31 + id.charCodeAt(i)) % 360;
	}
	return `hsl(${h} 70% 45%)`;
};

const chartConfig: ChartConfig = {
	value: {
		label: 'Value',
		color: 'hsl(var(--chart-1))',
	},
};

export function Portfolio({ tokens, prices, lastUpdated, onRefresh }: PortfolioProps) {
	const portfolioData = useMemo(() => {
		const totalValue = tokens.reduce((sum, token) => {
			const price = prices.find((p) => p.id === token.id);
			return sum + (price?.current_price || 0) * token.holdings;
		}, 0);

		const chartData = tokens
			.map((token) => {
				const price = prices.find((p) => p.id === token.id);
				const value = (price?.current_price || 0) * token.holdings;
				return {
					name: token.symbol.toUpperCase(),
					value,
					color: tokenColor(token.id),
					percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
				};
			})
			.filter((item) => item.value > 0)
			.sort((a, b) => b.value - a.value);

		return { totalValue, chartData };
	}, [tokens, prices]);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).format(date);
	};

	return (
		<Card className="dark-2! w-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-2xl font-bold">Portfolio</CardTitle>
				{onRefresh && (
					<button
						onClick={onRefresh}
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
					>
						Refresh
					</button>
				)}
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-3xl font-bold">{formatCurrency(portfolioData.totalValue)}</div>

				{lastUpdated && (
					<p className="text-muted-foreground text-sm">Last updated: {formatTime(lastUpdated)}</p>
				)}

				{portfolioData.chartData.length > 0 ? (
					<div className="h-[300px]">
						<ChartContainer config={chartConfig}>
							<PieChart>
								<Pie
									data={portfolioData.chartData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									innerRadius={60}
									strokeWidth={0}
								>
									{portfolioData.chartData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<ChartTooltip content={<ChartTooltipContent />} />
							</PieChart>
						</ChartContainer>
					</div>
				) : (
					<div className="text-muted-foreground flex h-[300px] items-center justify-center">
						<div className="text-center">
							<p className="text-lg font-medium">No tokens in portfolio</p>
							<p className="text-sm">Add tokens to see your portfolio breakdown</p>
						</div>
					</div>
				)}

				{portfolioData.chartData.length > 0 && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium">Holdings</h4>
						<div className="space-y-1">
							{portfolioData.chartData.map((item, index) => (
								<div key={index} className="flex items-center justify-between text-sm">
									<div className="flex items-center space-x-2">
										<div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
										<span className="font-medium">{item.name}</span>
									</div>
									<div className="text-right">
										<div className="font-medium">{formatCurrency(item.value)}</div>
										<div className="text-muted-foreground">{item.percentage.toFixed(1)}%</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
