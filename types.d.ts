
export enum Frequency {
    PER_WEEK = "per-week",
    PER_MONTH = "per-month",
    PER_YEAR = "per-year",
}

export type incomeSourcesType = {
    income_name: string;
    frequency: Frequency;
    source: string;
    amount: number;
};
export type expenseType = {
    amount: number;
    category: string;
    description: string;
};

export type expenseItem = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    amount: number;
    description: string;
    notes: string | null;
    incomeId: string | null;
    category: string;
};


export type incomeType = {
    id: string;
    name: string;
}[];

export type incomeItem = {
    source: string;
    amount: number;
    id: string;
    frequency: string;
    income_name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export type incomeItems = incomeItem[];
export type categoryType = (typeof categories)[number];
