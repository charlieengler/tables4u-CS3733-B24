import secureLocalStorage from 'react-secure-storage';

import createInstance from './instance';

export function login(username: string, password: string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://61f3l9b77g.execute-api.us-east-2.amazonaws.com/Initial');

        instance.post('/login', {'username': username, 'password': password}).then(res => {
            if(res.data.statusCode == 200) {
                const token = res.data.body.token;
                const redirect = res.data.body.redirect;

                // TODO: If the user is a restaurant manager, also fetch the restaurant they manage
                secureLocalStorage.setItem('token', token);

                resolve(redirect);
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function logout() {
    return new Promise((resolve, reject) => {
        try {
            secureLocalStorage.removeItem('token');
            if(secureLocalStorage.getItem('uid'))
                secureLocalStorage.removeItem('uid');

            resolve('Successfully logged out.');
        } catch (err) {
            reject(err);
        }
    });
}