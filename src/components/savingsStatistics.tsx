import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Statistic } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    expensesState,
    incomesState,
    monthExpensesState,
    monthIncomeState,
    yearExpensesState,
    yearIncomeState,
} from '../model';

const { Meta } = Card;

export const SavingStatistics: React.FC = () => {
    const income = useRecoilValue(incomesState);
    const expenses = useRecoilValue(expensesState);
    const [totalMonthExpenses, setTotalMonthExpenses] = useRecoilState(monthExpensesState);
    const [totalYearExpenses, setTotalYearExpenses] = useRecoilState(yearExpensesState);
    const [totalMonthIncome, setTotalMonthIncome] = useRecoilState(monthIncomeState);
    const [totalYearIncome, setTotalYearIncome] = useRecoilState(yearIncomeState);

    useEffect(() => {
        setTotalMonthIncome(
            income
                .filter((inc) =>
                    moment(inc.date).isBetween(moment().startOf('month'), moment().endOf('month'), undefined, '[]'),
                )
                .reduce((total, inc) => total + inc.amount, 0),
        );

        setTotalYearIncome(
            income
                .filter((inc) =>
                    moment(inc.date).isBetween(moment().startOf('year'), moment().endOf('year'), undefined, '[]'),
                )
                .reduce((total, inc) => total + inc.amount, 0),
        );

        setTotalMonthExpenses(
            expenses
                .filter((exp) =>
                    moment(exp.date).isBetween(moment().startOf('month'), moment().endOf('month'), undefined, '[]'),
                )
                .reduce((total, exp) => total + exp.amount, 0),
        );

        setTotalYearExpenses(
            expenses
                .filter((exp) =>
                    moment(exp.date).isBetween(moment().startOf('year'), moment().endOf('year'), undefined, '[]'),
                )
                .reduce((total, exp) => total + exp.amount, 0),
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [income, expenses]);

    const monthSavings = totalMonthIncome - totalMonthExpenses;
    const yearSavings = totalYearIncome - totalYearExpenses;
    const percentage = Math.ceil((monthSavings * 100) / totalMonthIncome);

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card style={{ height: '100%' }}>
                    <Statistic
                        title={`Savings ${moment().format('MMMM YYYY')}`}
                        value={monthSavings}
                        decimalSeparator=','
                        groupSeparator='.'
                        precision={2}
                        valueStyle={{
                            color: monthSavings > 0 ? '#3f8600' : '#cf1322',
                        }}
                        prefix={monthSavings > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix='€'
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card style={{ height: '100%' }}>
                    <Statistic
                        title={`Savings ${moment().format('YYYY')}`}
                        value={yearSavings}
                        decimalSeparator=','
                        groupSeparator='.'
                        precision={2}
                        valueStyle={{
                            color: yearSavings > 0 ? '#3f8600' : '#cf1322',
                        }}
                        prefix={yearSavings > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix='€'
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card style={{ height: '100%' }}>
                    <Meta title={`Remain Money to Spend for ${moment().format('MMMM YYYY')}`} />
                    <p />
                    <Progress percent={percentage} />
                </Card>
            </Col>
        </Row>
    );
};
