import type { PageServerLoad } from './$types';
import { userRepository } from '$lib/server/db/repositories/userRepository';
import { actionRepository } from '$lib/server/db/repositories/actionRepository';
import { rewardRepository } from '$lib/server/db/repositories/rewardRepository';
import { transactionRepository } from '$lib/server/db/repositories/transactionRepository';
import { noteRepository } from '$lib/server/db/repositories/noteRepository';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			users: [],
			actions: [],
			rewards: [],
			recentTransactions: [],
			notes: []
		};
	}

	// Load all data in parallel
	const [users, actions, rewards, recentTransactions, notes] = await Promise.all([
		userRepository.findAll(),
		actionRepository.findAll(),
		rewardRepository.findAllWithStatus(locals.user.points),
		transactionRepository.findRecent(10),
		noteRepository.findAll()
	]);

	// Populate creator info for notes
	const notesWithCreator = notes.map((note) => ({
		...note,
		creator: users.find((u) => u._id === note.created_by)
	}));

	return {
		users,
		actions,
		rewards,
		recentTransactions,
		notes: notesWithCreator
	};
};
