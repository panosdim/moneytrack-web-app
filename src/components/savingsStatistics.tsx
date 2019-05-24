import React, { useEffect, useState } from 'react';
import { Card, Statistic, Icon, Row, Col } from 'antd';
import { useGlobal } from 'reactn';
import moment from 'moment';

export const SavingStatistics: React.FC = () => {
    const [income] = useGlobal('income');
    const [expenses] = useGlobal('expenses');
    const [TotalMonthSavings, setTotalMonthSavings] = useState();
    const [totalMonthIncomePreviousYear, setTotalMonthIncomePreviousYear] = useState();
    const [totalYearIncome, setTotalYearIncome] = useState();

    useEffect(() => {
        setTotalMonthSavings(
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
    }, [income, expenses]);

    return (
        <Row gutter={16}>
            <Col span={12}>
                <Card>
                    <Statistic
                        title='Active'
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<Icon type='arrow-up' />}
                        suffix='%'
                    />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                    <Statistic
                        title='Idle'
                        value={9.3}
                        precision={2}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<Icon type='arrow-down' />}
                        suffix='%'
                    />
                </Card>
            </Col>
        </Row>
    );
};
