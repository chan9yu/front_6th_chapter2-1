export function InfoIcon(props = {}) {
	const { className = "h-5 w-5" } = props;

	return /* HTML */ `
		<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
	`;
}
