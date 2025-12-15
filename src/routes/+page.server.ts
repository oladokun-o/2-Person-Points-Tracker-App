import type { PageServerLoad } from './$types';
import { userRepository } from '$lib/server/db/repositories/userRepository';
import { actionRepository } from '$lib/server/db/repositories/actionRepository';
import { rewardRepository } from '$lib/server/db/repositories/rewardRepository';
import { transactionRepository } from '$lib/server/db/repositories/transactionRepository';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			users: [],
			actions: [],
			rewards: [],
			recentTransactions: []
		};
	}

	// Load all data in parallel
	const [users, actions, rewards, recentTransactions] = await Promise.all([
		userRepository.findAll(),
		actionRepository.findAll(),
		rewardRepository.findAllWithStatus(locals.user.points),
		transactionRepository.findRecent(10)
	]);

	return {
		users,
		actions,
		rewards,
		recentTransactions
	};
};
