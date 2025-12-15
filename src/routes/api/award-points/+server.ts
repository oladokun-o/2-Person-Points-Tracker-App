import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userRepository } from '$lib/server/db/repositories/userRepository';
import { actionRepository } from '$lib/server/db/repositories/actionRepository';
import { transactionRepository } from '$lib/server/db/repositories/transactionRepository';
import { rewardRepository } from '$lib/server/db/repositories/rewardRepository';
import type { AwardPointsRequest, AwardPointsResponse } from '$lib/types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const body: AwardPointsRequest = await request.json();
	const { awarded_to, points, action_id, note } = body;

	// Validation
	if (!awarded_to || points === undefined) {
		throw error(400, 'Missing required fields');
	}

	// Can't award points to yourself
	if (awarded_to === locals.user._id) {
		throw error(400, 'You cannot award points to yourself');
	}

	// Get recipient user
	const recipient = await userRepository.findById(awarded_to);
	if (!recipient) {
		throw error(404, 'User not found');
	}

	// Record current points for reward unlock detection
	const currentPoints = recipient.points;

	// Update user points
	const updatedUser = await userRepository.updatePoints(awarded_to, points);
	if (!updatedUser) {
		throw error(500, 'Failed to update points');
	}

	// Create transaction
	const transaction = await transactionRepository.create({
		awarded_to,
		awarded_by: locals.user._id,
		action_id,
		points,
		note
	});

	// Increment action use count if action was used
	if (action_id) {
		await actionRepository.incrementUseCount(action_id);
	}

	// Check if any reward was unlocked
	let rewardUnlocked = undefined;
	if (points > 0) {
		rewardUnlocked = await rewardRepository.getNextUnlockedReward(
			currentPoints,
			updatedUser.points
		) || undefined;
	}

	const response: AwardPointsResponse = {
		success: true,
		transaction,
		updated_user: updatedUser,
		reward_unlocked: rewardUnlocked
	};

	return json(response);
};
