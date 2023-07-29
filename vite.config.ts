import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import purgeCss from 'vite-plugin-svelte-purgecss';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import preprocessor from '@modular-css/svelte';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcssVite from '@modular-css/vite';

const { preprocess, processor } = preprocessor({
	include: /.mcss$/i
});
export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss({
			safelist: {
				// any selectors that begin with "data-theme" will not be purged
				greedy: [/data-theme$/]
			}
		}),
		mcssVite({
			processor
		})
	]
});
