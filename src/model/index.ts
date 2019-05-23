export type incomeType = {
    id: number;
    amount: number;
    comment: string;
    date: Date;
};

export type tabType = 'Income' | 'Expense' | 'Category';
