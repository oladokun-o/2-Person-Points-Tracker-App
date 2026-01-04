<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import Navigation from '$lib/components/Shared/Navigation.svelte';
	import PointsDisplay from '$lib/components/Dashboard/PointsDisplay.svelte';
	import AwardPointsModal from '$lib/components/Dashboard/AwardPointsModal.svelte';
	import RewardsList from '$lib/components/Dashboard/RewardsList.svelte';
	import NotesSection from '$lib/components/Dashboard/NotesSection.svelte';
	import ActivityFeed from '$lib/components/Dashboard/ActivityFeed.svelte';

	let { data }: { data: PageData } = $props();

	$effect(() => {
		console.log('Recent transactions:', data.recentTransactions)
	})

	let showAwardModal = $state(false);

	async function refreshData() {
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Dashboard - Points Tracker</title>
</svelte:head>

<div class="min-h-screen bg-stone-50">
	<Navigation currentUser={data.user} currentPath={page.url.pathname} />

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
			<button onclick={() => (showAwardModal = true)} class="btn-primary w-full sm:w-auto">
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

		<!-- Shared Notes Section -->
		{#if data.user}
			<div class="mt-8">
				<NotesSection notes={data.notes} currentUser={data.user} onUpdate={refreshData} />
			</div>
		{/if}

		<!-- Recent Activity Feed -->
		<div class="mt-8">
			<ActivityFeed transactions={data.recentTransactions} />
		</div>
	</main>
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
