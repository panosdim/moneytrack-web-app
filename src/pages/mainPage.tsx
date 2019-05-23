import React, { useState } from 'react';
import { setGlobal, useGlobal } from 'reactn';
import { PageHeader, Tabs, Button, Typography, Icon, message } from 'antd';
import income from '../images/income.png';
import expense from '../images/expense.png';
import axios from 'axios';
import { IncomeTab } from '.';
import { SavingStatistics, FormModal } from '../components';
import { tabType } from '../model';

const TabPane = Tabs.TabPane;
const { Title } = Typography;

const logout = e => {
    e.preventDefault();

    localStorage.removeItem('token');
    setGlobal({ isLoggedIn: false });
};

export const MainPage: React.FC = () => {
    const [isLoggedIn] = useGlobal('isLoggedIn');
    const [selectedTab, setSelectedTab] = useState<tabType>('Income');
    const [showModal, setShowModal] = useState(false);

    React.useEffect(() => {
        axios
            .get('income')
            .then(response => {
                setGlobal({ income: response.data.data });
            })
            .catch(() => {
                message.error('Could not fetch income data. Please Login Again.');
                setGlobal({ isLoggedIn: false });
            });
    }, [isLoggedIn]);

    const onChange = activeKey => {
        setSelectedTab(activeKey);
    };

    const AddNew = () => {
        setShowModal(true);
    };

    const operations = (
        <Button onClick={AddNew} icon='plus' type='primary'>
            {selectedTab}
        </Button>
    );

    return (
        <>
            <Title style={{ textAlign: 'center' }}>Money Track App</Title>
            <FormModal visible={showModal} onVisibleChange={visible => setShowModal(visible)} type={selectedTab} />
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
                <SavingStatistics />
            </PageHeader>
        </>
    );
};
