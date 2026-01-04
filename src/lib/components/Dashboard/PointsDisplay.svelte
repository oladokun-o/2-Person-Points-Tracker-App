<script lang="ts">
	import type { UserDTO } from '$lib/types';

	let { user }: { user: UserDTO } = $props();

	let progress = $derived((user.points / user.max_points) * 100);
	let isNearGoal = $derived(progress >= 80);
	let isFull = $derived(progress >= 100);
</script>

<div class="card bg-linear-to-br from-blue-500 to-purple-500 text-white hover:shadow-xl transition-shadow duration-300 group">
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-3">
			{#if user.avatar_url}
				<div class="relative">
					<img
						src={user.avatar_url}
						alt={user.name}
						class="w-16 h-16 rounded-full border-3 border-white/30 group-hover:border-white/60 transition-colors"
					/>
					<div class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl border-2 border-blue-500">
						{user.emoji}
					</div>
				</div>
			{:else}
				<div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl border-3 border-white/30 group-hover:border-white/60 group-hover:scale-110 transition-all">
					{user.emoji}
				</div>
			{/if}
			<div>
				<h3 class="text-xl font-semibold">{user.name}</h3>
				<p class="text-blue-100 text-sm opacity-80">{user.email}</p>
			</div>
		</div>
	</div>

	<div class="space-y-3">
		<div class="flex items-baseline justify-between">
			<span class="text-6xl font-bold group-hover:scale-105 transition-transform inline-block">{user.points}</span>
			<span class="text-2xl text-blue-100 opacity-80">/ {user.max_points}</span>
		</div>

		<!-- Progress Bar -->
		<div class="relative">
			<div class="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
				<div
					class="h-full rounded-full transition-all duration-700 ease-out {isFull
						? 'bg-yellow-300 animate-pulse'
						: isNearGoal
						? 'bg-green-300'
						: 'bg-white'}"
					style="width: {progress}%"
				></div>
			</div>
			{#if isFull}
				<span class="absolute -top-6 right-0 text-yellow-300 text-2xl animate-bounce">🎉</span>
			{/if}
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-3 pt-2">
			<div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
				<div class="text-xs text-blue-100 opacity-80 mb-1">Total Earned</div>
				<div class="text-2xl font-bold text-green-300">+{user.total_earned}</div>
			</div>
			<div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
				<div class="text-xs text-blue-100 opacity-80 mb-1">Total Lost</div>
				<div class="text-2xl font-bold text-red-300">-{user.total_lost}</div>
			</div>
		</div>
	</div>
</div>
