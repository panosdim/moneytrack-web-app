import Icon from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ReactComponent as EuroIconSvg } from '../images/euro.svg';
import { categoriesState, expensesState, loginState } from '../model';
import { categoryType, expenseType } from '../model/data';

interface Props {
    selectedExpense?: expenseType;
    visible: boolean;
    onVisibleChange: (visible: boolean) => void;
}

const Option = Select.Option;

moment.updateLocale('en-us', {
    week: {
        dow: 1, // Monday is the first day of the week.
    },
});

export const ExpenseForm: React.FC<Props> = (props: Props) => {
    const { visible, onVisibleChange, selectedExpense } = props;
    const categories = useRecoilValue(categoriesState);
    const [sortedCategories, setSortedCategories] = useState<categoryType[]>([]);
    const [form] = Form.useForm();
    const [isVisible, setVisible] = useState(visible);
    const [isLoading, setLoading] = useState(false);
    const [expenses, setExpenses] = useRecoilState(expensesState);
    const setLoggedIn = useSetRecoilState(loginState);

    useEffect(() => {
        if (selectedExpense) {
            form.setFieldsValue({
                date: moment(selectedExpense.date),
                amount: selectedExpense.amount,
                category: Number(selectedExpense.category),
                comment: selectedExpense.comment,
            });
        }
        const cpyCategories = [...categories];
        setSortedCategories(cpyCategories.sort((a, b) => a.count - b.count).reverse());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExpense]);

    useEffect(() => {
        setVisible(visible);
    }, [visible]);

    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
        onVisibleChange(false);
    };

    const saveExpense = () => {
        form.validateFields()
            .then((values: expenseType) => {
                setLoading(true);
                const method = selectedExpense ? 'put' : 'post';
                const url = selectedExpense ? `expense/${selectedExpense.id}` : 'expense';
                const date = moment(values.date).format('YYYY-MM-DD');
                const storeValues = { ...values, date: date, amount: Number(values.amount) };

                axios({
                    method: method,
                    url: url,
                    data: storeValues,
                })
                    .then((response) => {
                        selectedExpense
                            ? setExpenses(expenses.map((exp) => (exp.id === selectedExpense.id ? response.data : exp)))
                            : setExpenses([...expenses, response.data]);
                        setLoading(false);
                        setVisible(false);
                        onVisibleChange(false);
                        form.resetFields();
                        message.success('Expense saved successfully!');
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 400) {
                            // JWT Token expired
                            setLoading(false);
                            setLoggedIn(false);
                            message.error(error.response.data.error);
                        } else {
                            setLoading(false);
                            message.error('Fail to save Expense!');
                        }
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const deleteExpense = () => {
        if (selectedExpense) {
            setLoading(true);
            axios
                .delete(`expense/${selectedExpense.id}`)
                .then((_response) => {
                    setExpenses(expenses.filter((exp) => exp.id !== selectedExpense.id));
                    setLoading(false);
                    setVisible(false);
                    onVisibleChange(false);
                    form.resetFields();
                    message.success('Expense deleted successfully!');
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setLoading(false);
                        setLoggedIn(false);
                        message.error(error.response.data.error);
                    } else {
                        setLoading(false);
                        message.error('Fail to delete Expense!');
                    }
                });
        }
    };

    const title = selectedExpense ? `Edit Expense` : `Add Expense`;
    const footer = selectedExpense
        ? [
              <Popconfirm
                  key={selectedExpense?.id}
                  title={`Are you sure delete this expense?`}
                  onConfirm={deleteExpense}
                  okText='Yes'
                  cancelText='No'
              >
                  <Button key='back' type='primary' danger loading={isLoading}>
                      Delete
                  </Button>
              </Popconfirm>,
              <Button key='submit' type='primary' loading={isLoading} onClick={saveExpense}>
                  Save
              </Button>,
          ]
        : [
              <Button key='back' onClick={handleCancel}>
                  Cancel
              </Button>,
              <Button key='submit' type='primary' loading={isLoading} onClick={saveExpense}>
                  Add
              </Button>,
          ];

    return (
        <Modal
            title={title}
            visible={isVisible}
            onCancel={handleCancel}
            onOk={() => saveExpense()}
            confirmLoading={isLoading}
            centered
            width={250}
            footer={footer}
        >
            <Form form={form} onFinish={saveExpense}>
                <Form.Item
                    name='date'
                    initialValue={moment()}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a valid date!',
                        },
                    ]}
                >
                    <DatePicker style={{ width: '100%' }} format='ddd D MMMM YYYY' />
                </Form.Item>
                <Form.Item
                    name='amount'
                    rules={[
                        {
                            required: true,
                            pattern: /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/,
                            message: 'Please enter expense amount!',
                        },
                    ]}
                >
                    <Input
                        suffix={<Icon component={EuroIconSvg} style={{ color: 'rgba(0,0,0,.45)' }} />}
                        style={{ width: '100%' }}
                        type='number'
                        placeholder='Enter Amount'
                    />
                </Form.Item>
                <Form.Item
                    name='category'
                    rules={[
                        {
                            required: true,
                            message: 'Please select a category!',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder='Select a category'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {sortedCategories.map((category) => (
                            <Option key={category.id} value={category.id}>
                                {category.category}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='comment'>
                    <Input style={{ width: '100%' }} type='text' placeholder='Enter Comment' />
                </Form.Item>
            </Form>
        </Modal>
    );
};
