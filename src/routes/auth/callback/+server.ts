import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/server/auth/supabase';
import { isEmailAllowed } from '$lib/server/auth/whitelist';
import { userRepository } from '$lib/server/db/repositories/userRepository';
import { connectToDatabase } from '$lib/server/db/mongodb';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');

	if (code) {
		// Exchange code for session
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error('Auth error:', error);
			throw redirect(303, '/auth/login');
		}

		if (data.session && data.user) {
			const email = data.user.email;

			if (!email || !isEmailAllowed(email)) {
				// Not whitelisted
				throw redirect(303, '/auth/unauthorized');
			}

			// Connect to database
			await connectToDatabase();

			// Find or create user in MongoDB
			let user = await userRepository.findByAuthId(data.user.id);

			if (!user) {
				// Create new user
				user = await userRepository.create({
					auth_id: data.user.id,
					email: email,
					name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
					provider: (data.user.app_metadata?.provider || 'email') as 'google' | 'apple' | 'email',
					avatar_url: data.user.user_metadata?.avatar_url
				});

				// Set as allowed since they passed whitelist check
				await userRepository.setAllowed(user._id, true);
			} else {
				// Update last login
				await userRepository.updateLastLogin(user._id);
			}

			// Set session cookie
			cookies.set('session', JSON.stringify(data.session), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			throw redirect(303, '/');
		}
	}

	throw redirect(303, '/auth/login');
};
