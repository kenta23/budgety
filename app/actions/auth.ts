"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function emailSignUp(initialState: any, formData: FormData) {
	const res = await auth.api.signUpEmail({
		body: {
			name: "John Doe", // required
			email: "john.doe@example.com", // required
			password: "password1234", // required
			image: "https://example.com/image.png",
			callbackURL: "https://example.com/callback",
		},
		headers: await headers(),
		method: "POST",
	});

	console.log(res);

	return {
		message: "User created successfully",
		error: null,
		data: res,
	};
}
