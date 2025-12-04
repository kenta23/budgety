import { headers } from "next/headers";
import { auth } from "./auth"; // path to your Better Auth server instance

/**
 * Get the current session on the server side.
 * This function must be called within a request context (e.g., Server Component, Route Handler, Server Action).
 */
export async function getSession() {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	return session;
}
