const colors = require('tailwindcss/colors');
export default {
	content: ['./src/**/*.{svelte,js,ts}'],
	daisyui: {
		themes: [
			{
				emerald: {
					...require('daisyui/src/theming/themes')['[data-theme=emerald]'],
					'base-100': colors.white
				}
			}
		],
		logs: false
	},
	plugins: [require('daisyui')],
};
