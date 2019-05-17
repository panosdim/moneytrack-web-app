import { Dayjs } from 'dayjs';

export interface GlobalState {
    isLoggedIn: boolean;
    income: Array<incomeType>;
    expenses: Array<String>;
    categories: Array<String>;
}

export type incomeType = {
    id: number;
    amount: number;
    comment: string;
    date: Dayjs;
};
