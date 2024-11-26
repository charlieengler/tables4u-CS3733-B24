import secureLocalStorage from 'react-secure-storage';

import createInstance from "./instance";

export function createRestaurant(email: string, username: string, password: string, restaurantName: string, address: string, cityState: string, zipcode: string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

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

export function deleteRestaurant(uid: number | string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        // TODO: Should probably check to make sure the person deleting it has the proper credentials
        instance.post('/delete-restaurant', {restaurant: uid}).then(res => {
            if(res.data.statusCode == 200)
                resolve('Successfully deleted restaurant.');
            else
                reject(res.data.body.error);
        }).catch(err => {
            reject(err);
        });
    });
}

export function generateReport(uid: number, date: string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        instance.post('/gen-report', {uid: uid, date: date}).then(res => {
            if(res.data.statusCode == 200) {
                resolve(res.data.body);
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
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

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


export function getRestaurantByManager(eid: number) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        instance.post('/get-restaurant/manager', {eid: eid}).then(res => {
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

export function getSchedule(sid: number) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        instance.post('/get-restaurant/schedule', {sid: sid}).then(res => {
            if(res.data.statusCode == 200) {
                const schedule = res.data.body.schedule;

                resolve(schedule);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    })
}

export function toggleActivation(uid: number, eid: number) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        instance.post('/set-restaurant/toggle-activation', {uid: uid, eid: eid}).then(res => {
            if(res.data.statusCode == 200) {
                const status = res.data.body.status;

                resolve(status);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    })
}

export function updateClosingDates(uid: number, closings: string[]) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        instance.post('/set-restaurant/closings', {uid: uid, dates: closings}).then(res => {
            if(res.data.statusCode == 200) {
                const dates = res.data.body.dates;

                resolve(dates);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function updateRestaurantDetails(uid: number, eid: number, email: string, username: string, password: string, name: string, address: string, cityState: string, zipcode: string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');
        instance.post('/set-restaurant/details', {
            uid: uid,
            eid: eid,
            email: email,
            username: username,
            password: password,
            name: name,
            address: address,
            city: cityState.split(',')[0],
            state: cityState.split(', ')[1],
            zipcode: zipcode,
        }).then(res => {
            if(res.data.statusCode == 200) {
                const details = res.data.body;

                resolve(details);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function updateScheduleTimes(sid: number, opening: number, closing: number) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        instance.post('/set-restaurant/schedule', {sid: sid, opening: opening, closing: closing}).then(res => {
            if(res.data.statusCode == 200) {
                const status = res.data.body.message;

                resolve(status);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function updateTableCount(seatCount: number, numTables: number, uid: number) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');

        instance.post('/set-restaurant/tables', {seatCount: seatCount, numTables: numTables, uid: uid}).then(res => {
            console.log(res)
            if(res.data.statusCode == 200) {
                const tables = res.data.body.tables;

                resolve(tables);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}
export function listRestaurants() {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://h3q7tcd7ji.execute-api.us-east-2.amazonaws.com/Development');
        instance.get('/list-restaurants', {
        }).then(res => {
            if(res.data.statusCode == 200) {
                const resRestaurantName = res.data.body.restaurants.map((restaurant: { name: any; }) => restaurant.name);
                resolve(
                    resRestaurantName
                );
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}