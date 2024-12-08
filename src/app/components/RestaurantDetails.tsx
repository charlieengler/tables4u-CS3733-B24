import { useEffect, useState } from 'react';

import Alert from './Alert';

import './styles/RestaurantDetails.css';

export default function RestaurantDetails(props: any) {
    const [address, setAddress] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertTitle, setAlertTitle] = useState<string | null>(null);
    const [cityState, setCityState] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');
    const [zipcode, setZipcode] = useState('');

    const returnFormData = () => {
        if(!validateEmail()) {
            setAlertTitle('Invalid Email!');
            setAlertMessage('The provided email doesn\'t match the proper format!');
            return;
        }

        if(!validateUsername()) {
            setAlertTitle('Invalid Username!');
            setAlertMessage('A username must be between 3 and 50 characters and contain only letters, numbers, underscores, and dashes!');
            return;
        }

        if(password != repeatPassword) {
            setAlertTitle('Passwords Don\'t Match!');
            setAlertMessage('The provided passwords don\'t match!');
            return;
        }

        if(!validatePassword()) {
            setAlertTitle('Invalid Password!');
            setAlertMessage('A password must be between 3 and 20 characters and contain only letters, numbers, and the following special characters: "@ & $ ! # ?"!');
            return;
        }

        if(!validateName()) {
            setAlertTitle('Invalid Restaurant Name!');
            setAlertMessage('A restaurant name must be between 3 and 50 characters and contain only letters, numbers, commas, and apostrophes!');
            return;
        }

        if(!validateAddress()) {
            setAlertTitle('Invalid Address!');
            setAlertMessage('The provided address doesn\'t match the proper format!');
            return;
        }

        if(!validateCityState()) {
            setAlertTitle('Invalid City or State!');
            setAlertMessage('Cities and states must be separated by a comma and a space, and states must be a two character string!');
            return;
        }

        if(!validateZipcode()) {
            setAlertTitle('Invalid Zipcode!');
            setAlertMessage('Zipcodes must be five numbers!');
            return;
        }

        props.callback(email, username, password, name, address, cityState, zipcode);
    }

    const validateAddress = () => {
        return address.length > 5; 
    }

    const validateCityState = () => {
        if(!cityState.includes(', '))
            return false;

        const state = cityState.split(', ')[1];

        if(state.length != 2)
            return false;

        return true;
    }

    const validateEmail = () => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    const validateName = () => {
        return String(password).match(/^[a-zA-Z0-9,']{3,50}$/);
    }

    const validatePassword = () => {
        return String(password).match(/^[a-zA-Z0-9@&$!#?]{3,20}$/);
    }

    const validateUsername = () => {
        return String(username).match(/^[a-zA-Z0-9_-]{3,50}$/);
    }

    const validateZipcode = () => {
        if(zipcode.length != 5)
            return false;

        return !isNaN(Number(zipcode));
    }

    useEffect(() => {
        if(props.address)
            setAddress(props.address);

        if(props.cityState)
            setCityState(props.cityState);

        if(props.email)
            setEmail(props.email);

        if(props.name)
            setName(props.name);

        if(props.password)
            setPassword(props.password);

        if(props.repeatPassword)
            setRepeatPassword(props.repeatPassword);

        if(props.username)
            setUsername(props.username);

        if(props.zipcode)
            setZipcode(props.zipcode);

        if(window.localStorage.getItem('username')) {
            setUsername(window.localStorage.getItem('username') as string);
            window.localStorage.removeItem('username');
        }

        if(window.localStorage.getItem('password')) {
            setPassword(window.localStorage.getItem('password') as string);
            window.localStorage.removeItem('password');
        }
    }, []);

    return (
        <>
            {alertTitle && alertMessage && 
                <Alert
                    callback={() => {
                        setAlertMessage(null);
                        setAlertTitle(null);
                    }}
                    message={alertMessage}
                >
                    {alertTitle}
                </Alert>
            }

            <div className='restaurant-details-container'>
                <div className='restaurant-details-title'>Enter Restaurant Details</div>

                <div className='restaurant-details-subcontainer'>
                    <div className='restaurant-details-subtitle'>Restaurant Manager Account</div>
                    <input className='restaurant-details-input' onChange={e => setEmail(e.target.value)} placeholder='Email' required type='text' value={email}></input>
                    <input className='restaurant-details-input' onChange={e => setUsername(e.target.value)} placeholder='Username' required type='text' value={username}></input>
                    <input className='restaurant-details-input' onChange={e => setPassword(e.target.value)} placeholder='Password' required type='password' value={password}></input>
                    <input className='restaurant-details-input' onChange={e => setRepeatPassword(e.target.value)} placeholder='Repeat Password' required type='password' value={repeatPassword}></input>
                </div>
                
                <div className='restaurant-details-subcontainer'>
                    <div className='restaurant-details-subtitle'>Restaurant Information</div>
                    <input className='restaurant-details-input' onChange={e => setName(e.target.value)} placeholder='Restaurant Name' required type='text' value={name}></input>
                    <input className='restaurant-details-input' onChange={e => setAddress(e.target.value)} placeholder='Restaurant Address' required type='text' value={address}></input>
                    <input className='restaurant-details-input' onChange={e => setCityState(e.target.value)} placeholder='Restaurant City, State' required type='text' value={cityState}></input>
                    <input className='restaurant-details-input' onChange={e => setZipcode(e.target.value)} placeholder='Restaurant Zipcode' required type='text' value={zipcode}></input>
                </div>

                <button className='restaurant-details-submit-button' onClick={returnFormData}>Submit</button>
            </div>
        </>
    );
}