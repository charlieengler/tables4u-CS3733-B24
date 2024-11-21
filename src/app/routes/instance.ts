import axios from 'axios';

export default function getInstance(baseURL: string) {
    const instance = axios.create({
        baseURL: baseURL,
    });

    return instance;
}