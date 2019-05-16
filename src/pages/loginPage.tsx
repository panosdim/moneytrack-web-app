import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import axios from 'axios';

interface Props extends FormComponentProps {}

const NormalLoginForm = (props: Props) => {
    const { form } = props;
    const { getFieldDecorator } = form;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                axios
                    .post('login', values)
                    .then(response => {
                        localStorage.setItem('token', response.data.token);
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    };

    return (
        <Form onSubmit={handleSubmit} className='login-form'>
            <Form.Item>
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your email!' }],
                })(
                    <Input
                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type='email'
                        placeholder='Email'
                    />,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input
                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type='password'
                        placeholder='Password'
                    />,
                )}
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className='login-form-button'>
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Form.create<Props>()(NormalLoginForm);
