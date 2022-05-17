import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

export const SearchProps = (dataIndex) => {
    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: (props: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={props.selectedKeys[0]}
                    onChange={(e) => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(props.selectedKeys, props.confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type='primary'
                    onClick={() => handleSearch(props.selectedKeys, props.confirm)}
                    icon={<SearchOutlined />}
                    size='small'
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => handleReset(props.clearFilters)} size='small' style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .includes(
                    value
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, ''),
                ),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => (searchInput as any).current.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                sanitize={(text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}
                textToHighlight={text.toString()}
            />
        ),
    });

    return getColumnSearchProps(dataIndex);
};
