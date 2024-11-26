import createInstance from "./instance";

export function findReservation(email: String, confCode: String) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://nlujztvubh.execute-api.us-east-2.amazonaws.com/Consumer-1');

        instance.post('/find-reservation', {email: email, confCode: confCode}).then(res => {
            if(res.data.statusCode == 200) {
                const restaruant = res.data.result.restaurant;
                const date = res.data.result.date;
                const time = res.data.result.time;
                const guests = res.data.result.guests
                const confCode = res.data.result.confirmationCode

                resolve({
                    restaurant: restaruant,
                    date: date,
                    time: time,
                    guests: guests,
                    confCode: confCode
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


export function cancelReservation(confCode: String) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://nlujztvubh.execute-api.us-east-2.amazonaws.com/Consumer-1');

        instance.post('/cancel-reservation', {confCode: confCode}).then(res => {
            if(res.data.statusCode == 200) {
                resolve({
                    status: "Cancelled"
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

export function listActiveRestaurants(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://nlujztvubh.execute-api.us-east-2.amazonaws.com/Consumer-1');

        instance.get('/list-active-restaurants').then(res => {
            if(res.data.statusCode == 200) {
                const restaruants = res.data.body.activeRestaurants.map((restaurant: { name: string }) => restaurant.name);
                resolve(restaruants);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}