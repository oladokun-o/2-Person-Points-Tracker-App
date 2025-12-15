import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rewardRepository } from '$lib/server/db/repositories/rewardRepository';
import type { CreateRewardRequest } from '$lib/types';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const userId = url.searchParams.get('user_id');

	if (userId) {
		// Get user to get their points
		const { userRepository } = await import('$lib/server/db/repositories/userRepository');
		const user = await userRepository.findById(userId);

		if (!user) {
			throw error(404, 'User not found');
		}

		const rewards = await rewardRepository.findAllWithStatus(user.points);
		return json({ rewards });
	}

	const rewards = await rewardRepository.findAll();
	return json({ rewards });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const body: CreateRewardRequest = await request.json();
	const { title, description, emoji, required_points, category, order } = body;

	if (!title || !emoji || required_points === undefined || order === undefined) {
		throw error(400, 'Missing required fields');
	}

	const reward = await rewardRepository.create({
		title,
		description,
		emoji,
		required_points,
		category,
		order
	});

	return json({ reward });
};
