import { Col, List, Modal, Row, Select, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { Bar, BarChart, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useRecoilValue } from 'recoil';
import {
    getLastYears,
    getMonth,
    getMonthName,
    getShortMonthName,
    getYear,
    moneyFmt,
    MONTHS,
    shortMonthNames,
} from '../components';
import { categoriesState, expensesState, incomesState } from '../model';
import { categoryType, expenseType } from '../model/data';

const { Option } = Select;
const { Title, Text } = Typography;
type monthlyChartType = {
    name: shortMonthNames;
    value: number;
};

type categoriesChartType = {
    name: categoryType['category'];
    value: number;
};

export const DashboardTab: React.FC = () => {
    const income = useRecoilValue(incomesState);
    const expenses = useRecoilValue(expensesState);
    const categories = useRecoilValue(categoriesState);
    const [year, setYear] = useState(getLastYears(4).slice(-1)[0]);
    const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);

    const categoryName = (categoryID: number): string => {
        const found = categories.find((cat) => cat.id === Number(categoryID));
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
    const monthlyExpensesPerCategoriesData: categoriesChartType[] = Object.keys(monthlyExpensesPerCategories).map(
        (key) => ({
            name: key,
            value: monthlyExpensesPerCategories[key],
        }),
    );

    const YEARS = getLastYears(4);
    const handleYearChange = (value) => {
        setYear(value);
    };

    const handleMonthChange = (value) => {
        setMonth(value);
    };

    const handleClick = (data, index) => {
        console.log(data);
        console.log(index);
        const cat = categories.find((cat) => cat.category === data.name);
        if (!cat) {
            return;
        }
        const catId = cat.id;
        const expensesForCat = expenses
            .filter((exp) => {
                const itmMonth = getMonthName(getMonth(exp.date));
                const itmYear = getYear(exp.date);
                return itmMonth === month && itmYear === year && catId === Number(exp.category);
            })
            .sort((a: expenseType, b: expenseType) => b.amount - a.amount);
        Modal.info({
            title: `Expenses for ${data.name}`,
            content: (
                <div>
                    <List
                        size='small'
                        itemLayout='horizontal'
                        dataSource={expensesForCat}
                        footer={
                            <div>
                                <Title level={4}>
                                    Total:{' '}
                                    <Text type='danger' strong>
                                        {moneyFmt.format(expensesForCat.reduce((total, exp) => total + exp.amount, 0))}
                                    </Text>
                                </Title>
                            </div>
                        }
                        renderItem={(item) => (
                            <List.Item>
                                <Text mark>{moment(item.date).format('DD MMMM YYYY')}</Text>
                                &nbsp;&nbsp;&nbsp;
                                <Text type='danger' strong>
                                    {moneyFmt.format(item.amount)}
                                </Text>
                                &nbsp;&nbsp;&nbsp;
                                <Text type='secondary'>{item.comment}</Text>
                            </List.Item>
                        )}
                    />
                </div>
            ),
            onOk() {},
        });
    };

    return (
        <>
            <Row style={{ padding: '16px' }}>
                <Col xs={2}>
                    <Select defaultValue={year} style={{ width: 120 }} onChange={handleYearChange}>
                        {YEARS.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={4}>
                    <Select defaultValue={month} style={{ width: 120 }} onChange={handleMonthChange}>
                        {MONTHS.map((month) => (
                            <Option key={month} value={month}>
                                {month}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row>
                <Title level={3} style={{ textAlign: 'center' }}>
                    Expenses per categories
                </Title>
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
                            <XAxis dataKey='name' interval={0} />
                            <YAxis unit={'\u20AC'} />
                            <Tooltip formatter={(value: number) => moneyFmt.format(value)} />
                            <Bar dataKey='value' fill='#428bca' onClick={handleClick} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Row>
            <Row>
                <Title level={3} style={{ textAlign: 'center' }}>
                    Savings per month
                </Title>
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
                            <XAxis dataKey='name' padding={{ left: 10, right: 10 }} />
                            <YAxis unit={'\u20AC'} />
                            <ReferenceLine y={0} stroke='red' />
                            <Tooltip formatter={(value: number) => moneyFmt.format(value)} />
                            <Line type='monotone' dataKey='value' stroke='#8884d8' strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Row>
        </>
    );
};
