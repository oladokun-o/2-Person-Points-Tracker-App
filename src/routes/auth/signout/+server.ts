import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/server/auth/supabase';

export const POST: RequestHandler = async ({ cookies }) => {
	// Sign out from Supabase
	await supabase.auth.signOut();

	// Clear session cookie
	cookies.delete('session', { path: '/' });

	throw redirect(303, '/auth/login');
};
