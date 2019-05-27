import React, { useState } from 'react';
import { Table } from 'antd';
import { useGlobal } from 'reactn';
import { SearchProps } from './searchProps';
import { incomeType } from '../model';
import moment from 'moment';
import { FormModal } from '.';

export const IncomeTable: React.FC = () => {
    const [income] = useGlobal('income');
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState<incomeType>();

    const dateFilter = (value: string, record: incomeType) => {
        if (value === 'This Month') {
            return moment(record.date).isBetween(moment().startOf('month'), moment().endOf('month'), undefined, '[]');
        }
        if (value === 'This Year') {
            return moment(record.date).isBetween(moment().startOf('year'), moment().endOf('year'), undefined, '[]');
        }
    };

    const handleClick = (record: incomeType) => {
        setData(record);
        setShowModal(true);
    };

    const onVisibleChange = (visible: boolean) => {
        setShowModal(visible);
        setData(undefined);
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
            sorter: (a: incomeType, b: incomeType) => a.date.localeCompare(b.date),
            render: (date: Date) => moment(date).format('MMMM YYYY'),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            className: 'column-money',
            sorter: (a: incomeType, b: incomeType) => a.amount - b.amount,
            render: (income: number) => income + ' €',
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
        <>
            <FormModal visible={showModal} selectedIncome={data} onVisibleChange={onVisibleChange} type='Income' />
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
        </>
    );
};
