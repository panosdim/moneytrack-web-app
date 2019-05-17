import { Dayjs } from 'dayjs';

export type incomeType = {
    id: number;
    amount: number;
    comment: string;
    date: Dayjs;
};
