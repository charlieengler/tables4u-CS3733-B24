import secureLocalStorage from 'react-secure-storage';

import createInstance from './instance';

export function getUserById(eid: number) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://on7l6qgobb.execute-api.us-east-2.amazonaws.com/Initial')

        instance.post('/get-user-by-id', {eid: eid}).then(res => {
            if(res.data.statusCode == 200) {
                const email = res.data.body.email;
                const username = res.data.body.username;

                resolve({
                    email: email,
                    username: username,
                });
            } else {
                const error = res.data.body.error;

                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    })
}

export function login(username: string, password: string) {
    return new Promise((resolve, reject) => {
        const instance = createInstance('https://61f3l9b77g.execute-api.us-east-2.amazonaws.com/Initial');

        instance.post('/login', {'username': username, 'password': password}).then(res => {
            if(res.data.statusCode == 200) {
                const token = res.data.body.token;
                const eid = res.data.body.eid;
                const username = res.data.body.username;
                const redirect = res.data.body.redirect;

                // TODO: If the user is a restaurant manager, also fetch the restaurant they manage
                secureLocalStorage.setItem('token', token);
                secureLocalStorage.setItem('username', username);
                secureLocalStorage.setItem('eid', eid);

                resolve({
                    eid: eid,
                    redirect: redirect,
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

export function logout() {
    return new Promise((resolve, reject) => {
        try {
            secureLocalStorage.removeItem('token');
            secureLocalStorage.removeItem('uid');
            secureLocalStorage.removeItem('username');

            resolve('Successfully logged out.');
        } catch (err) {
            reject(err);
        }
    });
}