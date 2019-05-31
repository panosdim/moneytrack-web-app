const months: string[] = [
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

export const getMonthName = (monthnum: number): string => {
    return months[monthnum - 1] || '';
};

export const getLastYears = (numOfYears: number): number[] => {
    const currentYear = new Date().getFullYear();
    let years: number[] = [];
    while (--numOfYears > -1) {
        years.push(currentYear - numOfYears);
    }

    return years;
};

export const getMonth = (date: string): number => {
    return Number(date.split('-')[1]);
};

export const getYear = (date: string): number => {
    return Number(date.split('-')[0]);
};
