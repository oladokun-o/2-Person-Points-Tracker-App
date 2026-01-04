<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import Navigation from '$lib/components/Shared/Navigation.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let name = $derived(data.user.name);
	let emoji = $derived(data.user.emoji);
	let saving = $state(false);

	const emojiOptions = ['👤', '😊', '🎯', '⭐', '💪', '🚀', '🎨', '🎵', '🌟', '✨', '💝', '🌈', '🦄', '🔥', '💎', '👑'];

	async function handleSubmit() {
		saving = true;
		return async ({ result, update }: any) => {
			await update();
			saving = false;

			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	}
</script>

<svelte:head>
	<title>Edit Profile - Points Tracker</title>
</svelte:head>

<div class="min-h-screen bg-stone-50">
	<Navigation currentUser={data.user} currentPath={page.url.pathname} />

	<main class="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<div class="card">
			<h1 class="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>

			{#if form?.success}
				<div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
					Profile updated successfully!
				</div>
			{/if}

			{#if form?.error}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
					{form.error}
				</div>
			{/if}

			<form method="POST" action="?/updateProfile" use:enhance={handleSubmit} class="space-y-6">
				<!-- Avatar Preview -->
				<div class="flex justify-center">
					{#if data.user.avatar_url}
						<div class="relative">
							<img
								src={data.user.avatar_url}
								alt={name}
								class="w-32 h-32 rounded-full border-4 border-blue-200"
							/>
							<div class="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center text-4xl">
								{emoji}
							</div>
						</div>
					{:else}
						<div class="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-6xl border-4 border-blue-200">
							{emoji}
						</div>
					{/if}
				</div>

				<!-- Display Name -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
						Display Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={name}
						required
						minlength="1"
						maxlength="50"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Enter your display name"
					/>
					<p class="text-xs text-gray-500 mt-1">This is how you'll appear to others</p>
				</div>

				<!-- Emoji Selector -->
				<div>
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="block text-sm font-medium text-gray-700 mb-3">
						Choose Your Emoji
					</label>
					<div class="grid grid-cols-8 gap-2">
						{#each emojiOptions as option}
							<button
								type="button"
								onclick={() => (emoji = option)}
								class="w-12 h-12 text-2xl rounded-lg border-2 transition-all {emoji === option
									? 'border-blue-500 bg-blue-50 scale-110'
									: 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}"
							>
								{option}
							</button>
						{/each}
					</div>
					<input type="hidden" name="emoji" value={emoji} />
				</div>

				<!-- Account Info (Read-only) -->
				<div class="border-t border-gray-200 pt-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
					<div class="space-y-3">
						<div>
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="block text-sm font-medium text-gray-500">Email</label>
							<div class="text-gray-900">{data.user.email}</div>
						</div>
						<div>
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="block text-sm font-medium text-gray-500">Provider</label>
							<div class="text-gray-900 capitalize">{data.user.provider}</div>
						</div>
						<div class="grid grid-cols-3 gap-4">
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="block text-sm font-medium text-gray-500">Current Points</label>
								<div class="text-2xl font-bold text-blue-600">{data.user.points}</div>
							</div>
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="block text-sm font-medium text-gray-500">Total Earned</label>
								<div class="text-2xl font-bold text-green-600">{data.user.total_earned}</div>
							</div>
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="block text-sm font-medium text-gray-500">Total Lost</label>
								<div class="text-2xl font-bold text-red-600">{data.user.total_lost}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex gap-3 pt-6">
					<a href="/" class="btn-secondary flex-1">
						Cancel
					</a>
					<button type="submit" disabled={saving} class="btn-primary flex-1">
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</form>
		</div>
	</main>
</div>
