import React, { useState } from 'react';
import { Table } from 'antd';
import { useGlobal } from 'reactn';
import { SearchProps } from './searchProps';
import { expenseType, categoryType } from '../model';
import moment from 'moment';
import { FormModal } from '.';

export const ExpensesTable: React.FC = () => {
    const [expenses] = useGlobal('expenses');
    const [categories] = useGlobal('categories');
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState<expenseType>();

    const dateFilter = (value: string, record: expenseType) => {
        if (value === 'This Month') {
            return moment(record.date).isBetween(moment().startOf('month'), moment().endOf('month'), undefined, '[]');
        }
        if (value === 'This Year') {
            return moment(record.date).isBetween(moment().startOf('year'), moment().endOf('year'), undefined, '[]');
        }
    };

    const handleClick = (record: expenseType) => {
        setData(record);
        setShowModal(true);
    };

    const onVisibleChange = (visible: boolean) => {
        setShowModal(visible);
        setData(undefined);
    };

    const categoryName = (categoryID: number): string => {
        const found = categories.find(cat => cat.id === categoryID);
        return found ? found.category : '';
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
            sorter: (a: expenseType, b: expenseType) => a.date.localeCompare(b.date),
            render: (date: Date) => moment(date).format('ddd D MMMM YYYY'),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            className: 'column-money',
            sorter: (a: expenseType, b: expenseType) => a.amount - b.amount,
            render: (expense: number) => expense + ' €',
            key: 'amount',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: categories.map(category => ({
                text: category.category,
                value: category.id,
            })),
            onFilter: (value: number, record: expenseType) => value === record.category,
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
            <FormModal visible={showModal} data={data} onVisibleChange={onVisibleChange} type='Expense' />
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
            />
        </>
    );
};
