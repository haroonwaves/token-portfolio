import axios from 'axios';

const CG = axios.create({
	baseURL: 'https://api.coingecko.com/api/v3',
	timeout: 10000,
});

export interface CoinGeckoCoin {
	id: string;
	name: string;
	symbol: string;
	image: string;
	current_price: number;
	price_change_percentage_24h: number;
	sparkline_in_7d: {
		price: number[];
	};
	market_cap: number;
	total_volume: number;
}

export interface SearchResult {
	id: string;
	name: string;
	symbol: string;
	thumb: string;
}

export interface SearchResponse {
	coins: SearchResult[];
}

export interface TrendingResponse {
	coins: Array<{
		item: {
			id: string;
			name: string;
			symbol: string;
			thumb: string;
		};
	}>;
}

export async function fetchTokens(q: string): Promise<SearchResult[]> {
	const res = await CG.get<SearchResponse>('/search', {
		params: { query: q },
	});
	return res.data.coins;
}

export async function fetchTrending(): Promise<SearchResult[]> {
	const res = await CG.get<TrendingResponse>('/search/trending');
	return res.data.coins.map((coin) => ({
		id: coin.item.id,
		name: coin.item.name,
		symbol: coin.item.symbol,
		thumb: coin.item.thumb,
	}));
}

export async function fetchPrices(
	ids: string[] = [],
	vs_currency = 'usd'
): Promise<CoinGeckoCoin[]> {
	if (ids.length === 0) return [];

	const idsParam = ids.join(',');
	const res = await CG.get<CoinGeckoCoin[]>('/coins/markets', {
		params: {
			vs_currency,
			ids: idsParam,
			sparkline: true,
			price_change_percentage: '24h',
		},
	});
	return res.data;
}

export async function fetchCoin(id: string) {
	const res = await CG.get(`/coins/${id}`, {
		params: {
			localization: false,
			tickers: false,
			market_data: true,
			community_data: false,
			developer_data: false,
			sparkline: true,
		},
	});
	return res.data;
}
