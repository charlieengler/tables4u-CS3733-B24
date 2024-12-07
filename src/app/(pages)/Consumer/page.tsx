"use client";

import { useEffect, useState } from 'react';
import { findReservation, cancelReservation, listActiveRestaurants, searchAvailabilityRestaurant } from '../../routes/consumer';

import Banner from '../../components/Banner';

import '../styles/Consumer.css';

interface Reservation {
    restaurant: string;
    date: String;
    time: Number;
    guests: Number;
    confCode: String;
}

export default function Consumer() {
    const [email, setEmail] = useState('')
    const [confCode, setConfCode] = useState('')
    const [reservation, setReservation] = useState<Reservation | null>(null)
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [guests, setGuests] = useState('')
    const [restaurant, setRestaurant] = useState('')
    const [restaurantList, setRestaurantList] = useState<string[]>([])
    const [restaurantTimes, setRestaurantTimes] = useState<{ [key: string]: number[] }>({});
    
    useEffect(() => {
        const fetchOptions = async () => {
            const restaurants = await listActiveRestaurants();
            setRestaurantList(restaurants);
        };
        fetchOptions();
    }, []);

    const findTables = async () => {
        if(restaurant == ''){ //search all restaurants

        }
        else{   //search given restaurant
            try{
                const times: number[] = await searchAvailabilityRestaurant(restaurant, date) as number[];
                setRestaurantTimes(prevTimes => ({
                    ...prevTimes,
                    [restaurant]: times,
                }));
                console.log(restaurantTimes)    
            }
            catch (err){
                console.log(err)
            }
        }
    }
    
    const findRes = async () => {
        try{
            const resData = await findReservation(email, confCode) as Reservation
            setReservation(resData)
        }
        catch (err){
            setReservation(null)
        }
    }

    const cancelRes = async () => {
        try{
            if(reservation != null){
                console.log(reservation.confCode)
                await cancelReservation(reservation.confCode)
                setReservation(null)
            }
        }
        catch (err){
            console.log(err)
        }
    }

    return (
        <>
            <Banner/>
            <div className='create-reservation-container'>
                <input className='search-input' onChange={e => setDate(e.target.value)} placeholder="Date" type="text" value={date}></input>
                <input className='search-input' onChange={e => setTime(e.target.value)} placeholder="Time" type="text" value={time}></input>
                <input className='search-input' onChange={e => setGuests(e.target.value)} placeholder="Guests" type="text" value={guests}></input>
                <select className='dropdown' onChange={e => setRestaurant(e.target.value)} value={restaurant}>
                    <option value="" disabled>Select a Restaurant</option>
                    {restaurantList?.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                ))}</select>
                <button className='search-button' onClick={findRes}>Search - Does not work yet</button>
            </div>

            <div className='restaurant-container'>
                {restaurantList.length > 0 ? restaurantList.map((restaurant, index) => (
                    <div key={index} className="restaurant-item">
                        {restaurant}
                    </div>
                )) : (restaurantList.length == 0 ? 
                <div>No Active Restaurants</div> 
                : <div>Loading Restaurants...</div>)}
            </div>

            <div className='find-reservation-container'>
                <input className='search-input' onChange={e => setEmail(e.target.value)} placeholder="Email" type="text" value={email}></input>
                <input className='search-input' onChange={e => setConfCode(e.target.value)} placeholder="Confirmation Code" type="text" value={confCode}></input>
                <div className='reservation-subcontainer'>
                    <div className='reservation-info'>{reservation ? reservation.restaurant + " on " + reservation.date + " at " + reservation.time + " for " + reservation.guests + " guests": ''}</div>
                </div>
                <button className='find-reservation-button' onClick={findRes}>Find Reservation</button>
                <button className='cancel-reservation-button' onClick={cancelRes}>Cancel Reservation</button>           
            </div>
            
            
            
        </>
    );
}