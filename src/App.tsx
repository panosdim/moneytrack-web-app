import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Spin } from 'antd';
import { LoginPage, MainPage } from './pages';

axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        axios
            .get('user')
            .then(response => {
                setLoggedIn(true);
                setLoading(false);
            })
            .catch(error => {
                setLoggedIn(false);
                setLoading(false);
            });
    }, []);

    return (
        <>
            {isLoading ? (
                <div className='center'>
                    <Spin size='large' />
                </div>
            ) : isLoggedIn ? (
                <MainPage />
            ) : (
                <LoginPage />
            )}
        </>
    );
};

export default App;
