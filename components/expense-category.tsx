"use client";

import {
	Icon,
	IconActivity,
	IconBus,
	IconCashBanknoteFilled,
	IconCircleChevronRight,
	IconMovie,
	IconPizzaFilled,
	IconPlus,
	IconProps,
	IconTrash,
} from "@tabler/icons-react";
import { Check } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
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


type categoryType = {
	id: number;
	name: string;
	icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
	color: string;
	backgroundColor: string;
}


const categoryTypes: categoryType[] = [
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



const schema = z.object({
	categoryId: z
		.number({ error: "Please select a category" })
		.refine((value) => categoryTypes.some((item) => item.id === value), {
			message: "Please select a category",
		}),
	categoryName: z.string().min(1, {
		message: "Category name is required",
	}),
});

type Schema = z.infer<typeof schema>;

export default function ExpenseCategory() {
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [categoryName, setCategoryName] = useState<string>("");
	const [error, setError] = useState<z.ZodError | null>(null);
	const [fetchCategories, setFetchCategories] = useState<{ categoryId: number, categoryName: string }[]>([]);

	const getCategories = () => {
		const getItem = localStorage.getItem('selectedCategory');
		if (getItem) {
			const parsedItem = JSON.parse(getItem) as { categoryId: number, categoryName: string }[];
			setFetchCategories(parsedItem);
		}
		return []
	}


	useEffect(() => {
		getCategories();
	}, []);

	function handleSubmitCategory() {
		console.log("selectedCategory", selectedCategory);

		const category: categoryType | undefined = categoryTypes.find((item) => item.id === selectedCategory);

		try {
			const parsedData = schema.parse({
				categoryId: category?.id,
				categoryName: categoryName,
			});

			console.log("parsedData", parsedData);

			if (parsedData.categoryId && parsedData.categoryName) {
				const getItem = localStorage.getItem('selectedCategory');

				if (getItem) {
					const parsedItem = JSON.parse(getItem);

					const updateItem = [...parsedItem, parsedData];

					localStorage.setItem('selectedCategory', JSON.stringify(updateItem));

					toast.success("Category added successfully", {
						description: "Category added successfully",
						action: {
							label: "Close",
							onClick: () => {
								toast.dismiss();
							},
						},
					});

					setSelectedCategory(null);
					setCategoryName("");
					setError(null);

					getCategories();

				} else {
					localStorage.setItem('selectedCategory', JSON.stringify([parsedData]));

					toast.success("Category added successfully", {
						description: "Category added successfully",
						action: {
							label: "Close",
							onClick: () => {
								toast.dismiss();
							},
						},
					});

					setSelectedCategory(null);
					setCategoryName("");
					setError(null);

					//fetch new categories 
					getCategories();
				}
			}

		} catch (error) {
			console.log('error', error)
			setError(error as z.ZodError);
		}
	}


	console.log('error issues', error)

	return (
		<div className="w-full h-auto py-3">
			<h3 className="text-lg mb-4 font-semibold text-muted-foreground">Expenses Categories</h3>
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

									{error?.issues[0]?.message && !selectedCategory && (
										<p className="text-sm text-red-500">{error.issues[0].message}</p>
									)}
									{error?.issues[1]?.message && (
										<p className="text-sm text-red-500">{error?.issues[1]?.message}</p>
									)}


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
														console.log('item selected', selectedCategory)
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
									<Input
										value={categoryName ?? ""}
										onChange={(e) => setCategoryName(e.target.value)}
										type="text"
										placeholder="Category Name"
										id="category-name"
									/>
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
					{fetchCategories.map((item, index) => {
						const category = categoryTypes.find(cat => cat.id === item.categoryId);
						if (!category) return null;


						const categoriesMatched = {
							icon: category.icon,
							backgroundColor: category.backgroundColor,
							color: category.color,
						}


						return (
							<div key={`${item.categoryId}-${index}`} className="group flex col-span-12 cursor-pointer hover:bg-muted/50 transition-all duration-300 hover:shadow-md md:col-span-6 lg:col-span-4 items-center justify-between lg:gap-6 gap-4 bg-background border border-border p-4 rounded-lg">
								<div className="flex flex-row items-center gap-4 w-full group-hover:opacity-70 transition-opacity duration-300">
									{/** ICON HERE */}
									<div
										style={{ backgroundColor: categoriesMatched.backgroundColor }}
										className="rounded-xl relative p-2 size-12 flex items-center justify-center cursor-pointer"
									>
										{<categoriesMatched.icon size={24} color={categoriesMatched.color} className="cursor-pointer" />}
									</div>

									<div className="flex flex-col">
										<p className="text-md font-medium">{item.categoryName}</p>
										<p className="text-sm font-normal text-gray-500">27% of expenses</p>
									</div>
								</div>

								<div className="flex gap-3 justify-center items-center group-hover:opacity-70 transition-opacity duration-300">
									<h6 className="text-mdd font-semibold text-foreground">₱0</h6>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
