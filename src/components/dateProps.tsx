import React from 'react';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import { expenseType } from '../model';

export const DateProps = () => {
    const { RangePicker } = DatePicker;

    const handleSearch = confirm => {
        confirm();
    };

    const handleReset = (clearFilters, setSelectedKeys) => {
        clearFilters();
        setSelectedKeys([]);
    };

    const getColumnDateProps = () => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <RangePicker
                    ranges={{
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Previous Month': [
                            moment()
                                .subtract(1, 'months')
                                .startOf('month'),
                            moment()
                                .subtract(1, 'months')
                                .endOf('month'),
                        ],
                        'This Year': [moment().startOf('year'), moment().endOf('year')],
                        'Previous Year': [
                            moment()
                                .subtract(1, 'years')
                                .startOf('year'),
                            moment()
                                .subtract(1, 'years')
                                .endOf('year'),
                        ],
                    }}
                    value={selectedKeys[0]}
                    onChange={date => setSelectedKeys(date ? [date] : [])}
                    locale={{ firstWeekDay: 1 }}
                    style={{ marginBottom: 8, display: 'block' }}
                    format='D MMMM YYYY'
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(confirm)}
                        icon='search'
                        size='small'
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters, setSelectedKeys)}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        ),
        filterMultiple: false,
        defaultSortOrder: 'descend',
        onFilter: (value: string, record: expenseType) => {
            return moment(record.date).isBetween(value[0], value[1], undefined, '[]');
        },
        sorter: (a: expenseType, b: expenseType) => a.date.localeCompare(b.date),
    });

    return getColumnDateProps();
};
