import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { loginState } from '../model';

export const LoginForm = () => {
    const [isLoading, setLoading] = useState(false);
    const setLoggedIn = useSetRecoilState(loginState);
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        setLoading(true);
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
    };

    return (
        <Form form={form} onFinish={handleSubmit}>
            <Form.Item name='email' rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
                <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type='email'
                    placeholder='Email'
                />
            </Form.Item>
            <Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
                <Input.Password
                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type='password'
                    placeholder='Password'
                />
            </Form.Item>
            <Form.Item>
                <Button type='primary' loading={isLoading} htmlType='submit'>
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};
