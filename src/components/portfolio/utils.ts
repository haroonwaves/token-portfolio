export const tokenColor = (id: string): string => {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
	return `hsl(${h} 60% 60%)`; // For dark screens, use higher lightness and lower saturation for better contrast
};
