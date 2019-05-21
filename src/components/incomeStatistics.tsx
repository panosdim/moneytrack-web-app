import React from 'react';
import { Card, Statistic, Icon, Row, Col } from 'antd';
import { useGlobal } from 'reactn';
import { format, isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear, subYears } from 'date-fns';

export const IncomeStatistics: React.FC = () => {
    const [income] = useGlobal('income');

    const today = Date.now();
    const monthIncome = income.filter(inc =>
        isWithinInterval(inc.date, { start: startOfMonth(today), end: endOfMonth(today) }),
    );

    const totalMonthIncome = monthIncome.reduce((total, inc) => total + inc.amount, 0);

    const monthIncomePreviousYear = income.filter(inc =>
        isWithinInterval(inc.date, { start: startOfMonth(subYears(today, 1)), end: endOfMonth(subYears(today, 1)) }),
    );

    const totalMonthIncomePreviousYear = monthIncomePreviousYear.reduce((total, inc) => total + inc.amount, 0);

    const yearIncome = income.filter(inc =>
        isWithinInterval(inc.date, { start: startOfYear(today), end: endOfYear(today) }),
    );

    const totalYearIncome = yearIncome.reduce((total, inc) => total + inc.amount, 0);

    return (
        <>
            <Card style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={`Total Income ${format(today, 'MMMM yyyy')}`}
                            value={totalMonthIncome}
                            decimalSeparator=','
                            groupSeparator='.'
                            precision={2}
                            valueStyle={{
                                color: totalMonthIncome > totalMonthIncomePreviousYear ? '#3f8600' : '#cf1322',
                            }}
                            prefix={
                                totalMonthIncome > totalMonthIncomePreviousYear ? (
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
                            title={`Total Income ${format(subYears(today, 1), 'MMMM yyyy')}`}
                            value={totalMonthIncomePreviousYear}
                            decimalSeparator=','
                            groupSeparator='.'
                            precision={2}
                            suffix='€'
                        />
                    </Col>
                </Row>
            </Card>
            <Card>
                <Statistic
                    title={`Total Income ${format(today, 'yyyy')}`}
                    value={totalYearIncome}
                    decimalSeparator=','
                    groupSeparator='.'
                    precision={2}
                    suffix='€'
                />
            </Card>
        </>
    );
};
