"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import login from '../routes/login';
import logout from '../routes/logout';

import './styles/Banner.css';

export default function Banner() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const loginUser = async (username: string, password: string) => {
        try {
            const loginRedirect = await login(username, password) as string;

            navigate(loginRedirect);
            setIsLoggedIn(true);
        } catch(err) {
            console.error(err);
        }
    }

    const logoutUser = async () => {
        try {
            await logout(); 

            setIsLoggedIn(false);

            navigate('/');
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className='main-container'>
            <div className='title'>Tables4u</div>

            {!isLoggedIn ?
                <div className='login-container'>
                    <div className='login-input-container'>
                        <input className='login-input' onChange={e => setUsername(e.target.value)} placeholder='Username/Email' type='text' value={username}></input>
                        <input className='login-input' onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' value={password}></input>
                    </div>

                    <div className='login-button-container'>
                        <button className='login-button' onClick={() => loginUser(username, password)}>Log In</button>
                        <button className='login-button'>Create Account</button>
                    </div>
                </div> :

                <div className='login-container'>
                    <button className='login-button'>{username}</button>
                    <button className='login-button' onClick={logoutUser}>Log Out</button>
                </div>
            }
        </div>
    );
}