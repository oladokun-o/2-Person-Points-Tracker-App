<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(() => {
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

{@render children()}
