import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
	return (
		<header>
			<div className="px-8 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="flex h-8 w-8 items-center justify-center rounded bg-green-500">
							<span className="text-sm font-bold text-white">T</span>
						</div>
						<h1 className="text-2xl font-bold text-white">Token Portfolio</h1>
					</div>
					<ConnectButton />
				</div>
			</div>
		</header>
	);
}
