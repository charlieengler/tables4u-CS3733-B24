"use client";

import { redirect } from 'next/navigation';
import { useState } from 'react';

import secureLocalStorage from 'react-secure-storage';

import Alert from '../../components/Alert';
import Banner from '../../components/Banner';
import RestaurantDetails from '../../components/RestaurantDetails';

import { createRestaurant } from '../../routes/restaurants';

function CreateRestaurant() {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const validateRestaurant = async (email: string, username: string, password: string, name: string, address: string, cityState: string, zipcode: string) => {
        try {
            const resDetails = await createRestaurant(email, username, password, name, address, cityState, zipcode) as any;

            secureLocalStorage.setItem('eid', resDetails.eid);
            secureLocalStorage.setItem('username', resDetails.username);
            secureLocalStorage.setItem('uid', resDetails.uid);
        } catch (err) {
            console.error(err);
            setAlertMessage(err as string);
        } finally {
            redirect('/RestaurantManager');
        }
    }

    return (
        <>
            <Banner/>
            <div className='create-restaurant-container'>
                <RestaurantDetails
                    callback={validateRestaurant}
                />
            </div>
            
            {alertMessage && <Alert callback={() => setAlertMessage(null)} message={alertMessage}>Unable to create restaurant!</Alert>}
        </>
    );
}

export default CreateRestaurant;
