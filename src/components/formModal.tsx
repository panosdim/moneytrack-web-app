import React, { useState, useEffect, useRef } from 'react';
import { Modal, message, Button, Popconfirm } from 'antd';
import { incomeType, tabType, expenseType } from '../model';
import { IncomeForm } from './incomeForm';
import axios from 'axios';
import { useGlobal, setGlobal } from 'reactn';
import moment from 'moment';

interface Props {
    visible: boolean;
    data?: incomeType | expenseType;
    onVisibleChange: (visible: boolean) => void;
    type: tabType;
}

export const FormModal: React.FC<Props> = (props: Props) => {
    const { visible, data, onVisibleChange, type } = props;
    const [isVisible, setVisible] = useState(visible);
    const [isLoading, setLoading] = useState(false);
    const incomeForm = useRef(null);
    const [income, setIncome] = useGlobal('income');

    useEffect(() => {
        setVisible(visible);
    }, [visible]);

    const handleOk = () => {
        if (type === 'Income') {
            saveIncome();
        } else {
            setVisible(false);
            onVisibleChange(false);
        }
    };

    const handleCancel = () => {
        if (type === 'Income') {
            const form = (incomeForm as any).current;
            form.resetFields();

            setVisible(false);
            onVisibleChange(false);
        } else {
            setVisible(false);
            onVisibleChange(false);
        }
    };

    const handleDelete = () => {
        if (type === 'Income') {
            deleteIncome();
        } else {
            setVisible(false);
            onVisibleChange(false);
        }
    };

    const saveIncome = () => {
        const form = (incomeForm as any).current;

        form.validateFields((err: any, values: incomeType) => {
            if (!err) {
                setLoading(true);
                const method = data ? 'put' : 'post';
                const url = data ? `income/${data.id}` : 'income';
                const date = moment(values.date).format('YYYY-MM-01');
                const storeValues = { ...values, date: date };

                axios({
                    method: method,
                    url: url,
                    data: storeValues,
                })
                    .then(response => {
                        data
                            ? setIncome(income.map(inc => (inc.id === data.id ? response.data.data : inc)))
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

    const deleteIncome = () => {
        if (data) {
            setLoading(true);
            axios
                .delete(`income/${data.id}`)
                .then(response => {
                    setIncome(income.filter(inc => inc.id !== data.id));
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

    const title = data ? `Edit ${type}` : `Add ${type}`;
    const footer = data
        ? [
              <Popconfirm
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
                <IncomeForm ref={incomeForm} income={data} />
            ) : type === 'Expense' ? (
                <div>Expense</div>
            ) : (
                <div>Category</div>
            )}
        </Modal>
    );
};
