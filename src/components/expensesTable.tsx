import { Table, Typography } from 'antd';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { DateProps, ExpenseForm } from '.';
import { categoriesState, expensesState } from '../model';
import { expenseType } from '../model/data';
import { moneyFmt } from './moneyFormatter';
import { SearchProps } from './searchProps';

const { Title } = Typography;

export const ExpensesTable: React.FC = () => {
    const expenses = useRecoilValue(expensesState);
    const categories = useRecoilValue(categoriesState);
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
        const found = categories.find((cat) => cat.id === Number(categoryID));
        return found ? found.category : '';
    };

    const calculateTotal = (
        _pagination: any,
        _filters: any,
        _sorter: any,
        extra: { currentDataSource: expenseType[] },
    ) => setTotal(extra.currentDataSource.reduce((total, exp) => total + exp.amount, 0));

    const columns: ColumnProps<expenseType>[] = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: Date) => moment(date).format('ddd D MMMM YYYY'),
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
            filters: categories.map((category) => ({
                text: category.category,
                value: String(category.id),
            })),
            onFilter: (value: number | string | boolean, record: expenseType) =>
                String(value) === String(record.category),
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
            <ExpenseForm visible={showModal} selectedExpense={data} onVisibleChange={onVisibleChange} />
            <Table<expenseType>
                rowKey={(record) => String(record.id)}
                dataSource={expenses}
                columns={columns}
                onRow={(record) => {
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
                pagination={{ pageSize: 100 }}
                scroll={{ y: 450 }}
                size='small'
            />
        </>
    );
};
