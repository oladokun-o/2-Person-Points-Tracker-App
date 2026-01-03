<script lang="ts">
	import { page } from '$app/stores';

	let { showLogo = true }: { showLogo?: boolean } = $props();

	let currentPath = $derived($page.url.pathname);

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
		{ href: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
	];
</script>

<header class="bg-white shadow-sm border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-6">
				{#if showLogo}
					<div class="flex items-center gap-3">
						<img src="/icon.svg" alt="Points Tracker Logo" class="w-10 h-10" />
						<h1 class="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
							Points Tracker
						</h1>
					</div>
				{/if}

				<nav class="hidden md:flex items-center gap-1">
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors {currentPath === item.href
								? 'bg-blue-50 text-blue-600'
								: 'text-gray-600 hover:bg-gray-100'}"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
							</svg>
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>
			</div>

			<button
				onclick={async () => {
					await fetch('/auth/signout', { method: 'POST' });
					window.location.href = '/auth/login';
				}}
				class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
			>
				Sign Out
			</button>
		</div>

		<!-- Mobile Navigation -->
		<nav class="md:hidden flex items-center gap-1 mt-4 overflow-x-auto">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap {currentPath === item.href
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-600 hover:bg-gray-100'}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
					</svg>
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	</div>
</header>
