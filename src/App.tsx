import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePrices } from './hooks/usePrices';
import { Header } from './components/Header';
import { Content } from './components/Content';

import type { RootState } from './store';

function App() {
	const { tokens } = useSelector((state: RootState) => state.watchlist);

	const tokenIds = useMemo(() => tokens.map((token: { id: string }) => token.id), [tokens]);

	const { prices, loading, refresh } = usePrices(tokenIds);

	return (
		<div className="dark min-h-screen">
			<Header handleRefresh={refresh} loading={loading} />
			<Content handleRefresh={refresh} prices={prices} />
		</div>
	);
}

export default App;
