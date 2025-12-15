import { redirect, type Handle } from '@sveltejs/kit';
import { supabase } from '$lib/server/auth/supabase';
import { userRepository } from '$lib/server/db/repositories/userRepository';
import { connectToDatabase } from '$lib/server/db/mongodb';

export const handle: Handle = async ({ event, resolve }) => {
	// Connect to database on every request
	await connectToDatabase();

	// Initialize locals
	event.locals.user = null;
	event.locals.session = null;

	// Get session from cookie
	const sessionCookie = event.cookies.get('session');

	if (sessionCookie) {
		try {
			const session = JSON.parse(sessionCookie);
			event.locals.session = session;

			// Get user from database
			const { data: { user: supabaseUser } } = await supabase.auth.getUser(session.access_token);

			if (supabaseUser) {
				const dbUser = await userRepository.findByAuthId(supabaseUser.id);
				if (dbUser && dbUser.is_allowed) {
					event.locals.user = dbUser;
				}
			}
		} catch (error) {
			console.error('Session error:', error);
			event.cookies.delete('session', { path: '/' });
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
