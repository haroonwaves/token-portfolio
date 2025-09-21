import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple custom radio group
function CustomRadioGroup({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return (
		<RadioGroupPrimitive.Root
			data-slot="custom-radio-group"
			className={cn('grid gap-3', className)}
			{...props}
		/>
	);
}

// Simple custom radio item with green checkmark
function CustomRadioItem({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
	return (
		<RadioGroupPrimitive.Item
			data-slot="custom-radio-item"
			className={cn('custom-radio', className)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="custom-radio-indicator">
				<CheckIcon className="custom-radio-check" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}

export { CustomRadioGroup, CustomRadioItem };
