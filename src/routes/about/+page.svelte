<script lang="ts">
	import { page } from '$app/state';
	import Navigation from '$lib/components/Shared/Navigation.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>About - Points Tracker</title>
</svelte:head>

<div class="min-h-screen bg-stone-50">
	<Navigation currentUser={data.user} currentPath={page.url.pathname} />

	<main class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
		<div class="card">
			<!-- Header -->
			<div class="text-center mb-12">
				<div class="flex justify-center mb-6">
					<div class="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
						<img src="/icon.svg" alt="Points Tracker Logo" class="w-20 h-20" />
					</div>
				</div>
				<h1 class="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-3">
					Points Tracker
				</h1>
				<p class="text-xl text-gray-600">Track your journey together</p>
			</div>

			<!-- Features -->
			<div class="space-y-8 mb-12">
				<div>
					<h2 class="text-2xl font-bold text-gray-900 mb-6">✨ Features</h2>
					<div class="grid md:grid-cols-2 gap-4">
						<div class="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
							<div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 mb-1">Points System</h3>
								<p class="text-sm text-gray-600">Award and track points between two people with customizable goals</p>
							</div>
						</div>

						<div class="flex gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
							<div class="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 mb-1">Interactive Profiles</h3>
								<p class="text-sm text-gray-600">Customize your profile with avatars, emojis, and display names</p>
							</div>
						</div>

						<div class="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
							<div class="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 mb-1">Rewards</h3>
								<p class="text-sm text-gray-600">Unlock rewards when you reach specific point thresholds</p>
							</div>
						</div>

						<div class="flex gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
							<div class="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white rounded-lg flex items-center justify-center">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 mb-1">Shared Notes</h3>
								<p class="text-sm text-gray-600">Leave notes for each other with pinning capability</p>
							</div>
						</div>

						<div class="flex gap-3 p-4 bg-pink-50 rounded-lg border border-pink-100">
							<div class="flex-shrink-0 w-10 h-10 bg-pink-500 text-white rounded-lg flex items-center justify-center">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 mb-1">Activity Feed</h3>
								<p class="text-sm text-gray-600">Beautiful transaction history with animations and user avatars</p>
							</div>
						</div>

						<div class="flex gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
							<div class="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 mb-1">PWA Support</h3>
								<p class="text-sm text-gray-600">Install as a mobile app on iOS and Android devices</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Tech Stack -->
				<div>
					<h2 class="text-2xl font-bold text-gray-900 mb-6">🛠️ Built With</h2>
					<div class="flex flex-wrap gap-2">
						<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">SvelteKit 5</span>
						<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">TypeScript</span>
						<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Tailwind CSS v4</span>
						<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Supabase</span>
						<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">PostgreSQL</span>
						<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">OAuth 2.0</span>
						<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Netlify</span>
					</div>
				</div>

				<!-- Privacy -->
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0">
							<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-blue-900 mb-2">🔒 Privacy & Security</h3>
							<p class="text-sm text-blue-800 mb-2">
								This is a private application with whitelist-only access. Only two specific users can sign in and use the app.
							</p>
							<ul class="text-sm text-blue-700 space-y-1">
								<li>• OAuth 2.0 authentication via Google/Apple</li>
								<li>• Secure session management with HTTP-only cookies</li>
								<li>• Row-level security (RLS) on database</li>
								<li>• All data stored securely in Supabase PostgreSQL</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="text-center pt-8 border-t border-gray-200">
				<p class="text-gray-600 text-sm">
					Made with ❤️ using Claude Code
				</p>
				<p class="text-gray-500 text-xs mt-2">
					Version 1.0.0 • {new Date().getFullYear()}
				</p>
			</div>
		</div>
	</main>
</div>
