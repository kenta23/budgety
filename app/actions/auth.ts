"use server";

import { headers } from "next/headers";
import z from "zod";
import { auth } from "@/lib/auth";

const signUpSchema = z
	.object({
		fullName: z.string().min(1),
		email: z.email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export async function emailSignUp(initialState: any, formData: FormData) {
	//log the formdata
	const fullName = formData.get("full-name");
	const email = formData.get("email");
	const password = formData.get("password");
	const confirmPassword = formData.get("confirm-password");

	console.log("form submitted", fullName, email, password, confirmPassword);

	try {
		const { data, error } = await signUpSchema.safeParseAsync({
			fullName,
			email,
			password,
			confirmPassword,
		});

		console.log(error);

		if (error) {
			return {
				message: error,
				error: error.issues,
			};
		} else {
			const res = await auth.api.signUpEmail({
				body: {
					name: data.fullName, // required
					email: data.email, // required
					password: data.password, // required
					image: "https://example.com/image.png",
					callbackURL: "http://localhost:3000/dashboard",
				},
				headers: await headers(),
				method: "POST",
			});

			console.log(res);
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.log(error.issues);
			return {
				message: "Invalid form data",
				error: error.issues,
			};
		}
	}

	return {
		message: "User created successfully",
		error: null,
	};
}
