import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Budgety",
	description: "Budgety is a budget management tool that helps you track your income and expenses.",
	applicationName: "Budgety",
};

export default function Page() {
	return (
		<div className="min-w-full flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<h1 className="text-2xl font-bold">Hello world</h1>
		</div>
	);
}
