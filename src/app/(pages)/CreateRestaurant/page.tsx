"use client";

import { redirect } from 'next/navigation';

import secureLocalStorage from 'react-secure-storage';

import Banner from '../../components/Banner';
import RestaurantDetails from '../../components/RestaurantDetails';

import { createRestaurant } from '../../routes/restaurants';


function CreateRestaurant() {
    const validateRestaurant = async (email: string, username: string, password: string, name: string, address: string, cityState: string, zipcode: string) => {
        // TODO: Check to make sure all of the data enter is correct (i.e. a state is a string of size 2, a zipcode is all numbers, etc)

        try {
            const resDetails = await createRestaurant(email, username, password, name, address, cityState, zipcode) as any;
            console.log(resDetails);

            secureLocalStorage.setItem('eid', resDetails.eid);
            secureLocalStorage.setItem('username', resDetails.username);
            secureLocalStorage.setItem('uid', resDetails.uid);
        } catch (err) {
            console.error(err);
        } finally {
            redirect('/RestaurantManager');
        }
    }

    return (
        <>
            <Banner/>
            <RestaurantDetails
                callback={validateRestaurant}
            />
        </>
    );
}

export default CreateRestaurant;