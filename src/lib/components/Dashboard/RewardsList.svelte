<script lang="ts">
	import type { RewardWithStatus } from '$lib/types';

	let { rewards }: { rewards: RewardWithStatus[] } = $props();
</script>

<div class="card">
	<h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Rewards</h2>

	{#if rewards.length === 0}
		<p class="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No rewards yet. Add some to start tracking!</p>
	{:else}
		<div class="space-y-2 sm:space-y-3">
			{#each rewards as reward}
				<div
					class="p-3 sm:p-4 rounded-lg border-2 transition-all {reward.is_unlocked
						? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
						: 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
							<div class="text-2xl sm:text-3xl shrink-0">{reward.emoji}</div>
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{reward.title}</h3>
								{#if reward.description}
									<p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{reward.description}</p>
								{/if}
								<div class="flex items-center gap-2 mt-2 flex-wrap">
									<span class="text-xs font-medium text-blue-600 dark:text-blue-400">
										{reward.required_points} points
									</span>
									{#if !reward.is_unlocked}
										<span class="text-xs text-gray-500 dark:text-gray-400">
											({reward.points_needed} more)
										</span>
									{/if}
								</div>
							</div>
						</div>
						<div class="shrink-0">
							{#if reward.is_unlocked}
								<div
									class="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 dark:bg-green-600 text-white rounded-full text-xs sm:text-sm font-medium"
								>
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="hidden sm:inline">Unlocked</span>
									<span class="sm:hidden">✓</span>
								</div>
							{:else}
								<div class="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-medium">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="hidden sm:inline">Locked</span>
									<span class="sm:hidden">🔒</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
