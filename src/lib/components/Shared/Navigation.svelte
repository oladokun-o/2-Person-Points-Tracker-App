<script lang="ts">
  import type { UserDTO } from "$lib/types";

  let {
    showLogo = true,
    currentUser,
    currentPath = "/",
  }: {
    showLogo?: boolean;
    currentUser?: UserDTO;
    currentPath?: string;
  } = $props();

  let showProfileMenu = $state(false);

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      href: "/about",
      label: "About",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  function toggleProfileMenu(e: MouseEvent) {
    e.stopPropagation();
    showProfileMenu = !showProfileMenu;
  }

  function closeProfileMenu() {
    showProfileMenu = false;
  }
</script>

<svelte:window onclick={closeProfileMenu} />

<header class="bg-white shadow-sm border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-6">
        {#if showLogo}
          <a
            href="/"
            class="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src="/icon.svg" alt="Points Tracker Logo" class="w-10 h-10" />
            <h1
              class="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600"
            >
              Points Tracker
            </h1>
          </a>
        {/if}

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors {currentPath === item.href
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'}"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </a>
          {/each}
        </nav>
      </div>

      <!-- User Profile -->
      {#if currentUser}
        <div class="relative">
          <button
            onclick={toggleProfileMenu}
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {#if currentUser.avatar_url}
              <img
                src={currentUser.avatar_url}
                alt={currentUser.name}
                class="w-10 h-10 rounded-full border-2 border-blue-200"
              />
            {:else}
              <div
                class="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl"
              >
                {currentUser.emoji}
              </div>
            {/if}
            <div class="hidden sm:block text-left">
              <div class="text-sm font-medium text-gray-900">
                {currentUser.name}
              </div>
              <div class="text-xs text-gray-500">
                {currentUser.points} points
              </div>
            </div>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform {showProfileMenu
                ? 'rotate-180'
                : ''}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          {#if showProfileMenu}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              onclick={(e) => e.stopPropagation()}
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="flex items-center gap-3 mb-2">
                  {#if currentUser.avatar_url}
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.name}
                      class="w-12 h-12 rounded-full border-2 border-blue-200"
                    />
                  {:else}
                    <div
                      class="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl"
                    >
                      {currentUser.emoji}
                    </div>
                  {/if}
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">
                      {currentUser.name}
                    </div>
                    <div class="text-xs text-gray-500">{currentUser.email}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Points</span>
                  <span class="font-bold text-blue-600"
                    >{currentUser.points} / {currentUser.max_points}</span
                  >
                </div>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                <a
                  href="/profile"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Edit Profile</span>
                </a>
                <button
                  onclick={async () => {
                    await fetch("/auth/signout", { method: "POST" });
                    window.location.href = "/auth/login";
                  }}
                  class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Mobile Navigation -->
    <nav class="md:hidden flex items-center gap-1 mt-4 overflow-x-auto">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap {currentPath === item.href
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-100'}"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
          </svg>
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>
  </div>
</header>
