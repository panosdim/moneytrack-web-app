import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { SelectParam } from 'antd/lib/menu';

const { Header } = Layout;
const { Title } = Typography;

export const MainPage: React.FC = () => {
    const handleMenu = (param: SelectParam) => {
        console.log(param);
    };

    return (
        <>
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <Title id='title' className='logo' level={2}>
                        Money Track
                    </Title>
                    <Menu
                        onSelect={handleMenu}
                        theme='dark'
                        mode='horizontal'
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key='1'>Income</Menu.Item>
                        <Menu.Item key='2'>Expense</Menu.Item>
                        <Menu.Item key='3'>Category</Menu.Item>
                        <Menu.Item key='4' style={{ float: 'right' }}>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Header>
            </Layout>
        </>
    );
};
