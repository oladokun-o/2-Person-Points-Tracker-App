<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { fly, fade, scale } from 'svelte/transition';
	import type { PageData } from './$types';
	import Navigation from '$lib/components/Shared/Navigation.svelte';
	import PointsDisplay from '$lib/components/Dashboard/PointsDisplay.svelte';
	import AwardPointsModal from '$lib/components/Dashboard/AwardPointsModal.svelte';
	import RewardsList from '$lib/components/Dashboard/RewardsList.svelte';
	import NotesSection from '$lib/components/Dashboard/NotesSection.svelte';
	import ActivityFeed from '$lib/components/Dashboard/ActivityFeed.svelte';

	let { data }: { data: PageData } = $props();

	type Tab = 'dashboard' | 'activity' | 'notes' | 'rewards';
	let activeTab = $state<Tab>('dashboard');
	let showAwardModal = $state(false);

	async function refreshData() {
		await invalidateAll();
	}

	const tabs = [
		{ id: 'dashboard' as Tab, label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ id: 'activity' as Tab, label: 'Activity', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
		{ id: 'notes' as Tab, label: 'Notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
		{ id: 'rewards' as Tab, label: 'Rewards', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' }
	];
</script>

<svelte:head>
	<title>Dashboard - Points Tracker</title>
</svelte:head>

<div class="min-h-screen bg-stone-50 dark:bg-gray-900 transition-colors pb-20 md:pb-8">
	<Navigation currentUser={data.user} currentPath={page.url.pathname} />

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
		<!-- Dashboard Tab -->
		{#if activeTab === 'dashboard'}
			<div in:fly={{ x: -20, duration: 200 }} out:fade={{ duration: 100 }}>
				<!-- Users Points Display -->
				<div class="grid md:grid-cols-2 gap-4 mb-6">
					{#each data.users as user}
						<PointsDisplay {user} />
					{/each}
				</div>

				<!-- Award Points Button -->
				<div class="mb-6">
					<button onclick={() => (showAwardModal = true)} class="btn-primary w-full sm:w-auto shadow-lg">
						<svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Award Points
					</button>
				</div>

				<!-- Quick Stats -->
				<div class="grid grid-cols-2 gap-4 mb-6">
					<div class="card bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
						<div class="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">Total Points</div>
						<div class="text-3xl font-bold text-blue-900 dark:text-blue-100">
							{data.users.reduce((sum, u) => sum + u.points, 0)}
						</div>
					</div>
					<div class="card bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
						<div class="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">Transactions</div>
						<div class="text-3xl font-bold text-purple-900 dark:text-purple-100">
							{data.recentTransactions.length}
						</div>
					</div>
				</div>

				<!-- Recent Activity Preview -->
				<div class="mb-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Activity</h3>
						<!-- svelte-ignore event_directive_deprecated -->
						<button
							onclick={() => (activeTab = 'activity')}
							class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
						>
							View all →
						</button>
					</div>
					<div class="space-y-2">
						{#each data.recentTransactions.slice(0, 3) as transaction}
							<div class="card p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2 text-sm">
										<span>{transaction.by_user?.emoji}</span>
										<span class="text-gray-600 dark:text-gray-400">→</span>
										<span>{transaction.to_user?.emoji}</span>
										<span class="text-gray-900 dark:text-gray-100 font-medium">
											{transaction.points > 0 ? '+' : ''}{transaction.points}
										</span>
									</div>
									<span class="text-xs text-gray-500 dark:text-gray-400">
										{new Date(transaction.created_at).toLocaleDateString()}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Activity Tab -->
		{#if activeTab === 'activity'}
			<div in:fly={{ x: -20, duration: 200 }} out:fade={{ duration: 100 }}>
				<ActivityFeed transactions={data.recentTransactions} />
			</div>
		{/if}

		<!-- Notes Tab -->
		{#if activeTab === 'notes' && data.user}
			<div in:fly={{ x: -20, duration: 200 }} out:fade={{ duration: 100 }}>
				<NotesSection notes={data.notes} currentUser={data.user} onUpdate={refreshData} />
			</div>
		{/if}

		<!-- Rewards Tab -->
		{#if activeTab === 'rewards' && data.user}
			<div in:fly={{ x: -20, duration: 200 }} out:fade={{ duration: 100 }}>
				<RewardsList rewards={data.rewards} />
			</div>
		{/if}
	</main>

	<!-- Mobile Bottom Navigation -->
	<nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden safe-area-inset-bottom shadow-lg z-40">
		<div class="grid grid-cols-4 h-16">
			{#each tabs as tab}
				<!-- svelte-ignore event_directive_deprecated -->
				<button
					onclick={() => (activeTab = tab.id)}
					class="flex flex-col items-center justify-center gap-1 transition-all {activeTab === tab.id
						? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
						: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon} />
					</svg>
					<span class="text-xs font-medium">{tab.label}</span>
					{#if activeTab === tab.id}
						<div class="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" transition:scale={{ duration: 200 }}></div>
					{/if}
				</button>
			{/each}
		</div>
	</nav>

	<!-- Desktop Tab Navigation -->
	<div class="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
			<div class="grid grid-cols-4 gap-2">
				{#each tabs as tab}
					<!-- svelte-ignore event_directive_deprecated -->
					<button
						onclick={() => (activeTab = tab.id)}
						class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all font-medium {activeTab === tab.id
							? 'text-white bg-linear-to-r from-blue-600 to-purple-600 shadow-md scale-105'
							: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon} />
						</svg>
						<span>{tab.label}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Award Points Modal -->
{#if data.user}
	<AwardPointsModal
		bind:open={showAwardModal}
		users={data.users}
		actions={data.actions}
		currentUser={data.user}
		onSuccess={refreshData}
	/>
{/if}
