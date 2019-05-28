import React, { useEffect } from 'react';
import { expenseType } from '../model';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Input, DatePicker, Icon, Select } from 'antd';
import moment from 'moment';
import { ReactComponent as EuroIconSvg } from '../images/euro.svg';
import { useGlobal } from 'reactn';

interface Props extends FormComponentProps {
    expense?: expenseType;
}

const Option = Select.Option;

const NormalExpenseForm: React.FC<Props> = (props: Props) => {
    const { form, expense } = props;
    const { getFieldDecorator, setFieldsValue } = form;
    const [categories] = useGlobal('categories');

    useEffect(() => {
        if (expense) {
            setFieldsValue({
                date: moment(expense.date),
                amount: expense.amount,
                category: expense.category,
                comment: expense.comment,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expense]);

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
                })(<DatePicker style={{ width: '100%' }} format='ddd D MMMM YYYY' />)}
            </Form.Item>
            <Form.Item label='Amount'>
                {getFieldDecorator('amount', {
                    rules: [
                        {
                            required: true,
                            pattern: /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/,
                            message: 'Please enter expense amount!',
                        },
                    ],
                })(
                    <Input
                        // @ts-ignore
                        suffix={<Icon component={EuroIconSvg} style={{ color: 'rgba(0,0,0,.45)' }} />}
                        style={{ width: '100%' }}
                        type='number'
                        placeholder='Enter Amount'
                    />,
                )}
            </Form.Item>
            <Form.Item label='Category'>
                {getFieldDecorator('category', {
                    rules: [
                        {
                            required: true,
                            message: 'Please select a category!',
                        },
                    ],
                })(
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder='Select a category'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            // @ts-ignore
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {categories
                            .sort((a, b) => a.count - b.count)
                            .reverse()
                            .map(category => (
                                <Option key={category.id} value={category.id}>
                                    {category.category}
                                </Option>
                            ))}
                    </Select>,
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

export const ExpenseForm = Form.create<Props>()(NormalExpenseForm);
