"use client";

// import { useLocation, useNavigate } from 'react-router-dom';
// import { useRouter, withRouter } from 'next/router';
import { redirect } from 'next/navigation';

import Banner from '../components/Banner';
import RestaurantDetails from '../components/RestaurantDetails';

import { createRestaurant } from '../routes/restaurants';

function CreateRestaurant(props: any) {
    // const location = useLocation();
    // const navigate = useNavigate();
    // const router = useRouter();

    const validateRestaurant = async (email: string, username: string, password: string, name: string, address: string, cityState: string, zipcode: string) => {
        // TODO: Check to make sure all of the data enter is correct (i.e. a state is a string of size 2, a zipcode is all numbers, etc)

        try {
            await createRestaurant(email, username, password, name, address, cityState, zipcode);
        } catch (err) {
            console.error(err);
        } finally {
            // navigate('/restaurant-manager');
            // router.push('/RestaurantManager');
            redirect('/RestaurantManager');
        }
    }

    return (
        <>
            <Banner/>
            <RestaurantDetails
                callback={validateRestaurant}
                password={() => {
                    // if(!location.state)
                    //     return '';

                    // if(location.state.password)
                    //     return location.state.password;

                    // if(!props.router.query.password)
                    //     return '';

                    // if(props.router.query.password)
                    //     return props.router.query.password;
                }}
                username={() => {
                    // if(!location.state)
                    //     return '';

                    // if(location.state.username)
                    //     return location.state.username;

                    // if(!props.router.query.username)
                    //     return '';

                    // if(props.router.query.username)
                    //     return props.router.query.username;
                }}
            />
        </>
    );
}

// export default withRouter(CreateRestaurant);
export default CreateRestaurant;