"use client";

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { createRestaurant } from '../routes/restaurants';

import Alert from '../components/Alert';

import './styles/CreateRestaurant.css';

export default function CreateRestaurant() {
    const location = useLocation();
    const navigate = useNavigate();

    const [createMessage, setCreateMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantCityState, setRestaurantCityState] = useState('');
    const [restaurantZipcode, setRestaurantZipcode] = useState('');
    const [username, setUsername] = useState('');

    const validateRestaurant = async () => {
        // TODO: Check to make sure all of the data enter is correct (i.e. a state is a string of size 2, a zipcode is all numbers, etc)

        try {
            await createRestaurant(email, username, password, restaurantName, restaurantAddress, restaurantCityState, restaurantZipcode);

            navigate('/restaurant-manager');
        } catch (err) {
            console.error(err);
            setCreateMessage(err as string);
        }
    }

    useEffect(() => {
        if(location?.state?.username)
            setUsername(location.state.username);

        if(location?.state?.password)
            setPassword(location.state.password);
    }, []);

    return (
        <>
            <div className='create-restaurant-container'>
                <div className='create-restaurant-title'>Enter Restaurant Details</div>

                <div className='create-restaurant-subcontainer'>
                    <div className='create-restaurant-subtitle'>Restaurant Manager Account</div>
                    <input className='create-restaurant-input' onChange={e => setEmail(e.target.value)} placeholder='Email' type='text' value={email}></input>
                    <input className='create-restaurant-input' onChange={e => setUsername(e.target.value)} placeholder='Username' type='text' value={username}></input>
                    <input className='create-restaurant-input' onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' value={password}></input>
                    <input className='create-restaurant-input' onChange={e => setRepeatPassword(e.target.value)} placeholder='Repeat Password' type='password' value={repeatPassword}></input>
                </div>
                
                <div className='create-restaurant-subcontainer'>
                    <div className='create-restaurant-subtitle'>Restaurant Information</div>
                    <input className='create-restaurant-input' onChange={e => setRestaurantName(e.target.value)} placeholder='Restaurant Name' type='text' value={restaurantName}></input>
                    <input className='create-restaurant-input' onChange={e => setRestaurantAddress(e.target.value)} placeholder='Restaurant Address' type='text' value={restaurantAddress}></input>
                    <input className='create-restaurant-input' onChange={e => setRestaurantCityState(e.target.value)} placeholder='Restaurant City, State' type='text' value={restaurantCityState}></input>
                    <input className='create-restaurant-input' onChange={e => setRestaurantZipcode(e.target.value)} placeholder='Restaurant Zipcode' type='text' value={restaurantZipcode}></input>
                </div>

                <button className='create-restaurant-button' onClick={validateRestaurant}>Create Restaurant</button>
            </div>

            {createMessage && <Alert callback={() => setCreateMessage(null)} message={createMessage}>Restaurant Error!</Alert>}
        </>
    );
}