"use client";

import { useState } from 'react';

import login from '../routes/login';

import './styles/Banner.css';

export default function Banner() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="main-container">
            <div className="title">Tables4u</div>

            <div className="login-container">
                <div className="login-input-container">
                    <input className="login-input" onChange={e => setUsername(e.target.value)} placeholder="Username/Email" type="text" value={username}></input>
                    <input className="login-input" onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" value={password}></input>
                </div>

                <div className="login-button-container">
                    <button className="login-button" onClick={() => login(username, password)}>Log In</button>
                    <button className="login-button">Create Account</button>
                </div>
            </div>
        </div>
    );
}