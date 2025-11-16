"use client";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function QuickAddDialog() {
	const [category, setCategory] = useState<string>("");
	const [addIncomeSource, setAddIncomeSource] = useState<number>(0);
	const [addAmount, setAddAmount] = useState<
		{ amount: number; source: string; frequency: string }[]
	>([
		{
			amount: 0,
			source: "salary",
			frequency: "per-month",
		},
	]);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log("addAmount", addAmount);

		localStorage.setItem("income", JSON.stringify(addAmount));

		// Dispatch custom event to notify other components
		window.dispatchEvent(new Event("incomeUpdated"));

		// const total = addAmount.reduce<{ amount: number; source: string, frequency: string }[]>((acc, curr) => {
		// 	// Find if this source already exists in the accumulator
		// 	const existingSource = acc.find((item) => item.source === curr.source);

		// 	if (existingSource) {
		// 		// If source exists, add to its amount
		// 		existingSource.amount += curr.amount;
		// 	} else {
		// 		// If source doesn't exist, add new entry
		// 		acc.push({ amount: curr.amount, source: curr.source, frequency: curr.frequency });
		// 	}

		// 	return acc;
		// }, []); // Initialize with empty array
	}

	return (
		<Tabs defaultValue="income" className="flex w-full flex-col gap-6">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger className="cursor-pointer" value="income">
					Income
				</TabsTrigger>
				<TabsTrigger className="cursor-pointer" value="expense">
					Expense
				</TabsTrigger>
			</TabsList>

			<TabsContent value="income">
				{/* <CardHeader>
						<CardTitle>Income</CardTitle>
						<CardDescription>
							Add a new income to your budget. Click save when you&apos;re done.
						</CardDescription>
					</CardHeader> */}

				{/**INCOME FORM */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					<div className="flex flex-col gap-1 items-start w-full">
						{/**DEFAULT AMOUNT INPUT */}
						<div className="grid grid-cols-12 gap-2 w-full">
							<div className="flex flex-col gap-3 col-span-6">
								<Label htmlFor="tabs-amount">Amount</Label>
								<div className="relative">
									<span className="text-muted-foreground text-sm absolute left-2 top-1/2 -translate-y-1/2">
										₱
									</span>{" "}
									<Input
										type="number"
										min={0}
										onChange={(e) => {
											//REMOVE 0 FROM THE START OF THE STRING
											if (e.target.value.startsWith("0")) {
												e.target.value = e.target.value.slice(1);
											}
											const updated = [...addAmount];
											updated[0].amount = Number(e.target.value);
											setAddAmount(updated);
										}}
										value={addAmount[0].amount.toString()}
										id="tabs-amount"
										className="pl-6"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-3 col-span-3">
								<Label htmlFor="tabs-amount">Income Source</Label>

								<Select
									value={addAmount[0].source}
									onValueChange={(value) => {
										const updated = [...addAmount];
										updated[0].source = value;
										setAddAmount(updated);
									}}
								>
									<SelectTrigger className="w-full cursor-pointer">
										<SelectValue defaultValue={addAmount[0].source} placeholder="Select a source" />
									</SelectTrigger>

									<SelectContent className="cursor-pointer">
										<SelectItem className="cursor-pointer" value="salary">
											Salary
										</SelectItem>
										<SelectItem className="cursor-pointer" value="freelance">
											Freelance
										</SelectItem>
										<SelectItem className="cursor-pointer" value="business">
											Business
										</SelectItem>
										<SelectItem className="cursor-pointer" value="investment">
											Investment
										</SelectItem>
										<SelectItem className="cursor-pointer" value="other">
											Other
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-end self-end flex-col gap-3 col-span-3">
								<Select
									value={addAmount[0].frequency}
									onValueChange={(value) => {
										const updated = [...addAmount];
										updated[0].frequency = value;
										setAddAmount(updated);
									}}
								>
									<SelectTrigger className="w-full cursor-pointer">
										<SelectValue
											defaultValue={addAmount[0].frequency}
											placeholder="Select a type"
										/>
									</SelectTrigger>

									<SelectContent>
										<SelectItem className="cursor-pointer" value="per-day">
											Per Day
										</SelectItem>
										<SelectItem className="cursor-pointer" value="per-month">
											Per Month
										</SelectItem>
										<SelectItem className="cursor-pointer" value="per-week">
											Per Week
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/**ANOTHER INCOME SOURCE */}
						{addAmount.length > 1 &&
							addAmount
								.slice(1)
								.map(
									(item: { amount: number; source: string; frequency: string }, index: number) => {
										const actualIndex = index + 1; // Adjust index since we're slicing from position 1
										const amountToChange = addAmount[actualIndex].amount;
										const sourceToChange = addAmount[actualIndex].source;
										const frequencyToChange = addAmount[actualIndex].frequency;

										return (
											<div key={index + 1} className="grid grid-cols-12 gap-2 w-full">
												<div className="flex flex-col gap-3 col-span-6">
													<Label htmlFor="tabs-amount">Amount</Label>
													<div className="relative">
														<span className="text-muted-foreground text-sm absolute left-2 top-1/2 -translate-y-1/2">
															₱
														</span>{" "}
														<Input
															type="number"
															min={0}
															onChange={(e) => {
																if (e.target.value.startsWith("0")) {
																	e.target.value = e.target.value.slice(1);
																}
																const updated = [...addAmount];
																updated[actualIndex].amount = Number(e.target.value);
																setAddAmount(updated);
															}}
															value={amountToChange.toString()}
															id="tabs-amount"
															className="pl-6"
														/>
													</div>
												</div>

												<div className="flex flex-col gap-3 col-span-3">
													<Label htmlFor="tabs-amount">Income Source</Label>

													<Select
														value={sourceToChange}
														onValueChange={(value) => {
															const updated = [...addAmount];
															updated[actualIndex].source = value;
															setAddAmount(updated);
														}}
													>
														<SelectTrigger className="w-full cursor-pointer">
															<SelectValue
																defaultValue={sourceToChange}
																placeholder="Select a source"
															/>
														</SelectTrigger>

														<SelectContent className="cursor-pointer">
															<SelectItem className="cursor-pointer" value="salary">
																Salary
															</SelectItem>
															<SelectItem className="cursor-pointer" value="freelance">
																Freelance
															</SelectItem>
															<SelectItem className="cursor-pointer" value="business">
																Business
															</SelectItem>
															<SelectItem className="cursor-pointer" value="investment">
																Investment
															</SelectItem>
															<SelectItem className="cursor-pointer" value="other">
																Other
															</SelectItem>
														</SelectContent>
													</Select>
												</div>

												<div className="flex flex-col self-end gap-3 col-span-3">
													{/* <Label htmlFor="tabs-income-frequency">Income Frequency</Label> */}

													<Select
														value={frequencyToChange}
														onValueChange={(value) => {
															const updated = [...addAmount];

															updated[actualIndex].frequency = value;
															setAddAmount(updated);
														}}
													>
														<SelectTrigger className="w-full cursor-pointer">
															<SelectValue
																defaultValue={frequencyToChange}
																placeholder="Select a type"
															/>
														</SelectTrigger>

														<SelectContent>
															<SelectItem className="cursor-pointer" value="per-day">
																Per Day
															</SelectItem>
															<SelectItem className="cursor-pointer" value="per-month">
																Per Month
															</SelectItem>
															<SelectItem className="cursor-pointer" value="per-week">
																Per Week
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
										);
									}
								)}

						{/** ADD INCOME BUTTON */}
						<Button
							onClick={() => {
								setAddAmount([
									...addAmount,
									{ amount: 0, source: "salary", frequency: "per-month" },
								]);
							}}
							color="#f23b2e"
							type="button"
							variant="ghost"
							className="w-fit cursor-pointer"
						>
							<IconPlus color="#f23b2e" />
							<span className="text-red-500">Add Income</span>
						</Button>
					</div>

					{/**Display TOTAL */}
					<Card>
						<CardHeader>
							<CardTitle>Total</CardTitle>
							<CardDescription>Total amount of income added.</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">
								₱ {addAmount.reduce((acc, curr) => acc + curr.amount, 0)}
							</p>
						</CardContent>
					</Card>
					{/**SAVE BUTTON */}
					<div>
						<Button type="submit" className="w-full cursor-pointer">
							Save changes
						</Button>
					</div>
				</form>
			</TabsContent>

			{/** EXPENSE TAB */}
			<TabsContent value="expense">
				<Card>
					<CardHeader>
						<CardTitle>Expense</CardTitle>
						<CardDescription>
							Add a new expense to your budget. Click save when you&apos;re done.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-6">
						<div className="grid gap-3">
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent className="z-10 w-full">
									<SelectGroup>
										<SelectLabel>Categories</SelectLabel>
										<SelectItem value="food">Food</SelectItem>
										<SelectItem value="travel">Travel</SelectItem>
										<SelectItem value="entertainment">Entertainment</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="tabs-amount">Amount</Label>
							<div className="relative">
								<span className="text-muted-foreground text-sm absolute left-2 top-1/2 -translate-y-1/2">
									₱
								</span>{" "}
								<Input id="tabs-amount" className="pl-6" />
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button className="w-full cursor-pointer">Save changes</Button>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
