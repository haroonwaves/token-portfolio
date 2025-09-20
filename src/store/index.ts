import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import watchlistReducer from './watchlistSlice';

const rootReducer = combineReducers({
	watchlist: watchlistReducer,
});

export const store = configureStore({
	reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
