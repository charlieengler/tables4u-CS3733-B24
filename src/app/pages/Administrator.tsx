"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

import testAccess from '../routes/test-access';

export default function Administrator() {
    const [accessLevel, setAccessLevel] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const getAccessLevel = async () => {
            const token: string | null = secureLocalStorage.getItem('token') as string;
            try {
                const access = await testAccess(token) as string;

                if(access == 'M')
                    navigate('/restaurant-manager');
                else if(access != 'A')
                    navigate('/');

                setAccessLevel(access);
            } catch(err) {
                console.error(err);
            }
        }
        
        getAccessLevel();
    }, []);

    return (
        <>
            {accessLevel == 'A' && <h1>Administrator</h1>}
        </>
        
    );
}