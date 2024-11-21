import secureLocalStorage from 'react-secure-storage';

export default function logout() {
    return new Promise((resolve, reject) => {
        try {
            secureLocalStorage.removeItem('token');
            resolve('Successfully logged out.');
        } catch (err) {
            reject(err);
        }
    });
}