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
    const [todaysDate, setToday] = useState<Date>(new Date())

    useEffect(() => {
        const fetchOptions = async () => {
            try{
                const restaurants = await listActiveRestaurants();
                setRestaurantList(restaurants);
                setToday(new Date())
            }
            catch{
                showNotification("No Active Restaurants", 10000)
            }
            
        };
        fetchOptions();
    }, []);

    const dateInPast = function(firstDate: Date, secondDate: Date) {
        if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
          return true;
        }
        return false;
    }


    const findTables = async () => {
        const temp: number[] = 
        date.split('-').map(Number);
        const givenDate: Date = 
        new Date(Date.UTC(temp[0], 
        temp[1] - 1, temp[2], 5));

        if(dateInPast(givenDate, todaysDate)){
            showNotification("Please select a date in the future", 5000)
        }
        else{
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
                } catch (err) {
                    showNotification("No Available Tables", 5000)
                    console.log(err)
                }
            }
        }
    }

    const findRes = async () => {
        try {
            const resData = await findReservation(email, confCode) as Reservation
            
            const temp: number[] = 
            resData.date.split('-').map(Number);
            const reservationDate: Date = 
            new Date(Date.UTC(temp[0], 
            temp[1] - 1, temp[2], 5));
            
            if(dateInPast(reservationDate, todaysDate)){
                showNotification("Reservation has passed", 5000)
            }
            else{
                setReservation(resData)
            }
        }
        catch (err) {
            showNotification("Reservation Doesn't Exist", 5000)
            setReservation(null)
        }
    }

    const cancelRes = async () => {
        try {
            if (reservation != null) {
                
                const temp: number[] = 
                reservation.date.split('-').map(Number);
                const reservationDate: Date = 
                new Date(Date.UTC(temp[0], 
                temp[1] - 1, temp[2], 5));
            
                if(dateInPast(reservationDate, todaysDate)){
                    showNotification("Reservation has passed", 5000)
                }
                else{
                    await cancelReservation(reservation.confCode)
                    setReservation(null)
                    showNotification("Cancelled", 5000)
                }
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
        setSelectedTime(() => ({
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
            <div className={styles.consumerContainer}>
                <div className={styles.searchFindContainer}>
                    <div className={styles.searchContainer}>
                        <div className={styles.containerTitle}>Restaurant Search</div>
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
                            ))}
                        </select>
                        <button className={styles.searchButton} onClick={findTables}>Search</button>
                    </div>

                    <div className={styles.findReservationContainer}>
                        <div className={styles.containerTitle}>Reservation Search</div>
                        <input className={styles.searchInput} onChange={e => setEmail(e.target.value)} placeholder="Email" type="text" value={email}></input>
                        <input className={styles.searchInput} onChange={e => setConfCode(e.target.value)} placeholder="Confirmation Code" type="text" value={confCode}></input>
                        <div className={styles.reservationSubcontainer}>
                            <div className={styles.reservationInfo}>{reservation ? reservation.restaurant + " on " + reservation.date + " at " + reservation.time + " for " + reservation.guests + " guests" : ''}</div>
                        </div>
                        <button className={styles.findReservationButton} onClick={findRes}>Find Reservation</button>
                        <button className={styles.cancelReservationButton} onClick={cancelRes}>Cancel Reservation</button>
                    </div>
                </div>

                <div className={styles.restaurantContainer}>
                    <button className={styles.createResButton} onClick={createResClick}>Create Reservation</button>
                    {restaurantList.length > 0 ? restaurantList.map((restaurant, index) => {
                        return (
                            <div key={index} className={styles.restaurantItem}>
                                <div className={styles.restaurantTitle}>{restaurant}</div>
                                <div className={styles.restaurantTimesContainer}>
                                    {getRestaurantTime(restaurant).length > 0 ? getRestaurantTime(restaurant).map((time, timeIndex) => (
                                        <button
                                            key={`${restaurant}-${time}`}
                                            onClick={() => handleTimeSelect(restaurant, time)}
                                            className={`${styles.timeButton} ${isSelected(restaurant, time) ? styles.selected : ''}`}
                                        >
                                            {time}
                                        </button>
                                    )) : <div>Please search for a reservation time, date, and guest count.</div>}
                                </div>
                            </div>
                        )}) : (restaurantList.length == 0 ? 
                            <div>No Active Restaurants</div> 
                            :
                            <div>Loading Restaurants...</div>
                        )}
                </div>
            </div>
            
            <NotificationBox visible={visible} text={text} />
        </>
    );
}