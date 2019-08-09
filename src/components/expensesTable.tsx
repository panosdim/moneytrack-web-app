import React, { useState } from 'react';
import { Table, Typography } from 'antd';
import { useGlobal } from 'reactn';
import { SearchProps } from './searchProps';
import { expenseType } from '../model';
import { FormModal, DateProps } from '.';
import { moneyFmt } from './moneyFormatter';

const { Title } = Typography;

export const ExpensesTable: React.FC = () => {
    const [expenses] = useGlobal('expenses');
    const [categories] = useGlobal('categories');
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState<expenseType>();
    const [total, setTotal] = useState<number>(expenses.reduce((total, exp) => total + exp.amount, 0));

    const handleClick = (record: expenseType) => {
        setData(record);
        setShowModal(true);
    };

    const onVisibleChange = (visible: boolean) => {
        setShowModal(visible);
        setData(undefined);
    };

    const categoryName = (categoryID: number): string => {
        const found = categories.find(cat => cat.id === Number(categoryID));
        return found ? found.category : '';
    };

    const calculateTotal = (
        _pagination: any,
        _filters: any,
        _sorter: any,
        extra: { currentDataSource: expenseType[] },
    ) => setTotal(extra.currentDataSource.reduce((total, exp) => total + exp.amount, 0));

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            ...DateProps(),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            className: 'column-money',
            sorter: (a: expenseType, b: expenseType) => a.amount - b.amount,
            render: (expense: number) => moneyFmt.format(expense),
            key: 'amount',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: categories.map(category => ({
                text: category.category,
                value: category.id,
            })),
            onFilter: (value: number, record: expenseType) => value === Number(record.category),
            render: (category: number) => categoryName(category),
            key: 'category',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            ...SearchProps('comment'),
        },
    ];

    return (
        <>
            <FormModal visible={showModal} selectedExpense={data} onVisibleChange={onVisibleChange} type='Expense' />
            <Table
                // @ts-ignore
                rowKey={record => record.id}
                dataSource={expenses}
                // @ts-ignore
                columns={columns}
                onRow={record => {
                    return {
                        onClick: () => {
                            handleClick(record);
                        }, // click row
                        onDoubleClick: () => {}, // double click row
                        onContextMenu: () => {}, // right button click row
                        onMouseEnter: () => {}, // mouse enter row
                        onMouseLeave: () => {}, // mouse leave row
                    };
                }}
                footer={() => (
                    <>
                        <Title level={4}>Total: {moneyFmt.format(total)}</Title>
                    </>
                )}
                onChange={calculateTotal}
            />
        </>
    );
};
