<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { fly, fade } from 'svelte/transition';

	const iconPaths = {
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
	};

	const colors = {
		success: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-800',
			icon: 'text-green-600'
		},
		error: {
			bg: 'bg-red-50',
			border: 'border-red-200',
			text: 'text-red-800',
			icon: 'text-red-600'
		},
		warning: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-200',
			text: 'text-yellow-800',
			icon: 'text-yellow-600'
		},
		info: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-blue-800',
			icon: 'text-blue-600'
		}
	};
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
	{#each $toasts as toast (toast.id)}
		<div
			transition:fly={{ x: 300, duration: 300 }}
			class="pointer-events-auto flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg {colors[toast.type].bg} {colors[toast.type].border}"
		>
			<svg
				class="w-6 h-6 flex-shrink-0 {colors[toast.type].icon}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={iconPaths[toast.type]}
				/>
			</svg>
			<p class="flex-1 text-sm font-medium {colors[toast.type].text}">
				{toast.message}
			</p>
			<button
				onclick={() => toasts.remove(toast.id)}
				class="flex-shrink-0 {colors[toast.type].text} opacity-50 hover:opacity-100 transition-opacity"
			>
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	{/each}
</div>
