<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores/theme';
	import Toast from '$lib/components/Shared/Toast.svelte';

	let { children } = $props();

	// Initialize theme immediately on mount
	$effect(() => {
		if (browser) {
			const currentTheme = $theme;
			// Tailwind only needs 'dark' class, remove it for light mode
			if (currentTheme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});

	onMount(() => {
		// Register service worker
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					console.log('Service Worker registered successfully:', registration.scope);
				})
				.catch((error) => {
					console.log('Service Worker registration failed:', error);
				});
		}
	});
</script>

<Toast />
{@render children()}
