import { env } from "$env/dynamic/private";


export function isEmailAllowed(email: string): boolean {
	if (!env.ALLOWED_EMAILS) {
		console.warn('ALLOWED_EMAILS not configured - no users will be allowed access');
		return false;
	}

	const allowedEmails = env.ALLOWED_EMAILS.split(',').map((e) => e.trim().toLowerCase());
	return allowedEmails.includes(email.toLowerCase());
}

export function getAllowedEmails(): string[] {
	if (!env.ALLOWED_EMAILS) return [];
	return env.ALLOWED_EMAILS.split(',').map((e) => e.trim());
}
