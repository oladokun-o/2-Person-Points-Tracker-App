<script lang="ts">
	import type { NoteDTO, UserDTO } from '$lib/types';
	import { toasts } from '$lib/stores/toast';
	import { fly, fade, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

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
	let editingNoteId = $state<string | null>(null);
	let editingContent = $state('');

	async function handleAddNote() {
		if (!newNoteContent.trim()) {
			toasts.error('Please enter note content');
			return;
		}

		loading = true;

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
			toasts.success('Note added! 📝');
			await onUpdate();
		} catch (err: any) {
			toasts.error(err.message);
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

			toasts.success(note.is_pinned ? 'Note unpinned' : 'Note pinned! 📌');
			await onUpdate();
		} catch (err: any) {
			toasts.error('Failed to toggle pin');
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

			toasts.success('Note deleted');
			await onUpdate();
		} catch (err: any) {
			toasts.error(err.message);
		}
	}

	function startEditing(note: NoteDTO) {
		editingNoteId = note._id;
		editingContent = note.content;
	}

	function cancelEditing() {
		editingNoteId = null;
		editingContent = '';
	}

	async function saveEdit(noteId: string) {
		if (!editingContent.trim()) {
			toasts.error('Note content cannot be empty');
			return;
		}

		try {
			const response = await fetch(`/api/notes/${noteId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: editingContent.trim() })
			});

			if (!response.ok) {
				throw new Error('Failed to update note');
			}

			toasts.success('Note updated! ✏️');
			editingNoteId = null;
			editingContent = '';
			await onUpdate();
		} catch (err: any) {
			toasts.error('Failed to update note');
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
		<!-- svelte-ignore event_directive_deprecated -->
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
	</div>

	<!-- Notes List -->
	{#if notes.length === 0}
		<div class="text-center py-8 text-gray-500" transition:fade>
			<svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<p class="font-medium">No notes yet</p>
			<p class="text-sm mt-1">Add one to get started!</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each notes as note (note._id)}
				<div
					class="group p-4 rounded-xl border-2 transition-all duration-200 {note.is_pinned
						? 'border-yellow-400 bg-yellow-50 shadow-md'
						: 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'}"
					in:fly={{ y: 20, duration: 300 }}
					out:scale={{ duration: 200 }}
					animate:flip={{ duration: 300 }}
				>
					{#if editingNoteId === note._id}
						<!-- Edit Mode -->
						<div class="space-y-3" transition:fade={{ duration: 150 }}>
							<textarea
								bind:value={editingContent}
								rows="3"
								class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
								placeholder="Edit your note..."
								autofocus
							></textarea>
							<div class="flex gap-2">
								<!-- svelte-ignore event_directive_deprecated -->
								<button
									type="button"
									on:click={() => saveEdit(note._id)}
									class="btn-primary text-sm px-3 py-1.5"
								>
									Save
								</button>
								<!-- svelte-ignore event_directive_deprecated -->
								<button
									type="button"
									on:click={cancelEditing}
									class="btn-secondary text-sm px-3 py-1.5"
								>
									Cancel
								</button>
							</div>
						</div>
					{:else}
						<!-- View Mode -->
						<div class="flex items-start justify-between gap-3">
							<div class="flex-1 min-w-0">
								<!-- svelte-ignore event_directive_deprecated -->
								<div
									on:dblclick={() => note.created_by === currentUser._id && startEditing(note)}
									class="text-gray-900 whitespace-pre-wrap wrap-break-word {note.created_by === currentUser._id ? 'cursor-pointer hover:text-blue-600' : ''}"
									title={note.created_by === currentUser._id ? 'Double-click to edit' : ''}
								>
									{note.content}
								</div>
								<div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
									<span>{formatDate(note.created_at)}</span>
									{#if note.creator}
										<span>•</span>
										<span>{note.creator.emoji} {note.creator.name}</span>
									{/if}
									{#if note.updated_at && note.updated_at !== note.created_at}
										<span>•</span>
										<span class="italic">edited</span>
									{/if}
								</div>
							</div>

							<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<!-- Edit Button (only for creator) -->
								{#if note.created_by === currentUser._id}
									<!-- svelte-ignore event_directive_deprecated -->
									<button
										type="button"
										on:click={() => startEditing(note)}
										class="p-1.5 rounded hover:bg-blue-100 transition-colors"
										title="Edit note"
									>
										<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</button>
								{/if}

								<!-- Pin Button -->
								<!-- svelte-ignore event_directive_deprecated -->
								<button
									type="button"
									on:click={() => togglePin(note._id)}
									class="p-1.5 rounded hover:bg-yellow-100 transition-colors"
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
									<!-- svelte-ignore event_directive_deprecated -->
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
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
