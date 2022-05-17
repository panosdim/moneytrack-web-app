import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { incomesState, monthIncomeState, yearIncomeState } from '../model';

export const IncomeStatistics: React.FC = () => {
    const income = useRecoilValue(incomesState);
    const totalMonthIncome = useRecoilValue(monthIncomeState);
    const totalYearIncome = useRecoilValue(yearIncomeState);
    const [totalMonthIncomePreviousYear, setTotalMonthIncomePreviousYear] = useState<number>(0);

    useEffect(() => {
        setTotalMonthIncomePreviousYear(
            income
                .filter((inc) =>
                    moment(inc.date).isBetween(
                        moment().subtract(1, 'year').startOf('month'),
                        moment().subtract(1, 'year').endOf('month'),
                        undefined,
                        '[]',
                    ),
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
                            title={`Total Income ${moment().subtract(1, 'year').format('MMMM YYYY')}`}
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
