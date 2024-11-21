import secureLocalStorage from 'react-secure-storage';

import getInstance from './instance';

export default function login(username: string, password: string) {
    return new Promise((resolve, reject) => {
        const instance = getInstance('https://61f3l9b77g.execute-api.us-east-2.amazonaws.com/Initial');

        instance.post('/login', {'username': username, 'password': password}).then(res => {
            const token = res.data.body.token;
            const redirect = res.data.body.redirect;

            secureLocalStorage.setItem('token', token);

            resolve(redirect);
        }).catch(err => {
            reject(err);
        });
    });
}