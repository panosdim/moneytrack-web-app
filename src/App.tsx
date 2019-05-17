import React, { useState } from 'react';
import { useGlobal, setGlobal } from 'reactn';
import './App.css';
import axios from 'axios';
import { Spin } from 'antd';
import { LoginPage, MainPage } from './pages';

axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

setGlobal({
    isLoggedIn: false,
    income: [],
    expenses: [],
    categories: [],
});

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useGlobal('isLoggedIn');
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
