import React from 'react';
import { Card, Typography } from 'antd';
import logo from '../images/logo.jpg';
import { LoginForm } from '../components';

export const LoginPage: React.FC = () => {
    const { Title } = Typography;

    return (
        <div className='center'>
            <Card
                title={<Title>Money Track</Title>}
                style={{ width: 300 }}
                cover={<img alt='Money Track Logo' src={logo} />}
            >
                <LoginForm />
            </Card>
        </div>
    );
};
