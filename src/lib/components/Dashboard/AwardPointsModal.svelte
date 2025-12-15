<script lang="ts">
	import Modal from '../Shared/Modal.svelte';
	import type { UserDTO, ActionDTO } from '$lib/types';

	export let open = false;
	export let users: UserDTO[];
	export let actions: ActionDTO[];
	export let currentUser: UserDTO;

	let selectedUser: string = '';
	let selectedAction: string = '';
	let customPoints: number = 0;
	let note: string = '';
	let loading = false;
	let error = '';
	let success = '';

	$: otherUsers = users.filter((u) => u._id !== currentUser._id);
	$: selectedActionData = actions.find((a) => a._id === selectedAction);
	$: pointsToAward = selectedAction ? selectedActionData?.points || 0 : customPoints;

	function reset() {
		selectedUser = '';
		selectedAction = '';
		customPoints = 0;
		note = '';
		error = '';
		success = '';
	}

	async function handleSubmit() {
		if (!selectedUser) {
			error = 'Please select a user';
			return;
		}

		if (pointsToAward === 0) {
			error = 'Please select an action or enter custom points';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/award-points', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					awarded_to: selectedUser,
					points: pointsToAward,
					action_id: selectedAction || undefined,
					note: note || undefined
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Failed to award points');
			}

			const data = await response.json();
			success = `Successfully awarded ${pointsToAward} points!`;

			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		reset();
		open = false;
	}
</script>

<Modal {open} title="Award Points" onClose={handleClose}>
	{#if success}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
			{success}
		</div>
	{/if}

	{#if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
			{error}
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Select User -->
		<div>
			<label for="user" class="block text-sm font-medium text-gray-700 mb-2">
				Award points to:
			</label>
			<select
				id="user"
				bind:value={selectedUser}
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				required
			>
				<option value="">Select a user</option>
				{#each otherUsers as user}
					<option value={user._id}>{user.emoji} {user.name}</option>
				{/each}
			</select>
		</div>

		<!-- Select Action -->
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-2">Choose an action:</label>
			<div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
				{#each actions as action}
					<button
						type="button"
						on:click={() => (selectedAction = action._id)}
						class="px-4 py-3 rounded-lg border-2 transition-all text-left {selectedAction ===
						action._id
							? 'border-primary-500 bg-primary-50'
							: 'border-gray-200 hover:border-primary-300'}"
					>
						<div class="text-2xl mb-1">{action.emoji}</div>
						<div class="text-sm font-medium">{action.title}</div>
						<div
							class="text-xs {action.points > 0 ? 'text-green-600' : 'text-red-600'}"
						>
							{action.points > 0 ? '+' : ''}{action.points} points
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Custom Points -->
		<div>
			<label for="custom" class="block text-sm font-medium text-gray-700 mb-2">
				Or enter custom points:
			</label>
			<input
				id="custom"
				type="number"
				bind:value={customPoints}
				on:input={() => (selectedAction = '')}
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				placeholder="e.g., 5 or -2"
			/>
		</div>

		<!-- Note -->
		<div>
			<label for="note" class="block text-sm font-medium text-gray-700 mb-2">
				Add a personal note (optional):
			</label>
			<textarea
				id="note"
				bind:value={note}
				rows="3"
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				placeholder="You made my day!"
			/>
		</div>

		<!-- Submit -->
		<div class="flex gap-3">
			<button type="button" on:click={handleClose} class="btn-secondary flex-1">
				Cancel
			</button>
			<button type="submit" disabled={loading} class="btn-primary flex-1">
				{loading ? 'Awarding...' : `Award ${pointsToAward} Points`}
			</button>
		</div>
	</form>
</Modal>
