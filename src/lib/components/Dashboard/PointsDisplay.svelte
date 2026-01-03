<script lang="ts">
	import type { UserDTO } from '$lib/types';

	let { user }: { user: UserDTO } = $props();

	let progress = $derived((user.points / user.max_points) * 100);
</script>

<div class="card bg-linear-to-br from-blue-500 to-purple-500 text-white">
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-3">
			<div class="text-4xl">{user.emoji}</div>
			<div>
				<h3 class="text-lg font-semibold">{user.name}</h3>
				<p class="text-blue-100 text-sm">{user.email}</p>
			</div>
		</div>
	</div>

	<div class="space-y-2">
		<div class="flex items-baseline justify-between">
			<span class="text-5xl font-bold">{user.points}</span>
			<span class="text-2xl text-blue-100">/ {user.max_points}</span>
		</div>

		<div class="w-full bg-white/20 rounded-full h-3 overflow-hidden">
			<div
				class="bg-white h-full rounded-full transition-all duration-500"
				style="width: {progress}%"
			></div>
		</div>

		<div class="flex justify-between text-sm text-blue-100">
			<span>Total Earned: {user.total_earned}</span>
			<span>Total Lost: {user.total_lost}</span>
		</div>
	</div>
</div>
