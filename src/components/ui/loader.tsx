import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
	isLoading: boolean;
	children: React.ReactNode;
	className?: string;
	loaderClassName?: string;
}

function Loader({ isLoading, children, className, loaderClassName }: LoaderProps) {
	return (
		<div className={cn('relative', className)}>
			{<div className={cn(isLoading && 'opacity-50')}>{children}</div>}
			{isLoading && (
				<div className="absolute inset-0 z-50 flex items-center justify-center">
					<div
						className={cn(
							'border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent',
							loaderClassName
						)}
					/>
				</div>
			)}
		</div>
	);
}

export { Loader };
