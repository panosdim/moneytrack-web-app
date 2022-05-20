import Icon from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ReactComponent as EuroIconSvg } from '../images/euro.svg';
import { incomesState, loginState } from '../model';
import { incomeType } from '../model/data';

interface Props {
    selectedIncome?: incomeType;
    visible: boolean;
    onVisibleChange: (visible: boolean) => void;
}
export const IncomeForm: React.FC<Props> = (props: Props) => {
    const { visible, onVisibleChange, selectedIncome } = props;
    const { MonthPicker } = DatePicker;
    const [form] = Form.useForm();
    const [isVisible, setVisible] = useState(visible);
    const [isLoading, setLoading] = useState(false);
    const [income, setIncome] = useRecoilState(incomesState);
    const setLoggedIn = useSetRecoilState(loginState);

    useEffect(() => {
        if (selectedIncome) {
            form.setFieldsValue({
                date: moment(selectedIncome.date),
                amount: selectedIncome.amount,
                comment: selectedIncome.comment,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIncome]);

    useEffect(() => {
        setVisible(visible);
    }, [visible]);

    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
        onVisibleChange(false);
    };

    const saveIncome = () => {
        form.validateFields()
            .then((values: incomeType) => {
                setLoading(true);
                const method = selectedIncome ? 'put' : 'post';
                const url = selectedIncome ? `income/${selectedIncome.id}` : 'income';
                const date = moment(values.date).format('YYYY-MM-01');
                const storeValues = { ...values, date: date, amount: Number(values.amount) };

                axios({
                    method: method,
                    url: url,
                    data: storeValues,
                })
                    .then((response) => {
                        selectedIncome
                            ? setIncome(income.map((inc) => (inc.id === selectedIncome.id ? response.data : inc)))
                            : setIncome([...income, response.data]);
                        setLoading(false);
                        setVisible(false);
                        onVisibleChange(false);
                        form.resetFields();
                        message.success('Income saved successfully!');
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 400) {
                            // JWT Token expired
                            setLoading(false);
                            setLoggedIn(false);
                            message.error(error.response.data.error);
                        } else {
                            setLoading(false);
                            message.error('Fail to save Income!');
                        }
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const deleteIncome = () => {
        if (selectedIncome) {
            setLoading(true);
            axios
                .delete(`income/${selectedIncome.id}`)
                .then((_response) => {
                    setIncome(income.filter((inc) => inc.id !== selectedIncome.id));

                    setLoading(false);
                    setVisible(false);
                    onVisibleChange(false);
                    form.resetFields();
                    message.success('Income deleted successfully!');
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setLoading(false);
                        setLoggedIn(false);
                        message.error(error.response.data.error);
                    } else {
                        setLoading(false);
                        message.error('Fail to delete Income!');
                    }
                });
        }
    };

    const title = selectedIncome ? `Edit Income` : `Add Income`;
    const footer = selectedIncome
        ? [
              <Popconfirm
                  key={selectedIncome?.id}
                  title={`Are you sure delete this income?`}
                  onConfirm={deleteIncome}
                  okText='Yes'
                  cancelText='No'
              >
                  <Button key='back' type='primary' danger loading={isLoading}>
                      Delete
                  </Button>
              </Popconfirm>,
              <Button key='submit' type='primary' loading={isLoading} onClick={saveIncome}>
                  Save
              </Button>,
          ]
        : [
              <Button key='back' onClick={handleCancel}>
                  Cancel
              </Button>,
              <Button key='submit' type='primary' loading={isLoading} onClick={saveIncome}>
                  Add
              </Button>,
          ];

    return (
        <Modal
            title={title}
            visible={isVisible}
            onCancel={handleCancel}
            onOk={() => saveIncome()}
            confirmLoading={isLoading}
            centered
            width={250}
            footer={footer}
        >
            <Form form={form}>
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
                    <MonthPicker style={{ width: '100%' }} format='MMMM YYYY' />
                </Form.Item>
                <Form.Item
                    name='amount'
                    rules={[
                        {
                            required: true,
                            pattern: /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/,
                            message: 'Please enter income amount in format 111.11',
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
                <Form.Item name='comment'>
                    <Input style={{ width: '100%' }} type='text' placeholder='Enter Comment' />
                </Form.Item>
            </Form>
        </Modal>
    );
};
