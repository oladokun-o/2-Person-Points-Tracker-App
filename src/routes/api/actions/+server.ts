import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { actionRepository } from '$lib/server/db/repositories/actionRepository';
import type { CreateActionRequest } from '$lib/types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const actions = await actionRepository.findAll();
	return json({ actions });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const body: CreateActionRequest = await request.json();
	const { title, emoji, points, category } = body;

	if (!title || !emoji || points === undefined) {
		throw error(400, 'Missing required fields');
	}

	const action = await actionRepository.create({
		title,
		emoji,
		points,
		category,
		created_by: locals.user._id
	});

	return json({ action });
};
