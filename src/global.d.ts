// eslint-disable-next-line @typescript-eslint/no-unused-vars
import reactn from 'reactn';

declare module 'reactn/default' {
    interface State {
        isLoggedIn: boolean;
        income: Array<incomeType>;
        expenses: Array<String>;
        categories: Array<String>;
    }
}
