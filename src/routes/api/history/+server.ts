import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transactionRepository } from '$lib/server/db/repositories/transactionRepository';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const limit = parseInt(url.searchParams.get('limit') || '50');
	const userId = url.searchParams.get('user_id');

	const transactions = await transactionRepository.findRecent(limit, userId || undefined);

	return json({ transactions });
};
