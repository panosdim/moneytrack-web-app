import React, { useState } from 'react';
import { setGlobal, useGlobal } from 'reactn';
import { PageHeader, Tabs, Button, Typography, Icon, message, Spin } from 'antd';
import income from '../images/income.png';
import expense from '../images/expense.png';
import axios from 'axios';
import { IncomeTab, ExpensesTab, CategoriesTab, DashboardTab } from '.';
import { SavingStatistics, FormModal, CategoryHandle } from '../components';
import { tabType } from '../model';

const TabPane = Tabs.TabPane;
const { Title } = Typography;

export const MainPage: React.FC = () => {
    const [isLoggedIn] = useGlobal('isLoggedIn');
    const [selectedTab, setSelectedTab] = useState<tabType>('Dashboard');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [isIncomeFetched, setIncomeFetched] = useState(false);
    const [isExpensesFetched, setExpensesFetched] = useState(false);
    const [isCategoriesFetched, setCategoriesFetched] = useState(false);

    React.useEffect(() => {
        axios
            .get('income')
            .then(response => {
                setGlobal({ income: response.data.data });
                setIncomeFetched(true);
            })
            .catch(() => {
                message.error('Could not fetch income data. Please login again.');
                setGlobal({ isLoggedIn: false });
            });

        axios
            .get('expense')
            .then(response => {
                setGlobal({ expenses: response.data.data });
                setExpensesFetched(true);
            })
            .catch(() => {
                message.error('Could not fetch expense data. Please login again.');
                setGlobal({ isLoggedIn: false });
            });

        axios
            .get('category')
            .then(response => {
                setGlobal({ categories: response.data.data });
                setCategoriesFetched(true);
            })
            .catch(() => {
                message.error('Could not fetch categories data. Please login again.');
                setGlobal({ isLoggedIn: false });
            });
    }, [isLoggedIn]);

    React.useEffect(() => {
        if (isIncomeFetched && isExpensesFetched && isCategoriesFetched) {
            setLoading(false);
        }
    }, [isCategoriesFetched, isExpensesFetched, isIncomeFetched]);

    const onChange = activeKey => {
        setSelectedTab(activeKey);
    };

    const AddNew = () => {
        setShowModal(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setGlobal({ isLoggedIn: false });
    };

    const operations =
        selectedTab === 'Category' ? (
            <CategoryHandle />
        ) : (
            <Button onClick={AddNew} icon='plus' type='primary'>
                {selectedTab}
            </Button>
        );

    return (
        <>
            {isLoading ? (
                <div className='center'>
                    <Spin tip='Downloading data from server...' size='large' />
                </div>
            ) : (
                <>
                    <Title style={{ textAlign: 'center' }}>Money Track App</Title>
                    <FormModal
                        visible={showModal}
                        onVisibleChange={visible => setShowModal(visible)}
                        type={selectedTab}
                    />
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
                                tabBarExtraContent={selectedTab !== 'Dashboard' ? operations : null}
                            >
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type='dashboard' />
                                            Dashboard
                                        </span>
                                    }
                                    key='Dashboard'
                                >
                                    <DashboardTab />
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <img
                                                alt={''}
                                                style={{ marginRight: '8px' }}
                                                src={income}
                                                height={16}
                                                width={16}
                                            />
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
                                            <img
                                                alt={''}
                                                style={{ marginRight: '8px' }}
                                                src={expense}
                                                height={16}
                                                width={16}
                                            />
                                            Expenses
                                        </span>
                                    }
                                    key='Expense'
                                >
                                    <ExpensesTab />
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
                                    <CategoriesTab />
                                </TabPane>
                            </Tabs>
                        }
                    >
                        <SavingStatistics />
                    </PageHeader>
                </>
            )}
        </>
    );
};
