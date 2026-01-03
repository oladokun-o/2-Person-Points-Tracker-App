<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let error = '';
	let processing = true;

	onMount(async () => {
		// Check if we have a session after OAuth redirect
		const { data: { session }, error: sessionError } = await supabase.auth.getSession();

		if (sessionError) {
			console.error('Session error:', sessionError);
			error = sessionError.message;
			processing = false;
			return;
		}

		if (session && session.user) {
			// Session established, now verify with backend
			try {
				const response = await fetch('/api/auth/verify', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						user_id: session.user.id,
						email: session.user.email,
						name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
						provider: session.user.app_metadata?.provider || 'google',
						avatar_url: session.user.user_metadata?.avatar_url
					})
				});

				const result = await response.json();

				if (!response.ok || !result.allowed) {
					// Not whitelisted
					await supabase.auth.signOut();
					goto('/auth/unauthorized');
					return;
				}

				// Success - redirect to home
				goto('/');
			} catch (err) {
				console.error('Verification error:', err);
				error = 'Failed to verify user';
				processing = false;
			}
		} else {
			// No session - redirect to login
			goto('/auth/login');
		}
	});
</script>

<svelte:head>
	<title>Signing In - Points Tracker</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-purple-50 to-blue-50">
	<div class="card max-w-md w-full mx-4 text-center">
		{#if processing}
			<div class="mb-4">
				<svg class="animate-spin h-12 w-12 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			</div>
			<h2 class="text-xl font-semibold text-gray-700">Completing sign in...</h2>
			<p class="text-gray-500 mt-2">Please wait while we verify your account</p>
		{:else if error}
			<div class="text-red-600 mb-4">
				<svg class="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h2 class="text-xl font-semibold">Authentication Error</h2>
				<p class="text-sm mt-2">{error}</p>
			</div>
			<button
				on:click={() => goto('/auth/login')}
				class="btn-secondary"
			>
				Back to Login
			</button>
		{/if}
	</div>
</div>
