"use client";

import { useLocation, useNavigate } from 'react-router-dom';

import RestaurantDetails from '../components/RestaurantDetails';

import { createRestaurant } from '../routes/restaurants';

export default function CreateRestaurant() {
    const location = useLocation();
    const navigate = useNavigate();

    const validateRestaurant = async (email: string, username: string, password: string, name: string, address: string, cityState: string, zipcode: string) => {
        // TODO: Check to make sure all of the data enter is correct (i.e. a state is a string of size 2, a zipcode is all numbers, etc)

        try {
            await createRestaurant(email, username, password, name, address, cityState, zipcode);

            navigate('/restaurant-manager');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <RestaurantDetails
            callback={validateRestaurant}
            password={() => {
                if(!location.state)
                    return '';

                if(location.state.password)
                    return location.state.password;
            }}
            username={() => {
                if(!location.state)
                    return '';

                if(location.state.username)
                    return location.state.username;
            }}
        />
    );
}