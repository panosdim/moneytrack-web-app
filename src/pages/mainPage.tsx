import { DashboardOutlined, LogoutOutlined, PlusOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, message, PageHeader, Spin, Tabs } from 'antd';
import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CategoriesTab, DashboardTab, ExpensesTab, IncomeTab } from '.';
import { CategoryHandle, FormModal, SavingStatistics } from '../components';
import expense from '../images/expense.png';
import income from '../images/income.png';
import { categoriesState, expensesState, incomesState, loginState } from '../model';
import { tabType } from '../model/data';

const TabPane = Tabs.TabPane;

export const MainPage: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useRecoilState(loginState);
    const setIncomes = useSetRecoilState(incomesState);
    const setExpenses = useSetRecoilState(expensesState);
    const setCategories = useSetRecoilState(categoriesState);
    const [selectedTab, setSelectedTab] = useState<tabType>('Dashboard');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [isIncomeFetched, setIncomeFetched] = useState(false);
    const [isExpensesFetched, setExpensesFetched] = useState(false);
    const [isCategoriesFetched, setCategoriesFetched] = useState(false);

    React.useEffect(() => {
        axios
            .get('income')
            .then((response: AxiosResponse) => {
                setIncomes(response.data);
                setIncomeFetched(true);
            })
            .catch(() => {
                message.error('Could not fetch income data. Please login again.');
                setLoggedIn(false);
            });

        axios
            .get('expense')
            .then((response: AxiosResponse) => {
                setExpenses(response.data);
                setExpensesFetched(true);
            })
            .catch(() => {
                message.error('Could not fetch expense data. Please login again.');
                setLoggedIn(false);
            });

        axios
            .get('category')
            .then((response: AxiosResponse) => {
                setCategories(response.data);
                setCategoriesFetched(true);
            })
            .catch(() => {
                message.error('Could not fetch categories data. Please login again.');
                setLoggedIn(false);
            });
    }, [isLoggedIn]);

    React.useEffect(() => {
        if (isIncomeFetched && isExpensesFetched && isCategoriesFetched) {
            setLoading(false);
        }
    }, [isCategoriesFetched, isExpensesFetched, isIncomeFetched]);

    const onChange = (activeKey) => {
        setSelectedTab(activeKey);
    };

    const AddNew = () => {
        setShowModal(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
    };

    const operations =
        selectedTab === 'Category' ? (
            <CategoryHandle />
        ) : (
            <Button onClick={AddNew} icon={<PlusOutlined />} type='primary'>
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
                    <FormModal
                        visible={showModal}
                        onVisibleChange={(visible) => setShowModal(visible)}
                        type={selectedTab}
                    />
                    <PageHeader
                        backIcon={false}
                        title='Dashboard'
                        subTitle='An Overview of your Savings'
                        extra={[
                            <Button key='1' danger type='primary' icon={<LogoutOutlined />} onClick={logout}>
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
                                            <DashboardOutlined />
                                            Charts
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
                                            <TagsOutlined />
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
