import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { store } from './store';
import { config } from './lib/wagmi';
import './tailwind.config.css';
import './index.css';
import App from './App.tsx';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={config}>
					<RainbowKitProvider
						appInfo={{
							appName: 'Token Portfolio',
						}}
						showRecentTransactions={false}
						theme={darkTheme({
							accentColor: '#A9E851',
							accentColorForeground: '#18181B',
							borderRadius: 'medium',
							fontStack: 'system',
							overlayBlur: 'small',
						})}
					>
						<App />
					</RainbowKitProvider>
				</WagmiProvider>
			</QueryClientProvider>
		</Provider>
	</StrictMode>
);
