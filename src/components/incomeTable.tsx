import React from 'react';
import { Table } from 'antd';
import { useGlobal } from 'reactn';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: date => date.format('MMMM YYYY'),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
    },
];

export const IncomeTable: React.FC = () => {
    const [income] = useGlobal('income');
    return <Table rowKey={record => record.id} dataSource={income} columns={columns} />;
};
