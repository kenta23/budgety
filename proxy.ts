import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		// Use the request headers directly in Next.js 16 proxy
		headers: request.headers,
	});

	console.log("session proxy", session);

	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if(!session) {
        return NextResponse.redirect(new URL("/login", request.url));
     }
    return NextResponse.next();
}

export const config = {
	runtime: "nodejs", // Required for auth.api calls
	matcher: ["/dashboard/:path*", "/income/:path*", "/expenses/:path*", "/savings/:path*", '/((?!api|_next/static|_next/image|.*\\.png$).*)',], 
};
