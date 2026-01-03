import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isEmailAllowed } from '$lib/server/auth/whitelist';
import { userRepository } from '$lib/server/db/repositories/userRepository';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const { user_id, email, name, provider, avatar_url } = body;

		if (!email || !isEmailAllowed(email)) {
			return json({ allowed: false, reason: 'not_whitelisted' }, { status: 403 });
		}

		// Find or create user in database
		let user = await userRepository.findByAuthId(user_id);

		if (!user) {
			// Create new user - set is_allowed to true since they passed whitelist check
			user = await userRepository.create({
				auth_id: user_id,
				email: email,
				name: name || email.split('@')[0] || 'User',
				provider: (provider || 'google') as 'google' | 'apple' | 'email',
				avatar_url: avatar_url,
				is_allowed: true
			});
		} else {
			// Update last login
			await userRepository.updateLastLogin(user._id);
		}

		// Set user ID in a secure cookie so hooks can read it
		cookies.set('user_id', user._id, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		return json({ allowed: true, user });
	} catch (err) {
		console.error('Verification error:', err);
		return json({ allowed: false, reason: 'server_error' }, { status: 500 });
	}
};
