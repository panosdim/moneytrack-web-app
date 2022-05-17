import { Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import './App.css';
import { loginState } from './model';
import { LoginPage, MainPage } from './pages';

axios.defaults.baseURL = 'https://moneytrack.dsw.mywire.org/api';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useRecoilState(loginState);
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        axios
            .get('user')
            .then((response) => {
                setLoggedIn(true);
                setLoading(false);
            })
            .catch((error) => {
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
