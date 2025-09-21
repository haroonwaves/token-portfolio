import { TableRow } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { Sparkline } from '@/components/watchlist/Sparkline';
import { useState, useCallback, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

	const inputRef = useRef<HTMLInputElement>(null);

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
			setTimeout(() => inputRef.current?.focus(), 250);
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

	const formatPercentage = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

	const cellClass = 'font-normal text-sm';

	return (
		<TableRow key={row.id} className="hover:dark-2! border-none">
			<TableCell>
				<div className="mr-2 flex w-full items-center space-x-3 px-4 py-1">
					<img
						src={row.image}
						alt={row.name}
						className="h-8 w-8 rounded-md"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.style.display = 'none';
						}}
					/>

					<div className={cellClass}>
						{row.name} <span className={`text-[#A1A1AA]`}>({row.symbol.toUpperCase()})</span>
					</div>
				</div>
			</TableCell>
			<TableCell className={`${cellClass} text-[#A1A1AA]`}>
				{formatPrice(row.currentPrice)}
			</TableCell>
			<TableCell>
				<span className={`${cellClass} ${row.isPositive ? 'text-green-400' : 'text-red-400'}`}>
					{formatPercentage(row.change24h)}
				</span>
			</TableCell>
			<TableCell className="text-center">
				<Sparkline data={row.sparklineData} color={row.isPositive ? '#05df72' : '#ff6467'} />
			</TableCell>
			<TableCell>
				{editingTokenId === row.id ? (
					<div className="flex items-center space-x-2">
						<Input
							ref={inputRef}
							className="w-24 focus-visible:border-[#A9E851] focus-visible:ring-[#A9E851]/30"
							type="number"
							value={editingHoldings[row.id] ?? row.holdings}
							onChange={(e) => handleHoldingsChange(row.id, e.target.value)}
							onBlur={() => handleSaveHoldings(row.id)}
							min="0"
							step="0.0001"
						/>
						<Button className="custom-button!" onClick={() => handleSaveHoldings(row.id)}>
							Save
						</Button>
					</div>
				) : (
					<span
						role="button"
						tabIndex={0}
						className={`${cellClass} text-[#F4F4F5]`}
						onDoubleClick={() => handleEditHoldings(row.id)}
						onKeyDown={() => {}}
					>
						{row.holdings}
					</span>
				)}
			</TableCell>
			<TableCell className={`${cellClass}`}>{formatCurrency(row.value)}</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="custom-button-2!">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
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
