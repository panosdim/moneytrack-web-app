import React, { useEffect } from 'react';
import { incomeType } from '../model';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Input, DatePicker, Icon } from 'antd';
import moment from 'moment';

interface Props extends FormComponentProps {
    income?: incomeType;
}

const NormalIncomeForm: React.FC<Props> = (props: Props) => {
    const { form, income } = props;
    const { getFieldDecorator, setFieldsValue } = form;
    const { MonthPicker } = DatePicker;

    useEffect(() => {
        if (income) {
            setFieldsValue({
                date: moment(income.date),
                amount: income.amount,
                comment: income.comment,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [income]);

    return (
        <Form>
            <Form.Item label='Date'>
                {getFieldDecorator('date', {
                    rules: [
                        {
                            required: true,
                            message: 'Please enter a valid date!',
                        },
                    ],
                })(<MonthPicker style={{ width: '100%' }} format='MMMM YYYY' />)}
            </Form.Item>
            <Form.Item label='Amount'>
                {getFieldDecorator('amount', {
                    rules: [
                        {
                            required: true,
                            pattern: new RegExp('\\d+[.]{0,1}\\d{0,2}'),
                            message: 'Please enter income amount!',
                        },
                    ],
                })(
                    // @ts-ignore
                    <Input
                        suffix={<Icon type='euro' style={{ color: 'rgba(0,0,0,.45)' }} />}
                        style={{ width: '100%' }}
                        precision={2}
                        placeholder='Enter Amount'
                    />,
                )}
            </Form.Item>
            <Form.Item label='Comment'>
                {getFieldDecorator('comment')(
                    <Input style={{ width: '100%' }} type='text' placeholder='Enter Comment' />,
                )}
            </Form.Item>
        </Form>
    );
};

export const IncomeForm = Form.create<Props>()(NormalIncomeForm);
