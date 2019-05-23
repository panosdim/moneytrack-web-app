import React, { useEffect, useState } from 'react';
import { Card, Statistic, Icon, Row, Col } from 'antd';
import { useGlobal } from 'reactn';
import moment from 'moment';

export const IncomeStatistics: React.FC = () => {
    const [income] = useGlobal('income');
    const [totalMonthIncome, setTotalMonthIncome] = useState();
    const [totalMonthIncomePreviousYear, setTotalMonthIncomePreviousYear] = useState();
    const [totalYearIncome, setTotalYearIncome] = useState();

    useEffect(() => {
        setTotalMonthIncome(
            income
                .filter(inc =>
                    moment(inc.date).isBetween(moment().startOf('month'), moment().endOf('month'), undefined, '[]'),
                )
                .reduce((total, inc) => total + inc.amount, 0),
        );

        setTotalMonthIncomePreviousYear(
            income
                .filter(inc =>
                    moment(inc.date).isBetween(
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
                .reduce((total, inc) => total + inc.amount, 0),
        );

        setTotalYearIncome(
            income
                .filter(inc =>
                    moment(inc.date).isBetween(moment().startOf('year'), moment().endOf('year'), undefined, '[]'),
                )
                .reduce((total, inc) => total + inc.amount, 0),
        );
    }, [income]);

    return (
        <>
            <Card style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={`Total Income ${moment().format('MMMM YYYY')}`}
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
                            title={`Total Income ${moment()
                                .subtract(1, 'year')
                                .format('MMMM YYYY')}`}
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
                    title={`Total Income ${moment().format('YYYY')}`}
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
