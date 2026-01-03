<script lang="ts">
	import type { RewardWithStatus } from '$lib/types';

	let { rewards }: { rewards: RewardWithStatus[] } = $props();
</script>

<div class="card">
	<h2 class="text-2xl font-bold text-gray-900 mb-4">Rewards</h2>

	{#if rewards.length === 0}
		<p class="text-gray-500 text-center py-8">No rewards yet. Add some to start tracking!</p>
	{:else}
		<div class="space-y-3">
			{#each rewards as reward}
				<div
					class="p-4 rounded-lg border-2 transition-all {reward.is_unlocked
						? 'border-green-500 bg-green-50'
						: 'border-gray-200 bg-gray-50'}"
				>
					<div class="flex items-start justify-between">
						<div class="flex items-start gap-3 flex-1">
							<div class="text-3xl">{reward.emoji}</div>
							<div class="flex-1">
								<h3 class="font-semibold text-gray-900">{reward.title}</h3>
								{#if reward.description}
									<p class="text-sm text-gray-600 mt-1">{reward.description}</p>
								{/if}
								<div class="flex items-center gap-2 mt-2">
									<span class="text-xs font-medium text-blue-600">
										{reward.required_points} points
									</span>
									{#if !reward.is_unlocked}
										<span class="text-xs text-gray-500">
											({reward.points_needed} more needed)
										</span>
									{/if}
								</div>
							</div>
						</div>
						<div>
							{#if reward.is_unlocked}
								<div
									class="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
									Unlocked
								</div>
							{:else}
								<div class="flex items-center gap-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-sm font-medium">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											clip-rule="evenodd"
										/>
									</svg>
									Locked
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
