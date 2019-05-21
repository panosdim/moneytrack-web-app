import React, { useState } from 'react';
import { setGlobal, useGlobal } from 'reactn';
import { PageHeader, Tabs, Button, Statistic, Row, Col, Typography, Icon, Card, message } from 'antd';
import income from '../images/income.png';
import expense from '../images/expense.png';
import axios from 'axios';
import { IncomeTab } from '.';

const TabPane = Tabs.TabPane;
const { Title } = Typography;

const logout = e => {
    e.preventDefault();

    localStorage.removeItem('token');
    setGlobal({ isLoggedIn: false });
};

export const MainPage: React.FC = () => {
    const [isLoggedIn] = useGlobal('isLoggedIn');
    const [selectedTab, setSelectedTab] = useState('Income');

    React.useEffect(() => {
        axios
            .get('income')
            .then(response => {
                const income = response.data.data.map(inc => ({
                    ...inc,
                    date: new Date(inc.date),
                }));
                setGlobal({ income: income });
            })
            .catch(() => {
                message.error('Could not fetch income data. Please Login Again.');
                setGlobal({ isLoggedIn: false });
            });
    }, [isLoggedIn]);

    const onChange = activeKey => {
        setSelectedTab(activeKey);
    };

    const addIncome = e => {
        e.preventDefault();

        console.log(selectedTab);
    };

    const operations = (
        <Button onClick={addIncome} icon='plus' type='primary'>
            {selectedTab}
        </Button>
    );

    return (
        <>
            <Title style={{ textAlign: 'center' }}>Money Track App</Title>
            <PageHeader
                backIcon={false}
                title='Dashboard'
                subTitle='An Overview of your Savings'
                extra={[
                    <Button key='1' type='danger' icon='logout' onClick={logout}>
                        Logout
                    </Button>,
                ]}
                footer={
                    <Tabs
                        defaultActiveKey={selectedTab}
                        size='large'
                        onChange={onChange}
                        tabBarExtraContent={operations}
                    >
                        <TabPane
                            tab={
                                <span>
                                    <img alt={''} style={{ marginRight: '8px' }} src={income} height={16} width={16} />
                                    Income
                                </span>
                            }
                            key='Income'
                        >
                            <IncomeTab />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <img alt={''} style={{ marginRight: '8px' }} src={expense} height={16} width={16} />
                                    Expenses
                                </span>
                            }
                            key='Expense'
                        >
                            Expenses
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <Icon type='tags' />
                                    Categories
                                </span>
                            }
                            key='Category'
                        >
                            Categories
                        </TabPane>
                    </Tabs>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title='Active'
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<Icon type='arrow-up' />}
                                suffix='%'
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title='Idle'
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<Icon type='arrow-down' />}
                                suffix='%'
                            />
                        </Card>
                    </Col>
                </Row>
            </PageHeader>
        </>
    );
};
