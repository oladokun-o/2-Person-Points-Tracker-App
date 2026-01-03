import { redirect, type Handle } from '@sveltejs/kit';
import { userRepository } from '$lib/server/db/repositories/userRepository';

export const handle: Handle = async ({ event, resolve }) => {

	// Initialize locals
	event.locals.user = null;
	event.locals.session = null;

	// Get user ID from cookie
	const userId = event.cookies.get('user_id');

	if (userId) {
		try {
			// Get user from database
			const dbUser = await userRepository.findById(userId);

			if (dbUser && dbUser.is_allowed) {
				event.locals.user = dbUser;
				console.log('User authenticated:', dbUser.email);
			} else {
				console.log('User not found or not allowed:', userId);
				// Clear invalid cookie
				event.cookies.delete('user_id', { path: '/' });
			}
		} catch (error) {
			console.error('Auth error:', error);
			event.cookies.delete('user_id', { path: '/' });
		}
	}

	// Protected routes - require authentication
	if (event.url.pathname.startsWith('/app') || event.url.pathname === '/') {
		if (!event.locals.user) {
			throw redirect(303, '/auth/login');
		}
	}

	// If logged in and trying to access auth pages, redirect to app
	if (event.url.pathname.startsWith('/auth/login')) {
		if (event.locals.user) {
			throw redirect(303, '/');
		}
	}

	return resolve(event);
};
