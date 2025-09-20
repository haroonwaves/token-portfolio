import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
	handleRefresh: () => void;
	loading: boolean;
}

export function Header({ handleRefresh, loading }: Readonly<HeaderProps>) {
	return (
		<header>
			<div className="container mx-auto px-2 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">Token Portfolio</h1>
						<p className="text-muted-foreground">Track your cryptocurrency investments</p>
					</div>
					<div className="flex items-center space-x-4">
						<Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
							<RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
							Refresh Prices
						</Button>
						<ConnectButton />
					</div>
				</div>
			</div>
		</header>
	);
}
