<script lang="ts">
	import type { NoteDTO, UserDTO } from '$lib/types';

	let {
		notes,
		currentUser,
		onUpdate = async () => {}
	}: {
		notes: NoteDTO[];
		currentUser: UserDTO;
		onUpdate?: () => void | Promise<void>;
	} = $props();

	let newNoteContent = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleAddNote() {
		if (!newNoteContent.trim()) {
			error = 'Please enter note content';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/notes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: newNoteContent.trim() })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to add note');
			}

			newNoteContent = '';
			await onUpdate();
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function togglePin(noteId: string) {
		try {
			const note = notes.find((n) => n._id === noteId);
			if (!note) return;

			const response = await fetch(`/api/notes/${noteId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ is_pinned: !note.is_pinned })
			});

			if (!response.ok) {
				throw new Error('Failed to toggle pin');
			}

			await onUpdate();
		} catch (err: any) {
			console.error('Failed to toggle pin:', err);
		}
	}

	async function deleteNote(noteId: string) {
		if (!confirm('Are you sure you want to delete this note?')) return;

		try {
			const response = await fetch(`/api/notes/${noteId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete note');
			}

			await onUpdate();
		} catch (err: any) {
			console.error('Failed to delete note:', err);
			alert(err.message);
		}
	}

	function formatDate(dateString: string): string {
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
</script>

<div class="card">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-2xl font-bold text-gray-900">Shared Notes</h2>
		<span class="text-sm text-gray-500">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
	</div>

	<!-- Add Note Form -->
	<div class="mb-6">
		<form on:submit|preventDefault={handleAddNote} class="flex gap-2">
			<input
				type="text"
				bind:value={newNoteContent}
				placeholder="Add a shared note..."
				class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				disabled={loading}
			/>
			<button
				type="submit"
				disabled={loading || !newNoteContent.trim()}
				class="btn-primary"
			>
				{loading ? 'Adding...' : 'Add'}
			</button>
		</form>
		{#if error}
			<p class="text-sm text-red-600 mt-2">{error}</p>
		{/if}
	</div>

	<!-- Notes List -->
	{#if notes.length === 0}
		<div class="text-center py-8 text-gray-500">
			<p>No notes yet. Add one to get started!</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each notes as note}
				<div
					class="p-4 rounded-lg border-2 transition-all {note.is_pinned
						? 'border-yellow-400 bg-yellow-50'
						: 'border-gray-200 bg-white'}"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="flex-1 min-w-0">
							<p class="text-gray-900 whitespace-pre-wrap break-words">{note.content}</p>
							<div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
								<span>{formatDate(note.created_at)}</span>
								{#if note.creator}
									<span>•</span>
									<span>{note.creator.emoji} {note.creator.name}</span>
								{/if}
							</div>
						</div>

						<div class="flex items-center gap-1">
							<!-- Pin Button -->
							<button
								type="button"
								on:click={() => togglePin(note._id)}
								class="p-1.5 rounded hover:bg-gray-100 transition-colors"
								title={note.is_pinned ? 'Unpin note' : 'Pin note'}
							>
								{#if note.is_pinned}
									<svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
									</svg>
								{:else}
									<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
									</svg>
								{/if}
							</button>

							<!-- Delete Button (only for creator) -->
							{#if note.created_by === currentUser._id}
								<button
									type="button"
									on:click={() => deleteNote(note._id)}
									class="p-1.5 rounded hover:bg-red-100 transition-colors"
									title="Delete note"
								>
									<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
