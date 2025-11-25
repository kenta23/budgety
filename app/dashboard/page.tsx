import type { Metadata } from "next";
import ExpenseCategory from "@/components/expense-category";
import { IncomeChart } from "@/components/income-chart";
import data from '@/data.json';
import { SectionCards } from "@/components/section-cards";
import { DataTable } from "@/components/data-table";


export const metadata: Metadata = {
	title: "Budgety - Dashboard",
	description: "Dashboard of your budget and income and expenses.",
	applicationName: "Budgety",
};



export default function Page() {
	return (
		<div className="min-w-full flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards />


			<ExpenseCategory />



			<IncomeChart />

			<DataTable data={data} />
		</div>

	);
}
