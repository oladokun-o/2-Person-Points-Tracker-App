<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	export let open = false;
	export let title = '';
	export let onClose: () => void = () => {};

	function handleClose() {
		open = false;
		onClose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
		transition:fade={{ duration: 200 }}
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="card max-w-lg w-full max-h-[90vh] overflow-y-auto"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-2xl font-bold text-gray-900">{title}</h2>
				<button
					on:click={handleClose}
					class="text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Close"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<slot />
		</div>
	</div>
{/if}
