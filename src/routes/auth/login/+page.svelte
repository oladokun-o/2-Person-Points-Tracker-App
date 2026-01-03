<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	let loading = false;
	let error = '';

	async function signInWithGoogle() {
		loading = true;
		error = '';

		const { data, error: signInError } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});

		if (signInError) {
			error = signInError.message;
			loading = false;
		}
	}

	async function signInWithApple() {
		loading = true;
		error = '';

		const { data, error: signInError } = await supabase.auth.signInWithOAuth({
			provider: 'apple',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (signInError) {
			error = signInError.message;
			loading = false;
		}
	}

	async function signInWithEmail() {
		// TODO: Implement magic link
		alert('Email magic link coming soon!');
	}
</script>

<svelte:head>
	<title>Sign In - Points Tracker</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-purple-50 to-blue-50">
	<div class="card max-w-md w-full mx-4">
		<div class="text-center mb-8">
			<div class="flex justify-center mb-4">
				<img src="/icon.svg" alt="Points Tracker Logo" class="w-24 h-24" />
			</div>
			<h1 class="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-2">
				Points Tracker
			</h1>
			<p class="text-gray-600">Track your journey together</p>
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
				{error}
			</div>
		{/if}

		<div class="space-y-3">
			<button
				on:click={signInWithGoogle}
				disabled={loading}
				class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
			>
				<svg class="w-5 h-5" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="currentColor"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="currentColor"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="currentColor"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				<span class="font-medium">Continue with Google</span>
			</button>

			<button
				on:click={signInWithApple}
				disabled={loading}
				class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
			>
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
					/>
				</svg>
				<span class="font-medium">Continue with Apple</span>
			</button>

			<!--
			<button
				on:click={signInWithEmail}
				disabled={loading}
				class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				<span class="font-medium">Continue with Email</span>
			</button>
			-->
		</div>

		<p class="text-center text-sm text-gray-500 mt-6">
			This app is private and only accessible to whitelisted users.
		</p>
	</div>
</div>
