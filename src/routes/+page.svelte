<script lang="ts">
	import type { PageData } from './$types';
	import PointsDisplay from '$lib/components/Dashboard/PointsDisplay.svelte';
	import AwardPointsModal from '$lib/components/Dashboard/AwardPointsModal.svelte';
	import RewardsList from '$lib/components/Dashboard/RewardsList.svelte';

	export let data: PageData;

	let showAwardModal = false;

	async function signOut() {
		await fetch('/auth/signout', { method: 'POST' });
	}
</script>

<div class="min-h-screen bg-stone-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
					Points Tracker
				</h1>
				<form method="POST" action="/auth/signout">
					<button
						type="submit"
						class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
					>
						Sign Out
					</button>
				</form>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<!-- Users Points Display -->
		<div class="grid md:grid-cols-2 gap-6 mb-8">
			{#each data.users as user}
				<PointsDisplay {user} />
			{/each}
		</div>

		<!-- Award Points Button -->
		<div class="mb-8">
			<button on:click={() => (showAwardModal = true)} class="btn-primary w-full sm:w-auto">
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

		<!-- Rewards Section -->
		{#if data.user}
			<RewardsList rewards={data.rewards} />
		{/if}

		<!-- Recent Activity -->
		{#if data.recentTransactions.length > 0}
			<div class="card mt-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
				<div class="space-y-3">
					{#each data.recentTransactions as transaction}
						<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
							<div class="flex items-center gap-3">
								<div class="text-2xl">
									{transaction.points > 0 ? '✅' : '❌'}
								</div>
								<div>
									<p class="text-sm text-gray-900">
										{transaction.points > 0 ? '+' : ''}{transaction.points} points
									</p>
									{#if transaction.note}
										<p class="text-xs text-gray-600">{transaction.note}</p>
									{/if}
								</div>
							</div>
							<span class="text-xs text-gray-500">
								{new Date(transaction.created_at).toLocaleDateString()}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- Award Points Modal -->
{#if data.user}
	<AwardPointsModal
		bind:open={showAwardModal}
		users={data.users}
		actions={data.actions}
		currentUser={data.user}
	/>
{/if}
