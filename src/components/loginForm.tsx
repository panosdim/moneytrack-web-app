import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { loginState } from '../model';

interface Props extends FormComponentProps {}

const NormalLoginForm = (props: Props) => {
    const { form } = props;
    const { getFieldDecorator } = form;
    const [isLoading, setLoading] = useState(false);
    const setLoggedIn = useSetRecoilState(loginState);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        form.validateFields((err, values) => {
            if (!err) {
                axios
                    .post('login', values)
                    .then((response) => {
                        localStorage.setItem('token', response.data.token);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                        setLoading(false);
                        setLoggedIn(true);
                    })
                    .catch((error) => {
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
                    rules: [{ required: true, type: 'email', message: 'Please input your email!' }],
                })(
                    <Input
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type='email'
                        placeholder='Email'
                    />,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input.Password
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
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
