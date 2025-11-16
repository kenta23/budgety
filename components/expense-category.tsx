"use client";

import {
	IconActivity,
	IconBus,
	IconCashBanknoteFilled,
	IconMovie,
	IconPizzaFilled,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const categoryTypes = [
	{
		id: 1,
		name: "Food",
		icon: IconPizzaFilled,
		color: "#1a64db", // blue (unchanged)
		backgroundColor: "#e7effb", // lighter blue
	},
	{
		id: 2,
		name: "Transportation",
		icon: IconBus,
		color: "#f59e42", // orange
		backgroundColor: "#fff5e6", // lighter orange
	},
	{
		id: 3,
		name: "Entertainment",
		icon: IconMovie,
		color: "#e44e68", // rose red / magenta
		backgroundColor: "#fde4ec", // lighter magenta/pink
	},
	{
		id: 4,
		name: "Savings",
		icon: IconCashBanknoteFilled,
		color: "#ffd600", // gold/yellow
		backgroundColor: "#fffbe7", // lighter yellow
	},
	{
		id: 5,
		name: "Other",
		icon: IconPlus,
		color: "#60b27e", // green
		backgroundColor: "#e7f7ee", // lighter green
	},
];

export default function ExpenseCategory() {
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

	function handleSelectCategory(category: number) {
		setSelectedCategory(category);
	}

	function handleSubmitCategory() {
		console.log("selectedCategory", selectedCategory);

		const category = categoryTypes.find((item) => item.id === selectedCategory);

		localStorage.setItem("selectedCategory", JSON.stringify(category));
	}
	return (
		<div className="w-full h-auto py-3bg-amber-100">
			<div className="grid grid-cols-12 gap-2">
				<div className="col-span-12">
					<Dialog>
						<DialogTrigger asChild>
							<Button className="cursor-pointer" variant={"default"}>
								<IconPlus />
								<span>Add Category</span>
							</Button>
						</DialogTrigger>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Category</DialogTitle>
								<DialogDescription>
									Add a new category to your budget. Click save when you&apos;re done.
								</DialogDescription>
							</DialogHeader>

							<div className="grid grid-cols-12 gap-7">
								<div className="col-span-12 flex flex-col gap-4">
									<h3 className="text-md font-semibold">Choose a category type</h3>

									{/**ICON CARD*/}
									<div className="grid grid-cols-12 items-center justify-center gap-4">
										{categoryTypes.map((item) => (
											<button
												type="button"
												onClick={() => {
													if (selectedCategory === item.id) {
														setSelectedCategory(null);
													} else {
														setSelectedCategory(item.id);
													}
												}}
												key={item.id}
												className="col-span-3 justify-center items-center flex flex-col gap-1 cursor-pointer"
											>
												<div
													style={{ backgroundColor: item.backgroundColor }}
													className="rounded-xl relative p-2 size-12 flex items-center justify-center cursor-pointer"
												>
													{<item.icon size={24} color={item.color} className="cursor-pointer" />}

													{selectedCategory === item.id && (
														<div className="absolute bottom-0 right-0 bg-green-200 rounded-full p-1">
															<Check size={18} className="text-green-600" />
														</div>
													)}
												</div>
												<p className="text-sm text-center font-normal">{item.name}</p>
											</button>
										))}
									</div>
								</div>

								<div className="col-span-12 flex flex-col gap-4">
									<Label htmlFor="category-name">Category Name</Label>
									<Input type="text" placeholder="Category Name" id="category-name" />
								</div>
							</div>

							<DialogFooter>
								<Button className="cursor-pointer" onClick={handleSubmitCategory} type="button">
									Add Category
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>

				{/**Fetch Categories here... */}
				<div className="col-span-12 gap-4 grid grid-cols-12 w-full">
					<div className="flex col-span-12 md:col-span-6 lg:col-span-4 items-center justify-between lg:gap-6 gap-4 bg-background border border-border p-4 rounded-lg">
						<div className="flex flex-row items-center gap-4 w-full">
							<IconActivity size={28} />
							<div className="flex flex-col">
								<p className="text-lg font-medium">Food</p>
								<p className="text-sm font-medium text-gray-500">27% of expenses</p>
							</div>
						</div>

						<div className="flex items-center">
							<h6 className="text-xl font-semibold text-foreground">₱10,000</h6>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
