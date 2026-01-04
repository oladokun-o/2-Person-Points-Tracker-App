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
		if (points > 0) return 'text-green-600 bg-green-50 border-green-200';
		return 'text-red-600 bg-red-50 border-red-200';
	}
</script>

<div class="card">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
			<svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
			Recent Activity
		</h2>
		<span class="text-sm text-gray-500">{transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}</span>
	</div>

	{#if transactions.length === 0}
		<div class="text-center py-12">
			<svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			</svg>
			<p class="text-gray-500 font-medium">No activity yet</p>
			<p class="text-gray-400 text-sm mt-1">Start awarding points to see transactions here!</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each transactions as transaction, index (transaction._id)}
				<div
					class="group relative p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
					in:fly={{ y: 20, duration: 300, delay: index * 50 }}
				>
					<div class="flex items-center gap-4">
						<!-- From User Avatar -->
						{#if transaction.by_user}
							<div class="relative flex-shrink-0">
								{#if transaction.by_user.avatar_url}
									<img
										src={transaction.by_user.avatar_url}
										alt={transaction.by_user.name}
										class="w-12 h-12 rounded-full border-2 border-blue-200"
									/>
									<div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm border-2 border-blue-200">
										{transaction.by_user.emoji}
									</div>
								{:else}
									<div class="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl border-2 border-blue-200">
										{transaction.by_user.emoji}
									</div>
								{/if}
							</div>
						{/if}

						<!-- Arrow -->
						<svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>

						<!-- To User Avatar -->
						{#if transaction.to_user}
							<div class="relative flex-shrink-0">
								{#if transaction.to_user.avatar_url}
									<img
										src={transaction.to_user.avatar_url}
										alt={transaction.to_user.name}
										class="w-12 h-12 rounded-full border-2 border-purple-200"
									/>
									<div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm border-2 border-purple-200">
										{transaction.to_user.emoji}
									</div>
								{:else}
									<div class="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl border-2 border-purple-200">
										{transaction.to_user.emoji}
									</div>
								{/if}
							</div>
						{/if}

						<!-- Transaction Details -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="font-semibold text-gray-900">{transaction.by_user?.name || 'Unknown'}</span>
								<span class="text-gray-400">→</span>
								<span class="font-semibold text-gray-900">{transaction.to_user?.name || 'Unknown'}</span>
							</div>

							{#if transaction.action}
								<div class="flex items-center gap-2 text-sm text-gray-600">
									<span class="text-lg">{transaction.action.emoji}</span>
									<span>{transaction.action.title}</span>
								</div>
							{/if}

							{#if transaction.note}
								<p class="text-sm text-gray-600 mt-1 italic">"{transaction.note}"</p>
							{/if}
						</div>

						<!-- Points Badge -->
						<div class="flex flex-col items-end gap-1 flex-shrink-0">
							<div class="px-3 py-1.5 rounded-full border-2 font-bold text-lg {getPointsColor(transaction.points)}">
								{transaction.points > 0 ? '+' : ''}{transaction.points}
							</div>
							<span class="text-xs text-gray-500">{formatTimeAgo(transaction.created_at)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
