import React from 'react';
import { Table } from 'antd';
import { GlobalState } from '../model';
import { useGlobal } from 'reactn';

const dataSource = [
    {
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
    },
    {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
    },
];

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
    return <Table dataSource={dataSource} columns={columns} />;
};
