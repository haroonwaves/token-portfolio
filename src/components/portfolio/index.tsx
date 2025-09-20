import { useMemo } from 'react';
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

export function Portfolio({ tokens, prices, lastUpdated }: PortfolioProps) {
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
		<div className="w-full">
			{portfolioData.chartData.length > 0 ? (
				<div className="flex flex-col lg:flex-row lg:gap-12">
					{/* Portfolio Total - Left on desktop, top on mobile */}
					<div className="mb-8 flex flex-col justify-between lg:mb-0 lg:w-1/2">
						<div>
							<h2 className="mb-4 text-xl font-bold text-white">Portfolio Total</h2>
							<div className="mb-4 text-2xl font-bold text-white lg:text-5xl">
								{formatCurrency(portfolioData.totalValue)}
							</div>
						</div>
						{lastUpdated && (
							<p className="text-sm text-gray-400">Last updated: {formatTime(lastUpdated)}</p>
						)}
					</div>

					{/* Chart and Legend - Right on desktop, bottom on mobile */}
					<div className="lg:flex-1">
						<h2 className="mb-6 text-xl font-bold text-white">Portfolio Total</h2>

						<div className="flex flex-col items-center space-y-8 lg:flex-row lg:items-start lg:space-y-0 lg:space-x-8">
							{/* Donut Chart */}
							<div className="flex-shrink-0">
								<ChartContainer config={chartConfig} className="h-80 w-80 lg:h-64 lg:w-64">
									<PieChart>
										<Pie
											data={portfolioData.chartData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={100}
											innerRadius={50}
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

							{/* Legend */}
							<div className="flex-1 space-y-4">
								{portfolioData.chartData.map((item, index) => (
									<div key={index} className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div
												className="h-4 w-4 rounded-full"
												style={{ backgroundColor: item.color }}
											/>
											<span className="text-base font-medium text-white">{item.name}</span>
										</div>
										<div className="text-right">
											<div className="text-base font-medium text-white">
												{item.percentage.toFixed(1)}%
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex h-64 items-center justify-center text-gray-400">
					<div className="text-center">
						<p className="text-lg font-medium">No tokens in portfolio</p>
						<p className="text-sm">Add tokens to see your portfolio breakdown</p>
					</div>
				</div>
			)}
		</div>
	);
}
