export type incomeType = {
    id: number;
    amount: number;
    comment: string;
    date: string;
};

export type expenseType = {
    id: number;
    amount: number;
    comment: string;
    category: number;
    date: string;
};

export type categoryType = {
    id: number;
    category: string;
    count: number;
};

export type tabType = 'Income' | 'Expense' | 'Category' | 'Dashboard';
