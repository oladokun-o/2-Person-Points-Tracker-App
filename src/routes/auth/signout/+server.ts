import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear user_id cookie
	cookies.delete('user_id', { path: '/' });

	throw redirect(303, '/auth/login');
};
