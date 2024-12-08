"use client";

import { useEffect, useState } from 'react';
import { findReservation, cancelReservation, createReservation, listActiveRestaurants, searchAvailabilityRestaurant } from '../../routes/consumer';

import Banner from '../../components/Banner';
import NotificationBox from '../../components/NotificationBox';
import useNotification from "../../components/useNotification";
import '../../components/styles/NotificationBox.css'
import styles from '../styles/Consumer.module.css';

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
    const [selectedTime, setSelectedTime] = useState<{ [key: string]: number | null }>({});
    const { visible, text, showNotification } = useNotification();

    useEffect(() => {
        const fetchOptions = async () => {
            try{
                const restaurants = await listActiveRestaurants();
                setRestaurantList(restaurants);
            }
            catch{
                showNotification("No Active Restaurants", 10000)
            }
            
        };
        fetchOptions();
    }, []);

    const findTables = async () => {
        if (restaurant == '') { //search all restaurants
            for(const currentRestaurant of restaurantList){
                try {
                    const times: number[] = await searchAvailabilityRestaurant(currentRestaurant, date) as number[];
                    setRestaurantTimes(prevTimes => ({
                        ...prevTimes,
                        [currentRestaurant]: times,
                    }));
                }
                catch (err) {
                    showNotification("No Available Tables at " + currentRestaurant, 5000)
                    console.log(err)
                }
            }
        }
        else {   //search given restaurant
            try {
                const times: number[] = await searchAvailabilityRestaurant(restaurant, date) as number[];
                setRestaurantTimes(prevTimes => ({
                    ...prevTimes,
                    [restaurant]: times,
                }));
            }
            catch (err) {
                showNotification("No Available Tables", 5000)
                console.log(err)
            }
        }
    }

    const findRes = async () => {
        try {
            const resData = await findReservation(email, confCode) as Reservation
            setReservation(resData)
        }
        catch (err) {
            showNotification("Reservation Doesn't Exist", 5000)
            setReservation(null)
        }
    }

    const cancelRes = async () => {
        try {
            if (reservation != null) {
                console.log(reservation.confCode)
                await cancelReservation(reservation.confCode)
                setReservation(null)
                showNotification("Cancelled", 5000)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const getRestaurantTime = (restaurant: string) => {
        const timeArray = restaurantTimes[restaurant]
        if (timeArray != undefined) {
                return timeArray
        }
        else{
            return [];
        }
    }

    const handleTimeSelect = async (restaurant: string, time: number) => {
        setTime(String(time))
        setRestaurant(restaurant)
        setSelectedTime((prev) => ({
            ...prev,
            [restaurant]: time, // Store the selected time for the specific restaurant
        }));
    }

    const isSelected = (restaurant: string, time: number) => {
        return selectedTime[restaurant] === time;
        
    };

    const createResClick = async () => {
        if(date != "" && time != "" && guests != "" && restaurant != "" && email != ""){
            try{
                const confCode = await createReservation(date, time, guests, restaurant, email) as string
                setConfCode(confCode)
                showNotification("Confirmed. Confirmation Code: " + confCode, 5000)
            }
            catch(err){
                showNotification(err as string, 5000)
            }
        }
        else{
            showNotification("Please fill all fields", 5000)
        }
    }

    return (
        <>
            <Banner/>
            <div className={styles.searchContainer}>
                <input className={styles.searchInput} onChange={e => setDate(e.target.value)} placeholder="Date: YYYY-MM-DD" type="text" value={date}></input>
                <input className={styles.searchInput} onChange={e => setTime(e.target.value)} placeholder="Time: 24HR" type="text" value={time}></input>
                <input className={styles.searchInput} onChange={e => setGuests(e.target.value)} placeholder="Number of Guests" type="text" value={guests}></input>
                <input className={styles.searchInput} onChange={e => setEmail(e.target.value)} placeholder="Email" type="text" value={email}></input>
                <select className={styles.dropdown} onChange={e => setRestaurant(e.target.value)} value={restaurant}>
                    <option value="" disabled>Select a Restaurant</option>
                    {restaurantList?.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}</select>
                <button className={styles.searchButton} onClick={findTables}>Search</button>
            </div>

            

            <div className={styles.restaurantContainer}>
            <button className={styles.createResButton} onClick={createResClick}>Create Reservation</button>
            {restaurantList.length > 0 ? restaurantList.map((restaurant, index) => {
                return (
                    <div key={index} className={styles.restaurantItem}>
                        <div>{restaurant}</div>
                        <div>
                            {getRestaurantTime(restaurant).map((time, timeIndex) => (
                                <button
                                    key={`${restaurant}-${time}`}
                                    onClick={() => handleTimeSelect(restaurant, time)}
                                    className={`${styles.timeButton} ${isSelected(restaurant, time) ? styles.selected : ''}`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}) : (restaurantList.length == 0 ? 
                <div>No Active Restaurants</div> 
                : <div>Loading Restaurants...</div>)}
            </div>

            <div className={styles.findReservationContainer}>
                <input className={styles.searchInput} onChange={e => setEmail(e.target.value)} placeholder="Email" type="text" value={email}></input>
                <input className={styles.searchInput} onChange={e => setConfCode(e.target.value)} placeholder="Confirmation Code" type="text" value={confCode}></input>
                <div className={styles.reservationSubcontainer}>
                    <div className={styles.reservationInfo}>{reservation ? reservation.restaurant + " on " + reservation.date + " at " + reservation.time + " for " + reservation.guests + " guests" : ''}</div>
                </div>
                <button className={styles.findReservationButton} onClick={findRes}>Find Reservation</button>
                <button className={styles.cancelReservationButton} onClick={cancelRes}>Cancel Reservation</button>
                
            </div>
            <NotificationBox visible={visible} text={text} />


        </>
    );
}