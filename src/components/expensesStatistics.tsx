import React, { useEffect, useState } from 'react';
import { Card, Statistic, Icon, Row, Col } from 'antd';
import { useGlobal } from 'reactn';
import moment from 'moment';

export const ExpensesStatistics: React.FC = () => {
    const [expenses] = useGlobal('expenses');
    const [totalMonthExpenses] = useGlobal('monthExpenses');
    const [totalMonthExpensesPreviousYear, setTotalMonthExpensesPreviousYear] = useState();
    const [totalYearExpenses] = useGlobal('yearExpenses');
    const [biggestMonthExpense, setBiggestMonthExpense] = useState();

    useEffect(() => {
        setTotalMonthExpensesPreviousYear(
            expenses
                .filter(exp =>
                    moment(exp.date).isBetween(
                        moment()
                            .subtract(1, 'year')
                            .startOf('month'),
                        moment()
                            .subtract(1, 'year')
                            .endOf('month'),
                        undefined,
                        '[]',
                    ),
                )
                .reduce((total, exp) => total + exp.amount, 0),
        );

        setBiggestMonthExpense(
            expenses
                .filter(exp =>
                    moment(exp.date).isBetween(moment().startOf('month'), moment().endOf('month'), undefined, '[]'),
                )
                .reduce((max, exp) => (exp.amount >= max ? exp.amount : max), 0),
        );
    }, [expenses]);

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
                                    <Icon type='arrow-up' />
                                ) : (
                                    <Icon type='arrow-down' />
                                )
                            }
                            suffix='€'
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={`Total Expenses ${moment()
                                .subtract(1, 'year')
                                .format('MMMM YYYY')}`}
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
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={`Total Expenses ${moment().format('YYYY')}`}
                            value={totalYearExpenses}
                            decimalSeparator=','
                            groupSeparator='.'
                            precision={2}
                            suffix='€'
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={`Biggest Expense ${moment().format('MMMM YYYY')}`}
                            value={biggestMonthExpense}
                            decimalSeparator=','
                            groupSeparator='.'
                            precision={2}
                            suffix='€'
                        />
                    </Col>
                </Row>
            </Card>
        </>
    );
};
