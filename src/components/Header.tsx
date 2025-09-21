import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';

export function Header() {
	return (
		<header>
			<div className="px-2 py-3 md:px-8 md:py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<img src={'./logo.svg'} alt="Logo" className="h-7 w-7" />
						<h2 className="text-lg font-semibold text-white md:text-xl">Token Portfolio</h2>
					</div>
					<ConnectButton.Custom>
						{({
							account,
							chain,
							openAccountModal,
							openChainModal,
							openConnectModal,
							authenticationStatus,
							mounted,
						}) => {
							// Note: If your app doesn't use authentication, you
							// can remove all 'authenticationStatus' checks
							const ready = mounted && authenticationStatus !== 'loading';
							const connected =
								ready &&
								account &&
								chain &&
								(!authenticationStatus || authenticationStatus === 'authenticated');

							return (
								<div
									{...(!ready && {
										'aria-hidden': 'true',
										style: {
											opacity: 0,
											pointerEvents: 'none',
											userSelect: 'none',
										},
									})}
								>
									{(() => {
										if (!connected) {
											return (
												<Button className="custom-button!" onClick={openConnectModal} type="button">
													<img src={'./wallet.svg'} alt="Wallet" className="h-5 w-5" />
													Connect Wallet
												</Button>
											);
										}

										if (chain.unsupported) {
											return (
												<Button onClick={openChainModal} type="button" variant="destructive">
													Wrong network
												</Button>
											);
										}

										return (
											<div className="flex gap-2">
												<Button
													className="custom-button-2!"
													onClick={openChainModal}
													style={{ display: 'flex', alignItems: 'center', gap: 12 }}
													variant="outline"
												>
													{chain.name}
												</Button>

												<Button className="custom-button!" onClick={openAccountModal} type="button">
													{account.ensAvatar ? (
														<img src={account.ensAvatar} alt="Avatar" className="h-5 w-5" />
													) : null}
													{account.displayName}
												</Button>
											</div>
										);
									})()}
								</div>
							);
						}}
					</ConnectButton.Custom>
				</div>
			</div>
		</header>
	);
}
