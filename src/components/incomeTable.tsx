import React, { useState } from 'react';
import { Table, Typography } from 'antd';
import { useGlobal } from 'reactn';
import { SearchProps } from './searchProps';
import { incomeType } from '../model';
import { FormModal, DateProps } from '.';
import { moneyFmt } from './moneyFormatter';
import moment from 'moment';

const { Title } = Typography;

export const IncomeTable: React.FC = () => {
    const [income] = useGlobal('income');
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState<incomeType>();
    const [total, setTotal] = useState<number>(income.reduce((total, inc) => total + inc.amount, 0));

    const handleClick = (record: incomeType) => {
        setData(record);
        setShowModal(true);
    };

    const onVisibleChange = (visible: boolean) => {
        setShowModal(visible);
        setData(undefined);
    };

    const calculateTotal = (
        _pagination: any,
        _filters: any,
        _sorter: any,
        extra: { currentDataSource: incomeType[] },
    ) => setTotal(extra.currentDataSource.reduce((total, inc) => total + inc.amount, 0));

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: Date) => moment(date).format('MMMM YYYY'),
            ...DateProps(),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            className: 'column-money',
            sorter: (a: incomeType, b: incomeType) => a.amount - b.amount,
            render: (income: number) => moneyFmt.format(income),
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
