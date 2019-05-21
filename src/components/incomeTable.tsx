import React from 'react';
import { Table } from 'antd';
import { useGlobal } from 'reactn';
import { SearchProps } from './searchProps';
import { format, getUnixTime, isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { incomeType } from '../model';

export const IncomeTable: React.FC = () => {
    const [income] = useGlobal('income');
    const today = Date.now();

    const dateFilter = (value: string, record: incomeType) => {
        if (value === 'This Month') {
            return isWithinInterval(record.date, { start: startOfMonth(today), end: endOfMonth(today) });
        }
        if (value === 'This Year') {
            return isWithinInterval(record.date, {
                start: startOfYear(today),
                end: endOfYear(today),
            });
        }
    };

    const handleClick = (record: incomeType) => {
        console.log('Click');
        console.log(record);
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            filters: [
                {
                    text: 'This Month',
                    value: 'This Month',
                },
                {
                    text: 'This Year',
                    value: 'This Year',
                },
            ],
            filterMultiple: false,
            onFilter: dateFilter,
            sorter: (a: incomeType, b: incomeType) => getUnixTime(a.date) - getUnixTime(b.date),
            render: (date: Date) => format(date, 'MMMM yyyy'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: (a: incomeType, b: incomeType) => a.amount - b.amount,
            key: 'amount',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            ...SearchProps('comment'),
        },
    ];

    return (
        <Table
            // @ts-ignore
            rowKey={record => record.id}
            dataSource={income}
            // @ts-ignore
            columns={columns}
            onRow={(record, rowIndex) => {
                return {
                    onClick: event => {
                        handleClick(record);
                    }, // click row
                    onDoubleClick: event => {}, // double click row
                    onContextMenu: event => {}, // right button click row
                    onMouseEnter: event => {}, // mouse enter row
                    onMouseLeave: event => {}, // mouse leave row
                };
            }}
        />
    );
};
