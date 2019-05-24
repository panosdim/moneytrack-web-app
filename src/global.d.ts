// eslint-disable-next-line @typescript-eslint/no-unused-vars
import reactn from 'reactn';
import { expenseType, categoryType } from './model';

declare module 'reactn/default' {
    interface State {
        isLoggedIn: boolean;
        income: Array<incomeType>;
        expenses: Array<expenseType>;
        categories: Array<categoryType>;
    }
}
