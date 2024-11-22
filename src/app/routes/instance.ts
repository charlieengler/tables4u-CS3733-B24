import axios from 'axios';

export default function createInstance(baseURL: string) {
    const instance = axios.create({
        baseURL: baseURL,
    });

    return instance;
}