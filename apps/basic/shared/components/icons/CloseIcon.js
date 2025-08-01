export function CloseIcon(props = {}) {
	const { className = "h-6 w-6" } = props;

	return /* HTML */ `
		<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			></path>
		</svg>
	`;
}
