"use client";

import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useRouter } from 'next/router';
import { redirect } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

import { deleteRestaurant, listRestaurants } from '../routes/restaurants';

import Banner from '../components/Banner';

import testAccess from '../routes/test-access';
import Alert from '../components/Alert';
import '../page-styles/Admin.css';

export default function Administrator() {
    // const navigate = useNavigate();
    // const router = useRouter();

    const [createMessage, setCreateMessage] = useState<string | null>(null);
    const [accessLevel, setAccessLevel] = useState("");
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurants, setRestaurants] = useState<string[]>([]);
    

    const listRest = async () => {
        
        try {
            const rest = await listRestaurants() as string[];
            setRestaurants(rest);
            

        } catch (err) {
            console.log(err);
            // setCreateMessage(err as string);
        }
    }
    const genReport = async () => {
        
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
            let access: string | null = null;
            try {
                access = await testAccess(token) as string;

                setAccessLevel(access);
            } catch(err) {
                console.error(err);
            } finally {
                if(access == 'M')
                    redirect('/RestaurantManager');
                    // router.push('/RestaurantManager');
                    // navigate('/restaurant-manager');
                else if(access != 'A')
                    redirect('/');
                    // router.push('/');
                    // navigate('/');
            }
        }
        
        getAccessLevel();
    }, []);

    return (
        <>
            <Banner/>
            {/* {accessLevel == 'A' && <h1>Administrator</h1>} */}
            <div className = 'report-container'>
                <button className='reload-button' onClick={genReport}>&#x21bb;</button>
            </div>
            <div className='delete-restaurant-container'>
                <select className='admin-dropdown' onChange={e => setRestaurantName(e.target.value)} value={restaurantName}>
                    <option value="" disabled>Select an Restaurant</option>
                    {restaurants?.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                ))}</select>
                <button className='delete-restaurant-button' onClick={()=>{delRestaurant(); setRestaurantName(""); listRest();} }>Delete Restaurant</button>
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