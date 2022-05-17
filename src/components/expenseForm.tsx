import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import Icon from '@ant-design/icons';
import { DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { ReactComponent as EuroIconSvg } from '../images/euro.svg';
import { categoriesState } from '../model';
import { expenseType } from '../model/data';

interface Props extends FormComponentProps {
    expense?: expenseType;
}

const Option = Select.Option;

// @ts-ignore
moment.defineLocale('en-us', {
    week: {
        dow: 1, // Monday is the first day of the week.
    },
});

const NormalExpenseForm: React.FC<Props> = (props: Props) => {
    // @ts-ignore
    const { form, expense } = props;
    const { getFieldDecorator, setFieldsValue } = form;
    const categories = useRecoilValue(categoriesState);

    useEffect(() => {
        if (expense) {
            setFieldsValue({
                date: moment(expense.date),
                amount: expense.amount,
                category: Number(expense.category),
                comment: expense.comment,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expense]);

    return (
        <Form>
            <Form.Item>
                {getFieldDecorator('date', {
                    initialValue: moment(),
                    rules: [
                        {
                            required: true,
                            message: 'Please enter a valid date!',
                        },
                    ],
                })(<DatePicker style={{ width: '100%' }} format='ddd D MMMM YYYY' />)}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('amount', {
                    rules: [
                        {
                            required: true,
                            pattern: /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/,
                            message: 'Please enter expense amount!',
                        },
                    ],
                })(
                    // @ts-ignore
                    <Input
                        // @ts-ignore
                        suffix={<Icon component={EuroIconSvg} style={{ color: 'rgba(0,0,0,.45)' }} />}
                        style={{ width: '100%' }}
                        type='number'
                        placeholder='Enter Amount'
                    />,
                )}
            </Form.Item>
            <Form.Item>
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
                            .map((category) => (
                                <Option key={category.id} value={category.id}>
                                    {category.category}
                                </Option>
                            ))}
                    </Select>,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('comment')(
                    // @ts-ignore
                    <Input style={{ width: '100%' }} type='text' placeholder='Enter Comment' />,
                )}
            </Form.Item>
        </Form>
    );
};

export const ExpenseForm = Form.create<Props>()(NormalExpenseForm);
