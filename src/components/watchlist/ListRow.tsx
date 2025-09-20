import { TableRow } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { Sparkline } from '@/components/watchlist/Sparkline';
import { useState, useCallback } from 'react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { removeToken } from '@/store/watchlistSlice';
import { setHoldings } from '@/store/watchlistSlice';
import { useDispatch } from 'react-redux';

import type { Token } from '@/store/watchlistSlice';

export interface Row extends Token {
	currentPrice: number;
	change24h: number;
	sparklineData: number[];
	isPositive: boolean;
	value: number;
}

export function ListRow({ tokens, row }: { tokens: Token[]; row: Row }) {
	const dispatch = useDispatch();
	const [editingHoldings, setEditingHoldings] = useState<{ [key: string]: string }>({});
	const [editingTokenId, setEditingTokenId] = useState<string | null>(null);

	const handleHoldingsChange = useCallback((id: string, value: string) => {
		setEditingHoldings((prev) => ({ ...prev, [id]: value }));
	}, []);

	const handleEditHoldings = useCallback(
		(id: string) => {
			setEditingTokenId(id);
			setEditingHoldings((prev) => ({
				...prev,
				[id]: tokens.find((t) => t.id === id)?.holdings.toString() || '0',
			}));
		},
		[tokens]
	);

	const handleSaveHoldings = useCallback(
		(id: string) => {
			const value = editingHoldings[id];
			if (value !== undefined) {
				const numericValue = parseFloat(value) || 0;
				dispatch(setHoldings({ id, holdings: numericValue }));
				setEditingHoldings((prev) => {
					const newState = { ...prev };
					delete newState[id];
					return newState;
				});
				setEditingTokenId(null);
			}
		},
		[editingHoldings, dispatch]
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

	return (
		<TableRow key={row.id}>
			<TableCell>
				<div className="flex items-center space-x-3">
					<img
						src={row.image}
						alt={row.name}
						className="h-8 w-8 rounded-full"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.style.display = 'none';
						}}
					/>
					<div>
						<div className="font-medium text-white">{row.name}</div>
						<div className="text-sm text-gray-400">{row.symbol.toUpperCase()}</div>
					</div>
				</div>
			</TableCell>
			<TableCell className="font-mono text-white">{formatPrice(row.currentPrice)}</TableCell>
			<TableCell>
				<span
					className={`rounded px-2 py-1 text-sm font-medium ${
						row.isPositive ? 'text-green-400' : 'text-red-400'
					}`}
				>
					{formatPercentage(row.change24h)}
				</span>
			</TableCell>
			<TableCell className="hidden text-center sm:table-cell">
				<Sparkline data={row.sparklineData} color={row.isPositive ? '#10b981' : '#ef4444'} />
			</TableCell>
			<TableCell>
				{editingTokenId === row.id ? (
					<div className="flex items-center space-x-2">
						<input
							type="number"
							value={editingHoldings[row.id] ?? row.holdings}
							onChange={(e) => handleHoldingsChange(row.id, e.target.value)}
							className="w-24 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
							min="0"
							step="0.000001"
						/>
						<button
							onClick={() => handleSaveHoldings(row.id)}
							className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
						>
							Save
						</button>
					</div>
				) : (
					<span className="text-white">{row.holdings}</span>
				)}
			</TableCell>
			<TableCell className="font-mono text-white">{formatCurrency(row.value)}</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="h-8 w-8 p-0 text-gray-400 transition-colors hover:text-white">
							<MoreHorizontal className="h-4 w-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem onClick={() => handleEditHoldings(row.id)} className="cursor-pointer">
							<Edit className="mr-2 h-4 w-4" />
							Edit Holdings
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => dispatch(removeToken(row.id))}
							className="cursor-pointer text-red-400 focus:text-red-400"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Remove
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
