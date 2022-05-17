import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker } from 'antd';
import { FilterDropdownProps, SortOrder } from 'antd/es/table/interface';
import moment from 'moment';
import React from 'react';
import { expenseType, incomeType } from '../model/data';

export const DateProps = () => {
    const { RangePicker } = DatePicker;

    const handleSearch = (confirm) => {
        confirm();
    };

    const handleReset = (clearFilters, setSelectedKeys) => {
        clearFilters();
        setSelectedKeys([]);
    };

    const getRangeDates = (value: [string, string]): [moment.Moment, moment.Moment] => {
        if (value && value.length === 2) {
            return [moment(value[0]), moment(value[1])];
        } else {
            return [moment(), moment()];
        }
    };

    const getColumnDateProps = () => ({
        filterDropdown: (props: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <RangePicker
                    ranges={{
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Previous Month': [
                            moment().subtract(1, 'months').startOf('month'),
                            moment().subtract(1, 'months').endOf('month'),
                        ],
                        'This Year': [moment().startOf('year'), moment().endOf('year')],
                        'Previous Year': [
                            moment().subtract(1, 'years').startOf('year'),
                            moment().subtract(1, 'years').endOf('year'),
                        ],
                    }}
                    value={getRangeDates(props.selectedKeys[0] as unknown as [string, string])}
                    onChange={(_date, dateStrings) => props.setSelectedKeys(dateStrings ? dateStrings : [])}
                    style={{ marginBottom: 8, display: 'block' }}
                    format='D MMMM YYYY'
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(props.confirm)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(props.clearFilters, props.setSelectedKeys)}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        ),
        filterMultiple: false,
        defaultSortOrder: 'descend' as SortOrder,
        onFilter: (value: string | number | boolean, record: expenseType | incomeType) => {
            return moment(record.date).isBetween(value[0], value[1], 'day', '[]');
        },
        sorter: (a: expenseType | incomeType, b: expenseType | incomeType) => a.date.localeCompare(b.date),
    });

    return getColumnDateProps();
};
