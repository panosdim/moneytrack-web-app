import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { categoriesState, expensesState, monthExpensesState } from '../model';
import { expenseType } from '../model/data';

export const ExpensesStatistics: React.FC = () => {
    const expenses = useRecoilValue(expensesState);
    const categories = useRecoilValue(categoriesState);
    const totalMonthExpenses = useRecoilValue(monthExpensesState);
    const [totalMonthExpensesPreviousYear, setTotalMonthExpensesPreviousYear] = useState<number>(0);
    const [biggestMonthExpenses, setBiggestMonthExpenses] = useState<expenseType[]>([]);

    useEffect(() => {
        setTotalMonthExpensesPreviousYear(
            expenses
                .filter((exp) =>
                    moment(exp.date).isBetween(
                        moment().subtract(1, 'year').startOf('month'),
                        moment().subtract(1, 'year').endOf('month'),
                        undefined,
                        '[]',
                    ),
                )
                .reduce((total, exp) => total + exp.amount, 0),
        );

        setBiggestMonthExpenses(
            expenses
                .filter((exp) =>
                    moment(exp.date).isBetween(moment().startOf('month'), moment().endOf('month'), undefined, '[]'),
                )
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5),
        );
    }, [expenses]);

    const categoryName = (categoryID: number): string => {
        const found = categories.find((cat) => cat.id === Number(categoryID));
        return found ? found.category : '';
    };

    return (
        <>
            <Card style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={`Total Expenses ${moment().format('MMMM YYYY')}`}
                            value={totalMonthExpenses}
                            decimalSeparator=','
                            groupSeparator='.'
                            precision={2}
                            valueStyle={{
                                color: totalMonthExpenses < totalMonthExpensesPreviousYear ? '#3f8600' : '#cf1322',
                            }}
                            prefix={
                                totalMonthExpenses > totalMonthExpensesPreviousYear ? (
                                    <ArrowUpOutlined />
                                ) : (
                                    <ArrowDownOutlined />
                                )
                            }
                            suffix='€'
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={`Total Expenses ${moment().subtract(1, 'year').format('MMMM YYYY')}`}
                            value={totalMonthExpensesPreviousYear}
                            decimalSeparator=','
                            groupSeparator='.'
                            precision={2}
                            suffix='€'
                        />
                    </Col>
                </Row>
            </Card>
            <Card>
                <h2>{`Biggest Expenses ${moment().format('MMMM YYYY')}`}</h2>
                {biggestMonthExpenses &&
                    biggestMonthExpenses.map((expense: expenseType) => {
                        return (
                            <Row key={expense.id} gutter={16}>
                                <Col span={6}>
                                    <Statistic
                                        value={expense.amount}
                                        decimalSeparator=','
                                        groupSeparator='.'
                                        valueStyle={{ color: '#cf1322' }}
                                        precision={2}
                                        suffix='€'
                                    />
                                </Col>
                                <Col span={6}>
                                    <h3 style={{ marginBottom: '0px', marginTop: '0.5em' }}>
                                        {categoryName(expense.category)}
                                    </h3>
                                </Col>
                                <Col span={12}>
                                    <h4 style={{ marginBottom: '0px', marginTop: '0.5em' }}>{expense.comment}</h4>
                                </Col>
                            </Row>
                        );
                    })}
            </Card>
        </>
    );
};
