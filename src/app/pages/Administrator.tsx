"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

import { deleteRestaurant, listRestaurants } from '../routes/restaurants';

import testAccess from '../routes/test-access';
import Alert from '../components/Alert';
import './styles/Admin.css';

export default function Administrator() {
    const [createMessage, setCreateMessage] = useState<string | null>(null);
    const [accessLevel, setAccessLevel] = useState("");
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurants, setRestaurants] = useState<string[]>([]);
    const navigate = useNavigate();

    const listRest = async () => {
        
        try {
            const rest = await listRestaurants() as string[];
            setRestaurants(rest);
            

        } catch (err) {
            console.log(err);
            // setCreateMessage(err as string);
        }
    }
    const delRestaurant = async () => {
        
        try {
            await deleteRestaurant(restaurantName);
            console.log("restaurant Deleted: ", restaurantName)
            

        } catch (err) {
            console.log(err);
            // setCreateMessage(err as string);
        }
    }
    useEffect(() => {
        const getAccessLevel = async () => {
            const token: string | null = secureLocalStorage.getItem('token') as string;
            try {
                const access = await testAccess(token) as string;

                if(access == 'M')
                    navigate('/restaurant-manager');
                else if(access != 'A')
                    navigate('/');

                setAccessLevel(access);
            } catch(err) {
                console.error(err);
            }
        }
        
        getAccessLevel();
    }, []);

    return (
        <>
            {/* {accessLevel == 'A' && <h1>Administrator</h1>} */}
            <div className='delete-restaurant-container'>
                <input className='delete-restaurant-input' onChange={e => setRestaurantName(e.target.value)} placeholder='Restaurant Name' type='text' value={restaurantName}></input>
                <button className='delete-restaurant-button' onClick={()=>{delRestaurant(); setRestaurantName("");} }>Delete Restaurant</button>
            </div>
            <div className='delete-restaurant-container'>
                <button className='reload-button' onClick={listRest}>&#x21bb;</button>
                <h1 className='restaurants-header'>Restaurants:</h1>
                <div className='list-container'>
                    <h1 className='restaurants-text'> {restaurants?.map(restaunt => <p key={restaunt}>{restaunt}</p>)}</h1>
                </div>
                

            </div>
            {createMessage && <Alert callback={() => setCreateMessage(null)} message={createMessage}>Restaurant Error!</Alert>}
        </>
        
    );
}