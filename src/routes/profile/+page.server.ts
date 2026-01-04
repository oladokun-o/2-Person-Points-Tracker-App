import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { userRepository } from '$lib/server/db/repositories/userRepository';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) {
			return { success: false, error: 'Unauthorized' };
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const emoji = formData.get('emoji') as string;

		if (!name || !emoji) {
			return { success: false, error: 'Name and emoji are required' };
		}

		try {
			await userRepository.update(locals.user._id, { name, emoji });
			return { success: true };
		} catch (error) {
			console.error('Failed to update profile:', error);
			return { success: false, error: 'Failed to update profile' };
		}
	}
};
