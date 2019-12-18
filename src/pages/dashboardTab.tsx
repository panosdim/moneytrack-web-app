import React, { useState } from 'react';
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    TooltipFormatter,
    XAxis,
    YAxis
} from 'recharts';
import { useGlobal } from 'reactn';
import {
    getLastYears,
    getMonth,
    getMonthName,
    getShortMonthName,
    getYear,
    moneyFmt,
    MONTHS,
    shortMonthNames
} from '../components';
import { Col, Row, Select, Typography } from 'antd';
import { categoryType, expenseType } from '../model';

const { Option } = Select;
const { Title } = Typography;
type monthlyChartType = {
    name: shortMonthNames;
    value: number;
};

type categoriesChartType = {
    name: categoryType['category'],
    value: number
}

export const DashboardTab: React.FC = () => {
    const [income] = useGlobal('income');
    const [expenses] = useGlobal('expenses');
    const [categories] = useGlobal('categories');
    const [year, setYear] = useState(getLastYears(4).slice(-1)[0]);
    const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);

    const categoryName = (categoryID: number): string => {
        const found = categories.find(cat => cat.id === Number(categoryID));
        return found ? found.category : '';
    };

    const organizePerMonth = (items: any[]) => {
        return items.reduce((months, itm) => {
            const itmMonth = getMonth(itm.date);
            const itmYear = getYear(itm.date);
            if (itmYear === year) {
                months[itmMonth] = (months[itmMonth] || 0) + itm.amount;
            }

            return months;
        }, {});
    };

    const organizePerCategories = (items: expenseType[]) => {
        return items.reduce((expPerCategories, itm) => {
            const itmMonth = getMonthName(getMonth(itm.date));
            const itmYear = getYear(itm.date);
            if (itmMonth === month && itmYear === year) {
                const category = categoryName(itm.category);
                expPerCategories[category] = (expPerCategories[category] || 0) + itm.amount;
            }

            return expPerCategories;
        }, {});
    };

    const incomePerMonth = organizePerMonth(income);
    const expensesPerMonth = organizePerMonth(expenses);
    const savingsPerMonthData: monthlyChartType[] = Object.keys(expensesPerMonth).map((key) => {
        const income = incomePerMonth[key] ? Number(incomePerMonth[key]) : 0;
        const expenses = expensesPerMonth[key] ? Number(expensesPerMonth[key]) : 0;
        return { name: getShortMonthName(Number(key)), value: income - expenses };
    });

    const monthlyExpensesPerCategories = organizePerCategories(expenses);
    const monthlyExpensesPerCategoriesData: categoriesChartType[] = Object.keys(monthlyExpensesPerCategories)
        .map(key => ({
            name: key,
            value: monthlyExpensesPerCategories[key],
        }));

    const YEARS = getLastYears(4);
    const handleYearChange = (value) => {
        setYear(value);
    };

    const handleMonthChange = (value) => {
        setMonth(value);
    };

    return (
        <>
            <Row style={{ padding: '16px' }}>
                <Col xs={2}><Select defaultValue={year} style={{ width: 120 }} onChange={handleYearChange}>
                    {YEARS.map(year => <Option key={year} value={year}>{year}</Option>)}
                </Select></Col>
                <Col xs={4}><Select defaultValue={month} style={{ width: 120 }} onChange={handleMonthChange}>
                    {MONTHS.map(month => <Option key={month} value={month}>{month}</Option>)}
                </Select></Col>
            </Row>
            <Row>
                <Col span={16}>
                    <Title level={3} style={{ textAlign: 'center' }}>Expenses per categories</Title>
                    <div style={{ width: '100%', height: 500 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={monthlyExpensesPerCategoriesData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <XAxis dataKey='name' interval={0}/>
                                <YAxis unit={'\u20AC'}/>
                                <Tooltip formatter={((value: number) => moneyFmt.format(value)) as TooltipFormatter}/>
                                <Bar dataKey="value" fill='#428bca'/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
                <Col span={8}>
                    <Title level={3} style={{ textAlign: 'center' }}>Savings per month</Title>
                    <div style={{ width: '100%', height: 500 }}>
                        <ResponsiveContainer>
                            <LineChart
                                data={savingsPerMonthData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <XAxis dataKey='name' padding={{ left: 10, right: 10 }}/>
                                <YAxis unit={'\u20AC'}/>
                                <ReferenceLine y={0} stroke="red"/>
                                <Tooltip
                                    formatter={((value: number) => moneyFmt.format(value)) as TooltipFormatter}/>
                                <Line type="monotone" dataKey='value' stroke="#8884d8" strokeWidth={2}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>
        </>
    );
};
