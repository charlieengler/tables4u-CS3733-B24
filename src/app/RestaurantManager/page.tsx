'use client';

import React, { createRef, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

import secureLocalStorage from 'react-secure-storage';

import Banner from '../components/Banner';
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

import '../page-styles/RestaurantManager.css';

export default function RestaurantManager() {
    const days = ['M', 'T', 'W', 'R', 'F', 'S', 'S'];

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [closings, setClosings] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [forceRedraw, setForceRedraw] = useState(0);
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
    const [updatedSchedules, setUpdatedSchedules] = useState([false, false, false, false, false, false, false]);
    const [updatedTables, setUpdatedTables] = useState([
        {value: 0, hasChanged: false},
        {value: 0, hasChanged: false},
        {value: 0, hasChanged: false},
        {value: 0, hasChanged: false},
        {value: 0, hasChanged: false},
        {value: 0, hasChanged: false},
        {value: 0, hasChanged: false},
        {value: 0, hasChanged: false},
    ]);
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
            return redirect('/');

        try {
            await deleteRestaurant(uid);
        } catch(err) {
            console.error(err);
        } finally {
            redirect('/');
        }
    }

    const genReport = async (uid: number, date: string) => {
        const report = await generateReport(uid, date) as any;
        const repTables = report.tables;
        const repReservations = report.reserved;

        for(let i = 0; i < repTables.length; i++) {
            for(let j = 0; j < repTables.length - 1; j++) {
                const t1 = repTables[i];
                const t2 = repTables[j];

                if(t1.seats < t2.seats) {
                    repTables[i] = t2;
                    repTables[j] = t1;

                    for(let k = 0; k < repReservations.length; k++) {
                        const r1 = repReservations[k][i+1];
                        const r2 = repReservations[k][j+1];

                        repReservations[k][i+1] = r2;
                        repReservations[k][j+1] = r1;
                    }
                }
            }
        }

        setReservations(repReservations);
        setTables(repTables);
        setUtilizations(report.utilization);
    }

    const activate = async (uid: number) => {
        if(!secureLocalStorage.getItem('eid'))
            return redirect('/');

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

    const updateSchedule = async (sid: number, opening: number, closing: number, scheduleIndex: number) => {
        try {
            const newSchedule = await updateScheduleTimes(sid, opening, closing) as any;
            const tempSchedules = schedules as any[];

            tempSchedules[scheduleIndex].opening = newSchedule.opening;
            tempSchedules[scheduleIndex].closing = newSchedule.closing;

            setSchedules(tempSchedules);
        } catch(err) {
            console.error(err);
        }
    }

    const updateTable = async (seatCount: number, numTables: number, uid: number) => {
        // TODO: Deleting a table fails if it's reserved
        try {
            const newTables = await updateTableCount(seatCount, numTables, uid);

            calcTableCounts(newTables as any[]);
            setTables(newTables as any[]);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if(secureLocalStorage.getItem('uid'))
            setUid(secureLocalStorage.getItem('uid') as number);
        else
            return redirect('/');

        if(secureLocalStorage.getItem('eid'))
            setManager(secureLocalStorage.getItem('eid') as number);
        else
            return redirect('/');

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
            <Banner/>
            <div className='restaurant-title'>{restaurantName}</div>
            <div className='restaurant-status-container'>
                <button className='restaurant-status-button' disabled={isActive} onClick={() => setIsEditingDetails(!isEditingDetails)}>Details</button>
                <button className='restaurant-status-button success' disabled={isActive} onClick={() => activate(uid as number)}>{isActive ? 'Already Active' : 'Activate'}</button>
                <button className='restaurant-status-button error' onClick={() => deleteRes(uid as number)}>Delete</button>
            </div>

            <div className='restaurant-container'>
                {isEditingDetails && 
                    <div className='restaurant-details-container'>
                        <button className='restaurant-details-close' onClick={() => setIsEditingDetails(false)}>
                            <div className='restaurant-details-close-text'>&#215;</div>
                        </button>
                        <RestaurantDetails
                            address={address}
                            callback={updateDetails}
                            cityState={city + ', ' + state}
                            email={email}
                            name={restaurantName}
                            username={username}
                            zipcode={zipcode}
                        />
                    </div>
                }

                <div className='restaurant-data-container'>
                    <div className='restaurant-container-title'>Daily Report</div>
                    <input className='restaurant-data-date-input' onChange={e => genReport(uid as number, e.target.value)} type='date'/>
                    <div className='restaurant-data'>
                        {reservations && tables && utilizations && reservations.map((reservation, i) => {
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
                                        <div className='restaurant-data-utilization'>{utilizations[i]}%</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='restaurant-controls-container'>
                    <div className='restaurant-closings-container'>
                        <div className='restaurant-container-title'>Closings</div>
                        {closings && closings.map((closing, index) => {
                            return (
                                <div className='restaurant-closings-date-container' key={index.toString() + '-closings'}>
                                    <input className='restaurant-closings-date' readOnly type='date' value={closing}/>
                                    <button
                                        className='restaurant-closings-delete'
                                        onClick={() => {
                                            const tempClosings = closings;

                                            tempClosings.splice(index, 1);

                                            updateClosings(uid as number, tempClosings);
                                        }}
                                    >
                                        <div className='restaurant-closings-delete-text'>&#215;</div>
                                    </button>
                                </div>
                            );
                        })}
                        {closings && 
                            <div className='restaurant-closings-date-container'>
                                <input className='restaurant-closings-date' ref={newClosingDateRef} type='date'/>
                                <button
                                    className='restaurant-closings-add'
                                    onClick={() => {
                                        if(newClosingDateRef.current == null)
                                            return;

                                        const tempClosings = closings;
                                        tempClosings.push(newClosingDateRef.current.value);

                                        updateClosings(uid as number, tempClosings);
                                    }}
                                >
                                    <div className='restaurant-closings-add-text'>+</div>
                                </button>
                            </div>
                        }
                    </div>

                    <div className='restaurant-schedule-container'>
                        <div className='restaurant-container-title'>Daily Schedules</div>
                        <div className='restaurant-schedule-days-container'>
                            <div className='restaurant-schedule-title-container'>
                                <div className='restaurant-schedule-title'>Day:</div>
                                <div className='restaurant-schedule-title'>Open:</div>
                                <div className='restaurant-schedule-title'>Close:</div>
                            </div>
                            {schedules && updatedSchedules && days.map((day, index) => {
                                return (
                                    <div className='restaurant-schedule-day-container' key={index.toString() + '-schedule-days'}>
                                        <div className='restaurant-schedule-day'>{day}</div>
                                        <input
                                            className='restaurant-schedule-timeslot'
                                            defaultValue={schedules[index].opening}
                                            disabled={isActive}
                                            onChange={e => {
                                                schedules[index].opening = Number(e.target.value);
                                                updatedSchedules[index] = true;

                                                setForceRedraw(forceRedraw + 1);
                                            }}
                                            type='number'
                                        />
                                        <input
                                            className='restaurant-schedule-timeslot'
                                            defaultValue={schedules[index].closing}
                                            disabled={isActive}
                                            onChange={e => {
                                                schedules[index].closing = Number(e.target.value);
                                                updatedSchedules[index] = true;

                                                setForceRedraw(forceRedraw + 1);
                                            }}
                                            type='number'
                                        />

                                        {updatedSchedules[index] && 
                                            <button
                                                className='restaurant-schedule-update-timeslot'
                                                onClick={async () => {
                                                    await updateSchedule(schedules[index].sid, schedules[index].opening, schedules[index].closing, index);
                                                    // TODO: Check to see if the above function call returned an error before disabling the update button
                                                    updatedSchedules[index] = false;
                                                    setForceRedraw(forceRedraw + 1);
                                                }}
                                            >
                                                Update
                                            </button>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='restaurant-tables-container'>
                        <div className='restaurant-container-title'>Tables</div>
                        <div className='restaurant-tables-title-container'>
                            <div className='restaurant-tables-title'>Number of Seats:</div>
                            <div className='restaurant-tables-title'>Number of Tables:</div>
                        </div>
                        <div className='restaurant-tables-counts-container'>
                            {tableCounts && uid && [1, 2, 3, 4, 5, 6, 7, 8].map((count, index) => {
                                return (
                                    <div className='restaurant-tables-count-container' key={index.toString() + '-schedule-tables'}>
                                        <div className='restaurant-tables-occupancy'>{count}</div>
                                        <input
                                            className='restaurant-tables-count'
                                            defaultValue={tableCounts[index]}
                                            disabled={isActive}
                                            onChange={e => {
                                                updatedTables[index].value = Number(e.target.value);
                                                updatedTables[index].hasChanged = true;
                                                setForceRedraw(forceRedraw + 1);
                                            }}
                                            type='number'
                                        />

                                        {updatedTables[index].hasChanged && 
                                            <button
                                                className='restaurant-tables-update-count'
                                                onClick={async () => {
                                                    await updateTable(count, updatedTables[index].value, uid as number);

                                                    // TODO: Check to see if the above function call returned an error before disabling the update button
                                                    updatedTables[index].hasChanged = false;
                                                    setForceRedraw(forceRedraw + 1);
                                                }}
                                            >
                                                ✓
                                            </button>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}