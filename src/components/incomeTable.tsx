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
            return moment(record.date).isBetween(moment().startOf('month'), moment().endOf('month'));
        }
        if (value === 'This Year') {
            return moment(record.date).isBetween(moment().startOf('year'), moment().endOf('year'));
        }
    };

    const handleClick = (record: incomeType) => {
        setData(record);
        setShowModal(true);
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
            sorter: (a: incomeType, b: incomeType) => moment(a.date).unix() - moment(b.date).unix(),
            render: (date: Date) => moment(date).format('MMMM YYYY'),
            defaultSortOrder: 'descend',
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
        <>
            <FormModal
                visible={showModal}
                data={data}
                onVisibleChange={visible => setShowModal(visible)}
                type='Income'
            />
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
