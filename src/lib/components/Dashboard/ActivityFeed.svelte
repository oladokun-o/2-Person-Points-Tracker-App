<script lang="ts">
	import type { TransactionDTO } from '$lib/types';
	import { fly } from 'svelte/transition';

	let { transactions }: { transactions: TransactionDTO[] } = $props();

	function formatTimeAgo(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	}

	function getPointsColor(points: number): string {
		if (points > 0) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700';
		return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700';
	}
</script>

<div class="card">
	<div class="flex items-center justify-between mb-4 sm:mb-6">
		<h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
			<svg class="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
			<span class="hidden sm:inline">Recent Activity</span>
			<span class="sm:hidden">Activity</span>
		</h2>
		<span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{transactions.length}</span>
	</div>

	{#if transactions.length === 0}
		<div class="text-center py-8 sm:py-12">
			<svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			</svg>
			<p class="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">No activity yet</p>
			<p class="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-1">Start awarding points to see transactions!</p>
		</div>
	{:else}
		<div class="space-y-2 sm:space-y-3">
			{#each transactions as transaction, index (transaction._id)}
				<div
					class="group relative p-3 sm:p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-800 transition-all duration-200"
					in:fly={{ y: 20, duration: 300, delay: index * 50 }}
				>
					<!-- Mobile Layout -->
					<div class="flex sm:hidden flex-col gap-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								{#if transaction.by_user}
									<div class="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-lg">
										{transaction.by_user.emoji}
									</div>
								{/if}
								<svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
								{#if transaction.to_user}
									<div class="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
										{transaction.to_user.emoji}
									</div>
								{/if}
							</div>
							<div class="px-2.5 py-1 rounded-full border-2 font-bold text-sm {getPointsColor(transaction.points)}">
								{transaction.points > 0 ? '+' : ''}{transaction.points}
							</div>
						</div>
						<div class="text-sm">
							<div class="flex items-center gap-1.5 text-gray-900 dark:text-gray-100 font-medium mb-1">
								<span class="truncate">{transaction.by_user?.name || 'Unknown'}</span>
								<span class="text-gray-400 dark:text-gray-500">→</span>
								<span class="truncate">{transaction.to_user?.name || 'Unknown'}</span>
							</div>
							{#if transaction.action}
								<div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-1">
									<span>{transaction.action.emoji}</span>
									<span>{transaction.action.title}</span>
								</div>
							{/if}
							{#if transaction.note}
								<p class="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">"{transaction.note}"</p>
							{/if}
							<span class="text-xs text-gray-500 dark:text-gray-500 mt-1 inline-block">{formatTimeAgo(transaction.created_at)}</span>
						</div>
					</div>

					<!-- Desktop Layout -->
					<div class="hidden sm:flex items-center gap-4">
						<!-- From User Avatar -->
						{#if transaction.by_user}
							<div class="relative flex-shrink-0">
								{#if transaction.by_user.avatar_url}
									<img
										src={transaction.by_user.avatar_url}
										alt={transaction.by_user.name}
										class="w-12 h-12 rounded-full border-2 border-blue-200 dark:border-blue-700"
									/>
									<div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-sm border-2 border-blue-200 dark:border-blue-700">
										{transaction.by_user.emoji}
									</div>
								{:else}
									<div class="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl border-2 border-blue-200 dark:border-blue-700">
										{transaction.by_user.emoji}
									</div>
								{/if}
							</div>
						{/if}

						<!-- Arrow -->
						<svg class="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>

						<!-- To User Avatar -->
						{#if transaction.to_user}
							<div class="relative flex-shrink-0">
								{#if transaction.to_user.avatar_url}
									<img
										src={transaction.to_user.avatar_url}
										alt={transaction.to_user.name}
										class="w-12 h-12 rounded-full border-2 border-purple-200 dark:border-purple-700"
									/>
									<div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-sm border-2 border-purple-200 dark:border-purple-700">
										{transaction.to_user.emoji}
									</div>
								{:else}
									<div class="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl border-2 border-purple-200 dark:border-purple-700">
										{transaction.to_user.emoji}
									</div>
								{/if}
							</div>
						{/if}

						<!-- Transaction Details -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="font-semibold text-gray-900 dark:text-gray-100">{transaction.by_user?.name || 'Unknown'}</span>
								<span class="text-gray-400 dark:text-gray-500">→</span>
								<span class="font-semibold text-gray-900 dark:text-gray-100">{transaction.to_user?.name || 'Unknown'}</span>
							</div>

							{#if transaction.action}
								<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<span class="text-lg">{transaction.action.emoji}</span>
									<span>{transaction.action.title}</span>
								</div>
							{/if}

							{#if transaction.note}
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">"{transaction.note}"</p>
							{/if}
						</div>

						<!-- Points Badge -->
						<div class="flex flex-col items-end gap-1 flex-shrink-0">
							<div class="px-3 py-1.5 rounded-full border-2 font-bold text-lg {getPointsColor(transaction.points)}">
								{transaction.points > 0 ? '+' : ''}{transaction.points}
							</div>
							<span class="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(transaction.created_at)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
