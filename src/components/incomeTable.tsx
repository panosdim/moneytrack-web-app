import React from 'react';
import { Table } from 'antd';
import { useGlobal } from 'reactn';
import { SearchProps } from './searchProps';
import { Dayjs } from 'dayjs';

export const IncomeTable: React.FC = () => {
    const [income] = useGlobal('income');

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.unix() - b.date.unix(),
            render: (date: Dayjs) => date.format('MMMM YYYY'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: (a, b) => a.amount - b.amount,
            key: 'amount',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            ...SearchProps('comment'),
        },
    ];

    return <Table rowKey={record => record.id} dataSource={income} columns={columns} pagination={false} />;
};
