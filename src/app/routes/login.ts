import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const instance = axios.create({
    baseURL: 'https://61f3l9b77g.execute-api.us-east-2.amazonaws.com/Initial',
});

export default function login(username: string, password: string) {
    instance.post('/login', {'username': username, 'password': password}).then(res => {
        const token = res.data.body.token;
        const redirect = res.data.body.redirect;

        secureLocalStorage.setItem('token', token);
    }).catch(err => {
        console.error(err);
    });
}