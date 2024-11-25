import secureLocalStorage from 'react-secure-storage';

import createInstance from "./instance";

export function createRestaurant(email: string, username: string, password: string, restaurantName: string, address: string, cityState: string, zipcode: string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Update-1');

        const city = cityState.split(',')[0];
        const state = cityState.split(', ')[1];

        instance.post('/create-restaurant', {
            email: email,
            username: username,
            password: password,
            restaurantName: restaurantName,
            address: address,
            city: city,
            state: state,
            zipcode: zipcode,
        }).then(res => {
            if(res.data.statusCode == 200) {
                const resUsername = res.data.body.username;
                const resRestaurantName = res.data.body.restaurantName;
                const resUid = res.data.body.uid;

                secureLocalStorage.setItem('uid', Number(resUid));

                resolve({
                    username: resUsername,
                    restaurantName: resRestaurantName,
                    uid: resUid,
                });
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function getRestaurantById(uid: number) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Update-1');

        instance.post('/get-restaurant/id', {uid: uid}).then(res => {
            if(res.data.statusCode == 200) {
                const restaurant = res.data.body;

                resolve(restaurant);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}
export function deleteRestaurant(restaurantName: string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Update-3');


        instance.post('/delete-restaurant', {

            restaurantName: restaurantName
  
        }).then(res => {
            if(res.data.statusCode == 200) {
                const resRestaurantName = res.data.body.restaurantName;
                resolve({
                    restaurantName: resRestaurantName
                });
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}