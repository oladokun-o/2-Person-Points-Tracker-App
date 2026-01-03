<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	async function signOut() {
		await supabase.auth.signOut();
		goto('/auth/login');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-red-100 via-orange-50 to-red-50">
	<div class="card max-w-md w-full mx-4 text-center">
		<div class="text-6xl mb-4">🔒</div>
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
		<p class="text-gray-600 mb-6">
			Sorry, this app is private and only accessible to whitelisted users.
		</p>
		<p class="text-sm text-gray-500 mb-6">
			If you believe this is an error, please contact the administrator.
		</p>
		<button
			on:click={signOut}
			class="btn-secondary w-full"
		>
			Back to Login
		</button>
	</div>
</div>
