import { useEffect, useState } from 'react';

import './styles/RestaurantDetails.css';

export default function RestaurantDetails(props: any) {
    const [address, setAddress] = useState('');
    const [cityState, setCityState] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');
    const [zipcode, setZipcode] = useState('');

    useEffect(() => {
        if(props.address)
            setAddress(props.address);

        if(props.cityState)
            setCityState(props.cityState);

        if(props.email)
            setEmail(props.email);

        if(props.name)
            setName(props.name);

        if(props.password)
            setPassword(props.password);

        if(props.repeatPassword)
            setRepeatPassword(props.repeatPassword);

        if(props.username)
            setUsername(props.username);

        if(props.zipcode)
            setZipcode(props.zipcode);
    }, []);

    return (
        <>
            <div className='restaurant-details-container'>
                <div className='restaurant-details-title'>Enter Restaurant Details</div>

                <div className='restaurant-details-subcontainer'>
                    <div className='restaurant-details-subtitle'>Restaurant Manager Account</div>
                    <input className='restaurant-details-input' onChange={e => setEmail(e.target.value)} placeholder='Email' type='text' value={email}></input>
                    <input className='restaurant-details-input' onChange={e => setUsername(e.target.value)} placeholder='Username' type='text' value={username}></input>
                    <input className='restaurant-details-input' onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' value={password}></input>
                    <input className='restaurant-details-input' onChange={e => setRepeatPassword(e.target.value)} placeholder='Repeat Password' type='password' value={repeatPassword}></input>
                </div>
                
                <div className='restaurant-details-subcontainer'>
                    <div className='restaurant-details-subtitle'>Restaurant Information</div>
                    <input className='restaurant-details-input' onChange={e => setName(e.target.value)} placeholder='Restaurant Name' type='text' value={name}></input>
                    <input className='restaurant-details-input' onChange={e => setAddress(e.target.value)} placeholder='Restaurant Address' type='text' value={address}></input>
                    <input className='restaurant-details-input' onChange={e => setCityState(e.target.value)} placeholder='Restaurant City, State' type='text' value={cityState}></input>
                    <input className='restaurant-details-input' onChange={e => setZipcode(e.target.value)} placeholder='Restaurant Zipcode' type='text' value={zipcode}></input>
                </div>

                <button className='restaurant-details-submit-button' onClick={() => props.callback(email, username, password, name, address, cityState, zipcode)}>Submit</button>
            </div>
        </>
    );
}