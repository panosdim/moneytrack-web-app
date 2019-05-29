import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGlobal } from 'reactn';

type overviewChartType = {
    name: string;
    income: string;
    expenses: string;
    savings: string;
};

export const DashboardTab: React.FC = () => {
    const [income] = useGlobal('income');
    const [expenses] = useGlobal('expenses');

    const incomePerYear = income.reduce((years, inc) => {
        years[inc.date.split('-')[0]] = (years[inc.date.split('-')[0]] || 0) + inc.amount;
        return years;
    }, {});

    const expensesPerYear = expenses.reduce((years, exp) => {
        years[exp.date.split('-')[0]] = (years[exp.date.split('-')[0]] || 0) + exp.amount;
        return years;
    }, {});

    const newData: overviewChartType[] = [];
    for (const key in incomePerYear) {
        const savings = incomePerYear[key] - expensesPerYear[key];
        newData.push({
            name: key,
            income: incomePerYear[key] ? incomePerYear[key].toFixed(2) : '',
            expenses: expensesPerYear[key] ? expensesPerYear[key].toFixed(2) : '',
            savings: savings ? savings.toFixed(2) : '',
        });
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={newData}
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
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='income' fill='#8884d8' />
                    <Bar dataKey='expenses' fill='#82ca9d' />
                    <Bar dataKey='savings' />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
