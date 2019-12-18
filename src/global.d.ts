import {categoryType, expenseType, incomeType} from "./model";

declare module "reactn/default" {
    interface State {
        isLoggedIn: boolean;
        income: Array<incomeType>;
        expenses: Array<expenseType>;
        categories: Array<categoryType>;
        monthIncome: number;
        yearIncome: number;
        monthExpenses: number;
        yearExpenses: number;
    }
}
