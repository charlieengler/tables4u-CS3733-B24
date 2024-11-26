"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import secureLocalStorage from 'react-secure-storage';

import Alert from '../components/Alert';

import { login, logout } from '../routes/user';
import { getRestaurantByManager } from '../routes/restaurants';

import './styles/Banner.css';

export default function Banner() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginMessage, setLoginMessage] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const createUser = () => {
        navigate('/create-restaurant', {
            state: {
                username: username,
                password: password,
            },
        });
    }

    const loginUser = async (username: string, password: string) => {
        try {
            const userData: any = await login(username, password);
            const eid = userData.eid;
            const loginRedirect = userData.redirect;

            if(loginRedirect == '/restaurant-manager') {
                const restaurant = await getRestaurantByManager(eid) as any;

                secureLocalStorage.setItem('uid', restaurant.uid);
            }

            navigate(loginRedirect);
            setIsLoggedIn(true);
        } catch(err) {
            setLoginMessage(err as string);
        }
    }

    const logoutUser = async () => {
        try {
            await logout(); 

            setIsLoggedIn(false);

            navigate('/');
        } catch(err) {
            setLoginMessage(err as string);
        }
    }

    useEffect(() => {
        // TODO: Make sure the restaurant manager is saved in secureLocalStorage
        if(secureLocalStorage.getItem('uid'))
            setIsLoggedIn(true);

        if(secureLocalStorage.getItem('username'))
            setUsername(secureLocalStorage.getItem('username') as string);
    }, []);

    return (
        <>
            <div className='main-container'>
                <div className='title' onClick={() => navigate('/')}>Tables4u</div>

                {!isLoggedIn ?
                    <div className='login-container'>
                        <div className='login-input-container'>
                            <input className='login-input' onChange={e => setUsername(e.target.value)} placeholder='Username/Email' type='text' value={username}></input>
                            <input className='login-input' onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' value={password}></input>
                        </div>

                        <div className='login-button-container'>
                            <button className='login-button' onClick={() => loginUser(username, password)}>Log In</button>
                            <button className='login-button' onClick={createUser}>Create Account</button>
                        </div>
                    </div> :

                    <div className='login-container'>
                        <button className='login-button' onClick={() => navigate('/restaurant-manager')}>{username}</button>
                        <button className='login-button' onClick={logoutUser}>Log Out</button>
                    </div>
                }


            </div>

            {loginMessage && <Alert callback={() => {setLoginMessage(null)}} message={loginMessage}>Login Error!</Alert>}
        </>
    );
}