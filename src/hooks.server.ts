import { redirect, type Handle } from "@sveltejs/kit";
import { userRepository } from "$lib/server/db/repositories/userRepository";

const PUBLIC_ROUTES = ["/auth/login", "/auth/callback", "/auth/unauthorized"];

export const handle: Handle = async ({ event, resolve }) => {
  // Initialize locals
  event.locals.user = null;
  event.locals.session = null;

  // Allow public routes early
  if (PUBLIC_ROUTES.some((route) => event.url.pathname.startsWith(route))) {
    return resolve(event);
  }

  // Get user ID from cookie
  const userId = event.cookies.get("user_id");

  if (userId) {
    try {
      // Get user from database
      const dbUser = await userRepository.findById(userId);

      if (dbUser && dbUser.is_allowed) {
        event.locals.user = dbUser;
        console.log("User authenticated:", dbUser.email);
      } else {
        console.log("User not found or not allowed:", userId);
        // Clear invalid cookie
        event.cookies.delete("user_id", { path: "/" });
      }
    } catch (error) {
      console.error("Auth error:", error);
      event.cookies.delete("user_id", { path: "/" });
    }
  }

  // Protect ONLY app routes
  if (event.url.pathname.startsWith("/app")) {
    if (!event.locals.user) {
      throw redirect(303, "/auth/login");
    }
  }

  // Logged-in users shouldn't see login
  if (event.url.pathname.startsWith("/auth/login") && event.locals.user) {
    throw redirect(303, "/app");
  }

  return resolve(event);
};
