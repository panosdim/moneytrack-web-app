import React from 'react';
import { Card, Statistic, Icon } from 'antd';
import { useGlobal } from 'reactn';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

export const IncomeStatistics: React.FC = () => {
    const [income] = useGlobal('income');

    dayjs.extend(isBetween);
    console.log(
        dayjs()
            .startOf('month')
            .toString(),
    );
    console.log(
        dayjs()
            .endOf('month')
            .toString(),
    );

    console.log(dayjs('2019-05-20').isBetween(dayjs().startOf('month'), dayjs().endOf('month')));

    const totalIncome = income.reduce((total, inc) => {
        if (inc.date.isBetween(dayjs().startOf('month'), dayjs().endOf('month'))) {
            total += inc.amount;
            console.log(total);
        }
        return total;
    }, 0);

    console.log(totalIncome);

    return (
        <>
            <Card style={{ marginBottom: '16px' }}>
                <Statistic
                    title={`Total Income ${dayjs().format('MMMM YYYY')}`}
                    value={totalIncome}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<Icon type='arrow-up' />}
                    suffix='%'
                />
            </Card>
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
        </>
    );
};
