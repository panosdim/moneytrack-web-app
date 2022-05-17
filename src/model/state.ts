import { atom } from 'recoil';
import { categoryType, expenseType, incomeType } from './data';

export const loginState = atom({
    key: 'loginState',
    default: false,
});

export const incomesState = atom<incomeType[]>({
    key: 'incomes',
    default: [],
});

export const expensesState = atom<expenseType[]>({
    key: 'expenses',
    default: [],
});

export const categoriesState = atom<categoryType[]>({
    key: 'categories',
    default: [],
});

export const yearIncomeState = atom<number>({
    key: 'yearIncome',
    default: 0,
});

export const monthIncomeState = atom<number>({
    key: 'monthIncome',
    default: 0,
});

export const yearExpensesState = atom<number>({
    key: 'yearExpenses',
    default: 0,
});

export const monthExpensesState = atom<number>({
    key: 'monthExpenses',
    default: 0,
});
