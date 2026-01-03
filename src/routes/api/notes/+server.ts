import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { noteRepository } from '$lib/server/db/repositories/noteRepository';

// GET /api/notes - Get all notes
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const notes = await noteRepository.findAll();
		return json({ notes });
	} catch (err: any) {
		console.error('Failed to fetch notes:', err);
		return json({ error: 'Failed to fetch notes' }, { status: 500 });
	}
};

// POST /api/notes - Create a new note
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { content } = await request.json();

		if (!content || content.trim().length === 0) {
			return json({ error: 'Content is required' }, { status: 400 });
		}

		const note = await noteRepository.create({
			content: content.trim(),
			created_by: locals.user._id
		});

		return json({ note }, { status: 201 });
	} catch (err: any) {
		console.error('Failed to create note:', err);
		return json({ error: err.message || 'Failed to create note' }, { status: 500 });
	}
};
