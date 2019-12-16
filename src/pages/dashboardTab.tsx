import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGlobal } from 'reactn';
import { moneyFmt, getMonthName, getLastYears, getMonth, getYear } from '../components';
import { Typography } from 'antd';

type overviewChartType = {
    name: string;
    income: number;
    expenses: number;
    savings: number;
};

type monthlyChartType = {
    name?:
        | 'January'
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
    [key: string]: number | string | undefined;
};

const { Title } = Typography;

export const DashboardTab: React.FC = () => {
    const [income] = useGlobal('income');
    const [expenses] = useGlobal('expenses');

    const incomePerYear = income.reduce((years, inc) => {
        const year = getYear(inc.date);
        years[year] = (years[year] || 0) + inc.amount;
        return years;
    }, {});

    const expensesPerYear = expenses.reduce((years, exp) => {
        const year = getYear(exp.date);
        years[year] = (years[year] || 0) + exp.amount;
        return years;
    }, {});

    const overviewData: overviewChartType[] = [];
    for (const key in incomePerYear) {
        const savings = incomePerYear[key] - expensesPerYear[key];
        overviewData.push({
            name: key,
            income: incomePerYear[key] ? incomePerYear[key] : 0,
            expenses: expensesPerYear[key] ? expensesPerYear[key] : 0,
            savings: savings ? savings : 0,
        });
    }

    const incomePerMonth = income.reduce((months, inc) => {
        const month = getMonth(inc.date);
        const year = getYear(inc.date);
        if (!months[month]) {
            months[month] = {};
        }

        months[month][year] = (months[month][year] || 0) + inc.amount;
        return months;
    }, {});

    const monthlyIncomeData: monthlyChartType[] = Object.keys(incomePerMonth)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => ({
            name: getMonthName(Number(key)),
            ...incomePerMonth[key],
        }));

    const expensesPerMonth = expenses.reduce((months, exp) => {
        const month = getMonth(exp.date);
        const year = getYear(exp.date);
        if (!months[month]) {
            months[month] = {};
        }

        months[month][year] = (months[month][year] || 0) + exp.amount;
        return months;
    }, {});

    const monthlyExpensesData: monthlyChartType[] = Object.keys(expensesPerMonth)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => ({
            name: getMonthName(Number(key)),
            ...expensesPerMonth[key],
        }));

    const monthlySavingsData: monthlyChartType[] = [];
    for (const month in monthlyIncomeData) {
        let row: Partial<monthlyChartType> = {};

        for (const year in monthlyIncomeData[month]) {
            const income =
                monthlyIncomeData[month] && monthlyIncomeData[month][year] ? Number(monthlyIncomeData[month][year]) : 0;
            const expenses =
                monthlyExpensesData[month] && monthlyExpensesData[month][year]
                    ? Number(monthlyExpensesData[month][year])
                    : 0;
            const obj = year !== 'name' ? { [year]: income - expenses } : { name: monthlyIncomeData[month][year] };

            row = { ...row, ...obj };
        }

        monthlySavingsData.push(row);
    }

    const YEARS = getLastYears(4);

    return (
        <>
            <Title>Overview Per Year</Title>
            <div style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={overviewData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip formatter={(value: number) => moneyFmt.format(value)} />
                        <Legend />
                        <Bar dataKey='income' fill='#5bc0de' />
                        <Bar dataKey='expenses' fill='#d9534f' />
                        <Bar dataKey='savings' fill='#5cb85c' />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <Title>Savings Per Month</Title>
            <div style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={monthlySavingsData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip formatter={(value: number) => moneyFmt.format(value)} />
                        <Legend />
                        <Bar dataKey={YEARS[0]} fill='#428bca' />
                        <Bar dataKey={YEARS[1]} fill='#5cb85c' />
                        <Bar dataKey={YEARS[2]} fill='#d9534f' />
                        <Bar dataKey={YEARS[3]} fill='#5bc0de' />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <Title>Expenses Per Month</Title>
            <div style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={monthlyExpensesData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip formatter={(value: number) => moneyFmt.format(value)} />
                        <Legend />
                        <Bar dataKey={YEARS[0]} fill='#428bca' />
                        <Bar dataKey={YEARS[1]} fill='#5cb85c' />
                        <Bar dataKey={YEARS[2]} fill='#d9534f' />
                        <Bar dataKey={YEARS[3]} fill='#5bc0de' />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <Title>Income Per Month</Title>
            <div style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={monthlyIncomeData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip formatter={(value: number) => moneyFmt.format(value)} />
                        <Legend />
                        <Bar dataKey={YEARS[0]} fill='#428bca' />
                        <Bar dataKey={YEARS[1]} fill='#5cb85c' />
                        <Bar dataKey={YEARS[2]} fill='#d9534f' />
                        <Bar dataKey={YEARS[3]} fill='#5bc0de' />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};
