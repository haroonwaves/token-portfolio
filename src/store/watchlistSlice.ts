import { createSlice } from '@reduxjs/toolkit';

export interface Token {
	id: string;
	symbol: string;
	name: string;
	image: string;
	holdings: number;
}

export interface TokenInput {
	id: string;
	symbol: string;
	name: string;
	image: string;
}

interface WatchlistState {
	tokens: Token[];
}

const WATCHLIST_KEY = 'token_portfolio_watchlist_v1';

const loadInitial = (): WatchlistState => {
	try {
		const raw = localStorage.getItem(WATCHLIST_KEY);
		if (!raw) return { tokens: [] };
		return JSON.parse(raw);
	} catch (e) {
		console.error('load watchlist failed', e);
		return { tokens: [] };
	}
};

const save = (state: WatchlistState) => {
	try {
		localStorage.setItem(WATCHLIST_KEY, JSON.stringify(state));
	} catch (e) {
		console.error('save watchlist failed', e);
	}
};

const slice = createSlice({
	name: 'watchlist',
	initialState: loadInitial(),
	reducers: {
		addTokens(state, action) {
			// action.payload = [{id, symbol, name, image}]
			const incoming: TokenInput[] = action.payload.filter(
				(t: TokenInput) => !state.tokens.find((s) => s.id === t.id)
			);
			state.tokens.push(...incoming.map((t) => ({ ...t, holdings: 0 })));
			save(state);
		},
		removeToken(state, action) {
			state.tokens = state.tokens.filter((t) => t.id !== action.payload);
			save(state);
		},
		setHoldings(state, action) {
			// payload: { id, holdings }
			const t = state.tokens.find((x) => x.id === action.payload.id);
			if (t) t.holdings = action.payload.holdings;
			save(state);
		},
		setWatchlist(state, action) {
			state.tokens = action.payload;
			save(state);
		},
	},
});

export const { addTokens, removeToken, setHoldings, setWatchlist } = slice.actions;
export default slice.reducer;
