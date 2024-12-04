"use client";

import { useEffect, useState } from 'react';

import { redirect } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

import { deleteRestaurant, listRestaurants, generateReport } from '../routes/restaurants';
import { cancelReservation } from '../routes/consumer';

import Banner from '../components/Banner';

import testAccess from '../routes/test-access';
import '../page-styles/Admin.css';
import '../page-styles/RestaurantManager.css';

export default function Administrator() {
    const [accessLevel, setAccessLevel] = useState("");
    const [restaurantName, setRestaurantName] = useState('');
    const [uids, setUIDs] = useState<number[] | null>();
    const [restaurants, setRestaurants] = useState<string[]>([]);
    const [utilizations, setUtilizations] = useState([]);
    const [availabilitys, setAvailability] = useState([]);
    const [tables, setTables] = useState<any[]>([]);
    const [reserved, setReserved] = useState([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [rid, setRid] = useState('');
    const [rids, setRids] = useState<number[]>([]);
    const [date1, setDate] = useState<string>("");

    const genReport = async (date: string, name:string) => {
        console.log("current Rest: ",name)
        setDate(date);
        
        if(uids!=null && name!=""){
            const uid = uids[restaurants.indexOf(name)];
            const report = await generateReport(uid, date) as any;
            setReserved(report.reserved);
            setTables(report.tables);
            setUtilizations(report.utilization);
            setAvailability(report.availability);
            setReservations(report.reservations);
            setRids(report.reservations.map((res:{rid:number;})=>res.rid)) 
        }
        else{
            alert("No tables exist for slected restaurant. \nEnsure a restaurant is selected.");
        }
    }
    
    const listRest = async () => {
        try {
            const rest = await listRestaurants() as any[];
            setRestaurants(rest.map((restaurant: { name: string; }) => restaurant.name));
            setUIDs(rest.map((restaurant: { uid: number; }) => restaurant.uid));
        } catch (err) {
            console.log(err);
        }
    }
   const updateRestaurantName = async (name: string) =>{
    console.log("new rest: ",name)
    setRestaurantName(name)

    console.log("new name set: ",restaurantName)
    if(date1!=null && date1!=""){
        genReport(date1, name);
    }
   }
    const delRestaurant = async () => {
        try {
            await deleteRestaurant(restaurantName);
            console.log("restaurant Deleted: ", restaurantName)
            await listRest()

        } catch (err) {
            console.log(err);
        }
    }
    const delReservation = async (rid:string) => {
        try {
            const cCodes =  reservations.map((res:{confirmation_code:string;})=>res.confirmation_code)
            await cancelReservation(cCodes[rids.indexOf(parseInt(rid))]);
            await genReport(date1, restaurantName);

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        const getAccessLevel = async () => {
            const token: string | null = secureLocalStorage.getItem('token') as string;
            let access: string | null = null;
            try {
                access = await testAccess(token) as string;

                setAccessLevel(access);
            } catch(err) {
                console.error(err);
            } finally {
                if(access == 'M')
                    redirect('/RestaurantManager');
                else if(access != 'A')
                    redirect('/');
            }
        }
        getAccessLevel();
        listRest();
    }, []);

    return (
        <>
            <Banner/>
            <div className='restaurant-data-container'>
                <input className='restaurant-data-date-input2' onChange={e => genReport(e.target.value, restaurantName)} type='date'/>
                <div className='restaurant-data'>
                    {reserved && tables && utilizations && reserved.map((reservation, i) => {
                        const resString = (reservation[0] as number).toString();
                        const time = resString.substring(0, Math.floor(resString.length/2)) + ":" + resString.substring(Math.floor(resString.length/2), resString.length);

                        return (
                            <div className='restaurant-data-timeslot-container' key={i.toString() + '-data'}>
                                <div className='restaurant-data-table-time'>{time}</div>

                                <div className='restaurant-data-timeslot'>
                                    {(reservation as any[]).map((res, j) => {
                                        return (
                                            <div key={j.toString() + '-data-timeslot'}>
                                                {j > 0 && <div className={'restaurant-data-table' + (res ? ' reserved' : '')}>{tables[j-1].seats}</div>}
                                            </div>
                                        );
                                    })}
                                    <div className='admin-data-utilization'>{utilizations[i]}% : {availabilitys[i]}%</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className='delete-restaurant-container'>
                <select className='admin-dropdown' onChange={e => updateRestaurantName(e.target.value)} value={restaurantName}>
                    <option value="" disabled>Select an Restaurant</option>
                    {restaurants?.map((option, index) => (
                        <option key={index} value={option}>
                            {option} 
                        </option>
                ))}</select>
                <button className='delete-restaurant-button' onClick={()=>{delRestaurant(); setRestaurantName("");} }>Delete Restaurant</button>
            </div>
            <div className='delete-restaurant-container'>
                <button className='reload-button' onClick={listRest}>&#x21bb;</button>
                <h1 className='restaurants-header'>Restaurants:</h1>
                <div className='list-container'>
                    <h1 className='restaurants-text'> {restaurants?.map(restaunt => <p key={restaunt}>{restaunt}</p>)}</h1>
                </div>
            </div>
            <div className='delete-restaurant-container'>
                <h1 className='restaurants-header'>Reservations:</h1>
                <div className='list-container'>
                <h1 className='restaurants-text'>Rid-Time:Table {reservations.map((res: {rid: number, time: number, table_num: number; }) => ""+res.rid+"-"+ res.time +": "+res.table_num).map(rest => <p key={rest}>{rest}</p>)}</h1> 
                </div>
            </div>
            <div className='delete-restaurant-container'>
                <select className='admin-dropdown' onChange={e => setRid(e.target.value)} value={rid}>
                    <option value="" disabled>Select a Reservation</option>
                    {rids?.map((option, index) => (
                        <option key={index} value={option}>
                            {option} 
                        </option>
                ))}</select>
                <button className='delete-restaurant-button' onClick={()=>{delReservation(rid); setRid("");} }>Delete Reservation</button>
            </div>
        </>
        
    );
}