import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart } from 'recharts';

interface SparklineProps {
	data: number[];
	color?: string;
}

export function Sparkline({ data, color = 'hsl(var(--chart-1))' }: SparklineProps) {
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
