"use client";

import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";

import { Label } from "../../../components/ui/label";
import { categories, type categoryType } from "../../../data";

const schema = z.object({
	categoryId: z
		.number({ error: "Please select a category" })
		.refine((value) => categories.some((item) => item.id === value), {
			message: "Please select a category",
		}),
	categoryName: z.string().min(1, {
		message: "Category name is required",
	}),
});

export default function ExpenseCategory() {
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [categoryName, setCategoryName] = useState<string>("");
	const [error, setError] = useState<z.ZodError | null>(null);
	const [fetchCategories, setFetchCategories] = useState<
		{ categoryId: number; categoryName: string }[]
	>([]);

	// Dialog states
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [viewingCategory, setViewingCategory] = useState<{
		categoryId: number;
		categoryName: string;
	} | null>(null);
	const [editingCategory, setEditingCategory] = useState<{
		categoryId: number;
		categoryName: string;
		index: number;
	} | null>(null);
	const [deletingCategory, setDeletingCategory] = useState<{
		categoryId: number;
		categoryName: string;
		index: number;
	} | null>(null);

	// Edit form states
	const [editSelectedCategory, setEditSelectedCategory] = useState<number | null>(null);
	const [editCategoryName, setEditCategoryName] = useState<string>("");
	const [editError, setEditError] = useState<z.ZodError | null>(null);

	const getCategories = useCallback(() => {
		const getItem = localStorage.getItem("selectedCategory");
		if (getItem) {
			const parsedItem = JSON.parse(getItem) as { categoryId: number; categoryName: string }[];
			setFetchCategories(parsedItem);
		}
		return [];
	}, []);

	useEffect(() => {
		getCategories();
	}, [getCategories]);

	function handleSubmitCategory() {
		console.log("selectedCategory", selectedCategory);

		const category: categoryType | undefined = categories.find(
			(item) => item.id === selectedCategory
		);

		try {
			const parsedData = schema.parse({
				categoryId: category?.id,
				categoryName: categoryName,
			});

			console.log("parsedData", parsedData);

			if (parsedData.categoryId && parsedData.categoryName) {
				const getItem = localStorage.getItem("selectedCategory");

				if (getItem) {
					const parsedItem = JSON.parse(getItem);

					const updateItem = [...parsedItem, parsedData];

					localStorage.setItem("selectedCategory", JSON.stringify(updateItem));

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
					localStorage.setItem("selectedCategory", JSON.stringify([parsedData]));

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
			console.log("error", error);
			setError(error as z.ZodError);
		}
	}

	function openViewDialog(category: { categoryId: number; categoryName: string }) {
		setViewingCategory(category);
		setIsViewDialogOpen(true);
	}

	function openEditDialog(category: { categoryId: number; categoryName: string }, index: number) {
		setEditingCategory({ ...category, index });
		setEditSelectedCategory(category.categoryId);
		setEditCategoryName(category.categoryName);
		setEditError(null);
		setIsEditDialogOpen(true);
	}

	function openDeleteDialog(category: { categoryId: number; categoryName: string }, index: number) {
		setDeletingCategory({ ...category, index });
		setIsDeleteDialogOpen(true);
	}

	function handleEditCategory() {
		const category: categoryType | undefined = categories.find(
			(item) => item.id === editSelectedCategory
		);

		try {
			const parsedData = schema.parse({
				categoryId: category?.id,
				categoryName: editCategoryName,
			});

			if (parsedData.categoryId && parsedData.categoryName && editingCategory) {
				const getItem = localStorage.getItem("selectedCategory");
				if (getItem) {
					const parsedItem = JSON.parse(getItem) as { categoryId: number; categoryName: string }[];
					const updatedItem = [...parsedItem];
					updatedItem[editingCategory.index] = parsedData;

					localStorage.setItem("selectedCategory", JSON.stringify(updatedItem));

					toast.success("Category updated successfully", {
						description: "Category has been updated",
						action: {
							label: "Close",
							onClick: () => {
								toast.dismiss();
							},
						},
					});

					setIsEditDialogOpen(false);
					setEditingCategory(null);
					setEditSelectedCategory(null);
					setEditCategoryName("");
					setEditError(null);
					getCategories();
				}
			}
		} catch (error) {
			console.log("error", error);
			setEditError(error as z.ZodError);
		}
	}

	function handleDeleteCategory() {
		if (deletingCategory) {
			const getItem = localStorage.getItem("selectedCategory");
			if (getItem) {
				const parsedItem = JSON.parse(getItem) as { categoryId: number; categoryName: string }[];
				const updatedItem = parsedItem.filter((_, index) => index !== deletingCategory.index);

				localStorage.setItem("selectedCategory", JSON.stringify(updatedItem));

				toast.success("Category deleted successfully", {
					description: "Category has been removed",
					action: {
						label: "Close",
						onClick: () => {
							toast.dismiss();
						},
					},
				});

				setIsDeleteDialogOpen(false);
				setDeletingCategory(null);
				getCategories();
			}
		}
	}

	console.log("error issues", error);

	return (
		<div className="w-full h-auto py-3">
			<h3 className="text-lg mb-4 font-semibold text-muted-foreground">Expenses Categories</h3>
			<div className="grid grid-cols-12 gap-2">
				{/**Fetch Categories here... */}
				<div className="col-span-12 gap-4 grid grid-cols-12 w-full">
					{categories.map((item, index) => {
						const category = categories.find((cat) => cat.id === item.id);
						if (!category) return null;

						const categoriesMatched = {
							icon: category.icon,
							backgroundColor: category.backgroundColor,
							color: category.color,
						};

						return (
							//category name, % of total expenses, total expenses
							<div
								key={`${item.id}-${index}`}
								className="group flex col-span-12 cursor-pointer hover:bg-muted/50 transition-all duration-300 hover:shadow-md md:col-span-6 lg:col-span-4 items-center justify-between lg:gap-6 gap-4 bg-background border border-border p-4 rounded-lg"
							>
								<div className="flex flex-row items-center gap-4 w-full group-hover:opacity-70 transition-opacity duration-300">
									{/** ICON HERE */}
									<div
										style={{ backgroundColor: categoriesMatched.backgroundColor }}
										className="rounded-xl relative p-2 size-12 flex items-center justify-center cursor-pointer"
									>
										{
											<categoriesMatched.icon
												size={24}
												color={categoriesMatched.color}
												className="cursor-pointer"
											/>
										}
									</div>

									<div className="flex flex-col flex-1">
										<p className="text-md font-medium">{item.name}</p>
										<p className="text-sm font-normal text-gray-500">0% of total expenses</p>
									</div>

									<div className="flex shrink-0 items-center gap-2">
										<h6 className="text-md font-semibold text-foreground">₱0</h6>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

		</div>
	);
}
