<!--<nav>-->
<!--	<a href="/">Home</a>-->
<!--	<a href="/database">Database</a>-->
<!--</nav>-->

<script>
	import {clickoutside} from '@svelte-put/clickoutside';
	import {slide} from 'svelte/transition';
	import {page} from '$app/stores';
	import '../app.css';
	import Menu from '$lib/menu/Menu.svelte';
	import {onMount} from 'svelte';
	import {themeChange} from 'theme-change';

	const breakpoints = { xs: 320, sm: 576, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
	const mainPages = {
		'/database': 'Database',
		'/spring-form': 'Spring Data Collection',
		'/tof-form': 'Time of Flight Data Collection'
	};
	const calculatorPages = {
		'/calculators': 'All',
		'/calculators/energy': 'Energy Converter',
		'/calculators/spring': 'Spring to Energy',
		'/calculators/ratio': 'Barrel Ratio'
	};
	$: currentPath = $page.url.pathname.replace(/\/$/, '');
	$: isCalcPage = currentPath.split('/')[1] === 'calculators';
	let sidebarOpen = false;
	let dropdownOpen;
	let innerWidth;

	$: dropdownOpen = isCalcPage;

	onMount(() => {
		themeChange(false);
	});
</script>

<svelte:window bind:innerWidth />
<div class="md:flex flex-col md:flex-row w-full">
	<div
		use:clickoutside
		on:clickoutside={() => (sidebarOpen = false)}
		class="flex-shrink-0 w-screen px-8 py-0 z-10 bg-white h-14 flex fixed items-center justify-between shadow-lg"
	>
		<a
			on:click={() => (sidebarOpen = false)}
			href="/"
			class="text-lg font-semibold tracking-widest py-2 pr-2 text-gray-900 uppercase focus:outline-none"
			>Airsoft Tools</a
		>
		<Menu class="md:hidden" menuOpen={sidebarOpen} on:click={() => (sidebarOpen = !sidebarOpen)} />
	</div>
	<div class="flex flex-col text-gray-700 z-10 bg-white flex-shrink-0 fixed top-14 shadow-xl">
		{#if sidebarOpen || innerWidth >= breakpoints.md}
			<nav
				transition:slide={{ delay: 10, duration: 150 }}
				class:shadow-lg={!sidebarOpen}
				class="flex-grow px-4 pb-4 w-screen md:w-64 md:min-h-screen md:pb-0 md:overflow-y-auto z-100 bg-gray-100"
			>
				<div class="relative">
					<button
						on:click|stopPropagation={() => (dropdownOpen = !dropdownOpen)}
						class="py-0.5 mt-1 parent w-full"
					>
						<span class:!bg-gray-200={isCalcPage} class="menuItem child transition-all">
							<span>Calculators</span>
							<svg
								fill="currentColor"
								viewBox="0 0 20 20"
								class:rotate-180={dropdownOpen}
								class:rotate-0={!dropdownOpen}
								class="inline w-4 h-4 mt-1 ml-1 transition-transform duration-150 transform md:-mt-1"
								><path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/></svg
							>
						</span>
					</button>
					{#if dropdownOpen}
						<div
							transition:slide={{ delay: 50, duration: 150 }}
							class="right-0 my-1 origin-top-right rounded-md shadow-lg"
						>
							<div class="px-2 py-2 bg-white rounded-md shadow">
								{#each Object.entries(calculatorPages) as [path, title]}
									<a class="py-0.5 block parent" on:click={() => (sidebarOpen = false)} href={path}
										><div
											class="subMenuItem child transition-all"
											class:!bg-gray-200={path === currentPath}
										>
											{title}
										</div>
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>
				{#each Object.entries(mainPages) as [path, title]}
					<a class="py-0.5 block parent" on:click={() => (sidebarOpen = false)} href={path}>
						<div class:!bg-gray-200={path === currentPath} class="menuItem child transition-all">
							{title}
						</div>
					</a>
				{/each}
			</nav>
		{/if}
	</div>
	<div
		class="md:ml-64 px-4 relative top-16 container mx-auto flex justify-center flex-wrap items-start"
	>
		<slot />
	</div>
</div>

<style>
	.parent:hover .child {
		@apply bg-gray-200;
		@apply text-gray-900;
		@apply rounded-lg;
	}
</style>
