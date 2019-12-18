export const MONTHS: monthNames[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

type monthNames =
    'January'
    | 'February'
    | 'March'
    | 'April'
    | 'May'
    | 'June'
    | 'July'
    | 'August'
    | 'September'
    | 'October'
    | 'November'
    | 'December';

export type shortMonthNames =
    'Jan'
    | 'Feb'
    | 'Mar'
    | 'Apr'
    | 'May'
    | 'Jun'
    | 'Juy'
    | 'Aug'
    | 'Sep'
    | 'Oct'
    | 'Nov'
    | 'Dec';

export const getMonthName = (monthNum: number): monthNames => {
    return MONTHS[monthNum - 1] || '';
};

export const getShortMonthName = (monthNum: number): shortMonthNames => {
    return MONTHS[monthNum - 1].substring(0, 3) as shortMonthNames || '';
};

export const getLastYears = (numOfYears: number): number[] => {
    const currentYear = new Date().getFullYear();
    let years: number[] = [];
    while (--numOfYears > -1) {
        years.push(currentYear - numOfYears);
    }

    return years;
};

/**
 * Return the month from a date string
 * @param date A date string in YYYY-MM-DD format.
 */
export const getMonth = (date: string): number => {
    return Number(date.split('-')[1]);
};

/**
 * Return the year from a date string
 * @param date A date string in YYYY-MM-DD format.
 */
export const getYear = (date: string): number => {
    return Number(date.split('-')[0]);
};
