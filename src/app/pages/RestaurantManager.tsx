'use client';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import secureLocalStorage from 'react-secure-storage';

import { getRestaurantById } from '../routes/restaurants';

import './styles/RestaurantManager.css';

export default function RestaurantManager() {
    const navigate = useNavigate();
    const location = useLocation();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');
    const [state, setState] = useState('');
    const [uid, setUid] = useState<number | null>(null);
    const [username, setUsername] = useState('');
    const [zipcode, setZipcode] = useState('');

    useEffect(() => {
        if(secureLocalStorage.getItem('uid'))
            setUid(secureLocalStorage.getItem('uid') as number);
        else
            navigate('/');

        const getRestaurantData = async (uid: number) => {
            const restaurant = await getRestaurantById(uid);

            console.log(restaurant);
        }

        getRestaurantData(secureLocalStorage.getItem('uid') as number);
    }, []);

    return (
        <>
            <div className='restaurant-title'>{restaurantName}</div>
            <div className='restaurant-manager'>Restaurant Manager: {username}</div>
            <div>{uid}</div>
        </>
    );
}