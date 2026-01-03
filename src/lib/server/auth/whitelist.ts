import { ALLOWED_EMAILS } from '$env/static/private';

export function isEmailAllowed(email: string): boolean {
	if (!ALLOWED_EMAILS) {
		console.warn('ALLOWED_EMAILS not configured - no users will be allowed access');
		return false;
	}

	const allowedEmails = ALLOWED_EMAILS.split(',').map((e) => e.trim().toLowerCase());
	return allowedEmails.includes(email.toLowerCase());
}

export function getAllowedEmails(): string[] {
	if (!ALLOWED_EMAILS) return [];
	return ALLOWED_EMAILS.split(',').map((e) => e.trim());
}
