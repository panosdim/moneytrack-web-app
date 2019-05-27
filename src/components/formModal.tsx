import React, { useState, useEffect, useRef } from 'react';
import { Modal, message, Button, Popconfirm } from 'antd';
import { incomeType, tabType, expenseType } from '../model';
import axios from 'axios';
import { useGlobal, setGlobal } from 'reactn';
import moment from 'moment';
import { ExpenseForm, IncomeForm } from '.';

interface Props {
    visible: boolean;
    selectedIncome?: incomeType;
    selectedExpense?: expenseType;
    onVisibleChange: (visible: boolean) => void;
    type: tabType;
}

export const FormModal: React.FC<Props> = (props: Props) => {
    const { visible, selectedIncome, selectedExpense, onVisibleChange, type } = props;
    const [isVisible, setVisible] = useState(visible);
    const [isLoading, setLoading] = useState(false);
    const incomeForm = useRef(null);
    const expenseForm = useRef(null);
    const [income, setIncome] = useGlobal('income');
    const [expenses, setExpenses] = useGlobal('expenses');

    useEffect(() => {
        setVisible(visible);
    }, [visible]);

    const handleOk = () => {
        switch (type) {
            case 'Income':
                saveIncome();
                break;

            case 'Expense':
                saveExpense();
                break;

            default:
                setVisible(false);
                onVisibleChange(false);
                break;
        }
    };

    const handleCancel = () => {
        let form;
        switch (type) {
            case 'Income':
                form = (incomeForm as any).current;
                form.resetFields();

                setVisible(false);
                onVisibleChange(false);
                break;

            case 'Expense':
                form = (expenseForm as any).current;
                form.resetFields();

                setVisible(false);
                onVisibleChange(false);
                break;

            default:
                setVisible(false);
                onVisibleChange(false);
                break;
        }
    };

    const handleDelete = () => {
        switch (type) {
            case 'Income':
                deleteIncome();
                break;

            case 'Expense':
                deleteExpense();
                break;

            default:
                setVisible(false);
                onVisibleChange(false);
                break;
        }
    };

    const saveIncome = () => {
        const form = (incomeForm as any).current;

        form.validateFields((err: any, values: incomeType) => {
            if (!err) {
                setLoading(true);
                const method = selectedIncome ? 'put' : 'post';
                const url = selectedIncome ? `income/${selectedIncome.id}` : 'income';
                const date = moment(values.date).format('YYYY-MM-01');
                const storeValues = { ...values, date: date };

                axios({
                    method: method,
                    url: url,
                    data: storeValues,
                })
                    .then(response => {
                        selectedIncome
                            ? setIncome(income.map(inc => (inc.id === selectedIncome.id ? response.data.data : inc)))
                            : setIncome([...income, response.data.data]);
                        setLoading(false);
                        setVisible(false);
                        onVisibleChange(false);
                        form.resetFields();
                        message.success('Income saved successfully!');
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 400) {
                            // JWT Token expired
                            setLoading(false);
                            setGlobal({ isLoggedIn: false });
                            message.error(error.response.data.error);
                        } else {
                            setLoading(false);
                            message.error('Fail to save Income!');
                        }
                    });
            }
        });
    };

    const saveExpense = () => {
        const form = (expenseForm as any).current;

        form.validateFields((err: any, values: expenseType) => {
            if (!err) {
                setLoading(true);
                const method = selectedExpense ? 'put' : 'post';
                const url = selectedExpense ? `expense/${selectedExpense.id}` : 'expense';
                const date = moment(values.date).format('YYYY-MM-DD');
                const storeValues = { ...values, date: date };

                axios({
                    method: method,
                    url: url,
                    data: storeValues,
                })
                    .then(response => {
                        selectedExpense
                            ? setExpenses(
                                  expenses.map(exp => (exp.id === selectedExpense.id ? response.data.data : exp)),
                              )
                            : setExpenses([...expenses, response.data.data]);
                        setLoading(false);
                        setVisible(false);
                        onVisibleChange(false);
                        form.resetFields();
                        message.success('Expense saved successfully!');
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 400) {
                            // JWT Token expired
                            setLoading(false);
                            setGlobal({ isLoggedIn: false });
                            message.error(error.response.data.error);
                        } else {
                            setLoading(false);
                            message.error('Fail to save Expense!');
                        }
                    });
            }
        });
    };

    const deleteIncome = () => {
        if (selectedIncome) {
            setLoading(true);
            axios
                .delete(`income/${selectedIncome.id}`)
                .then(response => {
                    setIncome(income.filter(inc => inc.id !== selectedIncome.id));
                    const form = (incomeForm as any).current;

                    setLoading(false);
                    setVisible(false);
                    onVisibleChange(false);
                    form.resetFields();
                    message.success('Income deleted successfully!');
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setLoading(false);
                        setGlobal({ isLoggedIn: false });
                        message.error(error.response.data.error);
                    } else {
                        setLoading(false);
                        message.error('Fail to delete Income!');
                    }
                });
        }
    };

    const deleteExpense = () => {
        if (selectedExpense) {
            setLoading(true);
            axios
                .delete(`expense/${selectedExpense.id}`)
                .then(response => {
                    setExpenses(expenses.filter(exp => exp.id !== selectedExpense.id));
                    const form = (expenseForm as any).current;

                    setLoading(false);
                    setVisible(false);
                    onVisibleChange(false);
                    form.resetFields();
                    message.success('Expense deleted successfully!');
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setLoading(false);
                        setGlobal({ isLoggedIn: false });
                        message.error(error.response.data.error);
                    } else {
                        setLoading(false);
                        message.error('Fail to delete Expense!');
                    }
                });
        }
    };

    const isNew: boolean = typeof selectedIncome !== 'undefined' || typeof selectedExpense !== 'undefined';

    const title = isNew ? `Edit ${type}` : `Add ${type}`;
    const footer = isNew
        ? [
              <Popconfirm
                  //@ts-ignore
                  key={type === 'Income' ? selectedIncome.id : selectedExpense.id}
                  title={`Are you sure delete this ${type}?`}
                  onConfirm={handleDelete}
                  okText='Yes'
                  cancelText='No'
              >
                  <Button key='back' type='danger' loading={isLoading}>
                      Delete
                  </Button>
              </Popconfirm>,
              <Button key='submit' type='primary' loading={isLoading} onClick={handleOk}>
                  Save
              </Button>,
          ]
        : [
              <Button key='back' onClick={handleCancel}>
                  Cancel
              </Button>,
              <Button key='submit' type='primary' loading={isLoading} onClick={handleOk}>
                  Add
              </Button>,
          ];

    return (
        <Modal
            title={title}
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={isLoading}
            centered
            width={250}
            footer={footer}
        >
            {type === 'Income' ? (
                <IncomeForm ref={incomeForm} income={selectedIncome} />
            ) : type === 'Expense' ? (
                <ExpenseForm ref={expenseForm} expense={selectedExpense} />
            ) : (
                <div>Category</div>
            )}
        </Modal>
    );
};
