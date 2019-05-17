import React, { useState } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import axios from 'axios';
import { setGlobal } from 'reactn';
import { GlobalState } from '../model';

interface Props extends FormComponentProps {}

const NormalLoginForm = (props: Props) => {
    const { form } = props;
    const { getFieldDecorator } = form;
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        form.validateFields((err, values) => {
            if (!err) {
                axios
                    .post('login', values)
                    .then(response => {
                        localStorage.setItem('token', response.data.token);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                        setLoading(false);
                        setGlobal<GlobalState>({ isLoggedIn: true });
                    })
                    .catch(error => {
                        message.error('Login error. Please check your email or password.');
                        setLoading(false);
                    });
            }
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
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
                <Button type='primary' loading={isLoading} htmlType='submit'>
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};

export const LoginForm = Form.create<Props>()(NormalLoginForm);
