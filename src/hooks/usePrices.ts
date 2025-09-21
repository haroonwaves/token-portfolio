import { useEffect, useState, useCallback } from 'react';
import { fetchPrices, type CoinGeckoCoin } from '@/api/coingecko';
import { toast } from 'sonner';

interface UsePricesResult {
	loading: boolean;
	error: string | null;
	prices: CoinGeckoCoin[];
	refresh: () => Promise<void>;
}

export function usePrices(ids: string[]): UsePricesResult {
	const [data, setData] = useState<UsePricesResult>({
		loading: true,
		error: null,
		prices: [],
		refresh: async () => {},
	});

	const fetch = useCallback(async () => {
		if (ids.length === 0) return setData((prev) => ({ ...prev, loading: false, prices: [] }));

		setData((prev) => ({ ...prev, loading: true, error: null }));

		try {
			const res = await fetchPrices(ids);
			setData((prev) => ({ ...prev, loading: false, error: null, prices: res, refresh: fetch }));
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : 'Failed to fetch prices';
			toast.error(`Error: ${errorMessage}. Please try after sometime.`);
			setData((prev) => ({
				...prev,
				loading: false,
				error: errorMessage,
			}));
		}
	}, [ids]);

	useEffect(() => {
		fetch();
	}, [fetch]);

	return data;
}
