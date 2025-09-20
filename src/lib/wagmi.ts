import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { mainnet, goerli, sepolia } from 'wagmi/chains';

const { connectors } = getDefaultWallets({
	appName: 'Token Portfolio',
	projectId: 'YOUR_PROJECT_ID', // You can get this from WalletConnect
});

export const config = createConfig({
	chains: [mainnet, goerli, sepolia],
	connectors,
	transports: {
		[mainnet.id]: http(),
		[goerli.id]: http(),
		[sepolia.id]: http(),
	},
});

export { mainnet, goerli, sepolia };
export const chains = [mainnet, goerli, sepolia];
