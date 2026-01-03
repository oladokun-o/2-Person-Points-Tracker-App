import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { noteRepository } from '$lib/server/db/repositories/noteRepository';

// PATCH /api/notes/[id] - Update note (content or toggle pin)
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = params;
		const updates = await request.json();

		// Validate that user owns this note or just toggling pin
		const existingNote = await noteRepository.findById(id);
		if (!existingNote) {
			return json({ error: 'Note not found' }, { status: 404 });
		}

		// Only the creator can update content
		if (updates.content !== undefined && existingNote.created_by !== locals.user._id) {
			return json({ error: 'You can only edit your own notes' }, { status: 403 });
		}

		const note = await noteRepository.update(id, updates);
		if (!note) {
			return json({ error: 'Failed to update note' }, { status: 500 });
		}

		return json({ note });
	} catch (err: any) {
		console.error('Failed to update note:', err);
		return json({ error: err.message || 'Failed to update note' }, { status: 500 });
	}
};

// DELETE /api/notes/[id] - Delete a note
export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = params;

		// Validate that user owns this note
		const existingNote = await noteRepository.findById(id);
		if (!existingNote) {
			return json({ error: 'Note not found' }, { status: 404 });
		}

		if (existingNote.created_by !== locals.user._id) {
			return json({ error: 'You can only delete your own notes' }, { status: 403 });
		}

		const success = await noteRepository.delete(id);
		if (!success) {
			return json({ error: 'Failed to delete note' }, { status: 500 });
		}

		return json({ success: true });
	} catch (err: any) {
		console.error('Failed to delete note:', err);
		return json({ error: err.message || 'Failed to delete note' }, { status: 500 });
	}
};
