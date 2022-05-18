import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker } from 'antd';
import { FilterDropdownProps, SortOrder } from 'antd/es/table/interface';
import moment from 'moment';
import React from 'react';
import { expenseType, incomeType } from '../model/data';

export const DateProps = () => {
    const { RangePicker } = DatePicker;
    let start: string, end: string;

    const handleSearch = (confirm) => {
        confirm();
    };

    const handleReset = (clearFilters, setSelectedKeys) => {
        clearFilters();
        setSelectedKeys([]);
    };

    const getRangeDates = (value: [string, string]): [moment.Moment | null, moment.Moment | null] => {
        if (value && value.length === 2) {
            return [moment(value[0]), moment(value[1])];
        } else {
            return [null, null];
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
                    value={getRangeDates(props.selectedKeys as unknown as [string, string])}
                    onChange={(_date, dateStrings) => props.setSelectedKeys(dateStrings ? dateStrings : [])}
                    style={{ marginBottom: 8 }}
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
            if (start && !end) {
                end = value as string;
            } else if (!start && !end) {
                start = value as string;
            } else {
                return moment(record.date).isBetween(moment(start), moment(end), 'day', '[]');
            }
            return false;
        },
        sorter: (a: expenseType | incomeType, b: expenseType | incomeType) => a.date.localeCompare(b.date),
    });

    return getColumnDateProps();
};
