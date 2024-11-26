'use client';

import { createRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import secureLocalStorage from 'react-secure-storage';

import RestaurantDetails from '../components/RestaurantDetails';

import {
    deleteRestaurant,
    generateReport,
    getRestaurantById,
    getSchedule,
    toggleActivation,
    updateClosingDates,
    updateRestaurantDetails,
    updateScheduleTimes,
    updateTableCount
} from '../routes/restaurants';

import { getUserById } from '../routes/user';

import './styles/RestaurantManager.css';

export default function RestaurantManager() {
    const navigate = useNavigate();
    const days = ['M', 'T', 'W', 'R', 'F', 'S', 'S'];

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [closings, setClosings] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [manager, setManager] = useState<number | null>(null);
    const [reservations, setReservations] = useState([]);
    const [restaurantName, setRestaurantName] = useState('');
    const [schedules, setSchedules] = useState<any[] | null>(null);
    const [state, setState] = useState('');
    const [tables, setTables] = useState<any[]>([]);
    const [tableCounts, setTableCounts] = useState<number[]>([]);
    const [uid, setUid] = useState<number | null>(null);
    const [username, setUsername] = useState('');
    const [utilizations, setUtilizations] = useState([]);
    const [zipcode, setZipcode] = useState('');

    const newClosingDateRef = createRef<HTMLInputElement>();

    const calcTableCounts = (currentTables: any[]) => {
        const tempTableCounts = [0, 0, 0, 0, 0, 0, 0, 0];
        for(let i = 0; i < currentTables.length; i++)
            tempTableCounts[currentTables[i].seats-1]++;

        setTableCounts(tempTableCounts);
    }

    const deleteRes = async (uid: number) => {
        if(!secureLocalStorage.getItem('eid'))
            navigate('/');

        const eid = secureLocalStorage.getItem('eid') as number;

        try {
            await deleteRestaurant(uid);

            navigate('/');
        } catch(err) {
            console.error(err);
        }
    }

    const genReport = async (uid: number, date: string) => {
        const report = await generateReport(uid, date) as any;

        setReservations(report.reserved);
        setTables(report.tables);
        setUtilizations(report.utilization);
    }

    const activate = async (uid: number) => {
        if(!secureLocalStorage.getItem('eid'))
            navigate('/');

        const eid = secureLocalStorage.getItem('eid') as number;

        try {
            const activeStatus = await toggleActivation(uid, eid) as boolean;

            setIsActive(activeStatus);
        } catch(err) {
            console.error(err);
        }
    }

    const updateClosings = async (uid: number, closings: string[]) => {
        try {
            const returnedDates = await updateClosingDates(uid, closings) as any;

            setClosings(JSON.parse(returnedDates));
        } catch(err) {
            console.error(err);
        }
    }

    const updateDetails = async (email: string, username: string, password: string, name: string, address: string, cityState: string, zipcode: string) => {
        // TODO: Verify that the password and repeat password is the same
        // TODO: Update the username in the banner if it changes
        try {
            const details = await updateRestaurantDetails(secureLocalStorage.getItem('uid') as number, secureLocalStorage.getItem('eid') as number, email, username, password, name, address, cityState, zipcode) as any;

            if(details) {
                if(details.manDetails) {
                    setEmail(details.manDetails.email);
                    setUsername(details.manDetails.username);
                }

                if(details.resDetails) {
                    setAddress(details.resDetails.address);
                    setRestaurantName(details.resDetails.name);
                    setCity(details.resDetails.city);
                    setState(details.resDetails.state);
                    setZipcode(details.resDetails.zipcode);
                }
            }
            

            setIsEditingDetails(false);
        } catch(err) {
            console.error(err);
        }
    }

    const updateSchedule = async (sid: number, opening: number, closing: number) => {
        try {
            await updateScheduleTimes(sid, opening, closing);
        } catch(err) {
            console.error(err);
        }
    }

    const updateTable = async (seatCount: number, numTables: number, uid: number) => {
        // TODO: Deleting a table fails if it's reserved
        try {
            const newTables = await updateTableCount(seatCount, numTables, uid);

            setTables(newTables as any[]);

            calcTableCounts(newTables as any[]);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if(secureLocalStorage.getItem('uid'))
            setUid(secureLocalStorage.getItem('uid') as number);
        else
            navigate('/');

        if(secureLocalStorage.getItem('eid'))
            setManager(secureLocalStorage.getItem('eid') as number);
        else
            navigate('/');

        const getRestaurantData = async (uid: number) => {
            const restaurant = await getRestaurantById(uid) as any;
            
            setAddress(restaurant.address);
            setCity(restaurant.city);
            setClosings(restaurant.closings);
            setIsActive(restaurant.isActive);
            setRestaurantName(restaurant.name);
            setState(restaurant.state);
            setTables(restaurant.tables);
            setZipcode(restaurant.zipcode);

            const tempSchedules = [{}, {}, {}, {}, {}, {}, {}];
            tempSchedules[0] = await getSchedule(restaurant.schedule_monday) as any;
            tempSchedules[1] = await getSchedule(restaurant.schedule_tuesday) as any;
            tempSchedules[2] = await getSchedule(restaurant.schedule_wednesday) as any;
            tempSchedules[3] = await getSchedule(restaurant.schedule_thursday) as any;
            tempSchedules[4] = await getSchedule(restaurant.schedule_friday) as any;
            tempSchedules[5] = await getSchedule(restaurant.schedule_saturday) as any;
            tempSchedules[6] = await getSchedule(restaurant.schedule_sunday) as any;

            setSchedules(tempSchedules);

            calcTableCounts(restaurant.tables);
        }

        const getManagerDate = async (eid: number) => {
            try {
                const manager = await getUserById(eid) as any;

                setEmail(manager.email);
                setUsername(manager.username);
            } catch(err) {
                console.error(err);
            }
        }

        getRestaurantData(secureLocalStorage.getItem('uid') as number);
        getManagerDate(secureLocalStorage.getItem('eid') as number);
    }, []);

    return (
        <>
            <div className='restaurant-title'>{restaurantName}</div>
            {isEditingDetails && <div className='restaurant-details-container'>
                <RestaurantDetails
                    address={address}
                    callback={updateDetails}
                    cityState={city + ', ' + state}
                    email={email}
                    name={restaurantName}
                    username={username}
                    zipcode={zipcode}
                />
            </div>}

            <div className='restaurant-container'>
                <div className='restaurant-data-container'>
                    <input className='restaurant-data-date-input' onChange={e => genReport(uid as number, e.target.value)} type='date'/>
                    <div className='restaurant-data'>
                        <div className='restaurant-data-timeslot'>
                            {reservations && tables && utilizations && reservations.map((reservation, i) => {
                                return (
                                    <div key={i.toString() + '-data'}>
                                        {(reservation as any[]).map((res, j) => {
                                            return (
                                                <div key={j.toString() + '-data-timeslot'}>
                                                    {j == 0 ? 
                                                        <>{res}</>
                                                        :
                                                        <div className={res ? 'restaurant-data-table-reserved' : 'restaurant-data-table'}>{tables[j-1].seats}</div>
                                                    }
                                                </div>
                                            );
                                        })}
                                        <div className='restaurant-data-utilization'>{utilizations[i]}%</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                <div className='restaurant-closings-container'>
                    {closings && closings.map((closing, index) => {
                        return (
                            <div key={index.toString() + '-closings'}>
                                <input className='restaurant-closing-date' readOnly type='date' value={closing}/>
                                <button
                                    className='restaurant-closing-delete'
                                    onClick={() => {
                                        const tempClosings = closings;

                                        tempClosings.splice(index, 1);

                                        updateClosings(uid as number, tempClosings);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    })}

                    {closings && 
                        <>
                            <input className='restaurant-closing-date' ref={newClosingDateRef} type='date'/>
                                <button
                                    className='restaurant-closing-add'
                                    onClick={() => {
                                        if(newClosingDateRef.current == null)
                                            return;

                                        const tempClosings = closings;
                                        tempClosings.push(newClosingDateRef.current.value);

                                        updateClosings(uid as number, tempClosings);
                                    }}
                                >
                                    Add
                                </button>
                        </>
                    }
                </div>

                <div className='restaurant-status-container'>
                    <button className='restaurant-status-edit-details' onClick={() => setIsEditingDetails(true)}>Edit Details</button>
                    <button className='restaurant-status-activate' onClick={() => activate(uid as number)}>{isActive ? 'Deactivate' : 'Activate'} Restaurant</button>
                    <button className='restaurant-status-delete' onClick={() => deleteRes(uid as number)}>Delete Restaurant</button>
                </div>

                <div className='restaurant-schedule-container'>
                
                        {schedules && days.map((day, index) => {
                            return (
                                <div className='restaurant-schedule-day-container' key={index.toString() + '-schedule-days'}>
                                    <div className='restaurant-schedule-day'>{day}</div>
                                    <input className='restaurant-schedule-timeslot' defaultValue={schedules[index].opening} onChange={e => updateSchedule(schedules[index].sid, Number(e.target.value), schedules[index].closing)} type='number'/>
                                    <input className='restaurant-schedule-timeslot' defaultValue={schedules[index].closing} onChange={e => updateSchedule(schedules[index].sid, schedules[index].opening, Number(e.target.value))} type='number'/>
                                </div>
                            );
                        })}

                    <div className='restaurant-schedule-tables-container'>
                        {tableCounts && uid && [1, 2, 3, 4, 5, 6, 7, 8].map((count, index) => {
                            return (
                                <div className='restaurant-schedule-table-count-container' key={index.toString() + '-schedule-tables'}>
                                    <div className='restaurant-schedule-table-occupancy'>{count}</div>
                                    <input className='restaurant-schedule-table-count' defaultValue={tableCounts[index]} onChange={e => updateTable(count, Number(e.target.value), uid as number)} type='number'/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}