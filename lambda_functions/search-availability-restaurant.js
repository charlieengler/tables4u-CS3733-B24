import mysql from 'mysql'

export const handler = async (event) => {

    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    })

    let active = (restaurantID, date) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT isActive FROM Restaurants WHERE uid = ?", [restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    
    let closed = (restaurantID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT closings FROM Restaurants WHERE uid = ?", [restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    let getSchedules = (restaurantID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT schedule_monday, schedule_tuesday, schedule_wednesday, schedule_thursday, schedule_friday, schedule_saturday, schedule_sunday FROM tables4u.Restaurants WHERE uid =?;", [restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    let getHours = (scheduleID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT opening,closing FROM tables4u.Schedules WHERE sid = ?;", [scheduleID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    let getReservations = (restaurantID, date) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT date,time,table_num,guests FROM tables4u.Reservations WHERE restaurant = ? AND date =?;", [restaurantID, date], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let getNumTables = (restaurantID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT COUNT(restaurant) FROM Tables WHERE restaurant = ?", [restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    let isActive = await active(event.restaurantID)
    if(isActive.isActive == false){
        return {
            statusCode: 400,
            body: {
                "error": "Restaurant is inactive"
            }
        }
    }
    
    let isClosed = await closed(event.restaurantID)
    if((isClosed.closings).includes(event.date)){
        return {
            statusCode: 400,
            body: {
                "error": "Restaurant is closed"
            }
        }
    }

    let d = new Date(event.date)

    let day = d.getDay()
    // console.log(day)

    let schedules= await getSchedules(event.restaurantID)
    // console.log("schedule", schedules)
    let schedule=0
    switch(day){
    case 0:
        schedule = schedules.schedule_sunday
        break;
    case 1:
        schedule = schedules.schedule_monday
        break;
    case 2:
        schedule = schedules.schedule_tuesday
        break;
    case 3:
        schedule = schedules.schedule_wednesday
        break;
    case 4:
        schedule = schedules.schedule_thursday
        break;
    case 5:
        schedule = schedules.schedule_friday
        break;
    case 6: 
        schedule = schedules.schedule_saturday
        break;
    default:
        return{
        statusCode:400,
        body:{
            "error": "No Schedule Found"
        }
        }
    }

    let hours = await getHours(schedule)
    let reservations = await getReservations(event.restaurantID, event.date)

    // console.log(hours)
    // console.log(reservations)

    let numTables = (await getNumTables(event.restaurantID))['COUNT(restaurant)']
    // console.log(numTables)

    let reservedTables = []
    for (const reservation of reservations) {
        reservedTables.push([reservation.time, reservation.table_num])
    }
    // console.log(reservedTables)


    function createCountsObject(start, end, increment) {
        const counts = {};
        for (let key = start; key <= end; key += increment) {
            counts[key] = 0; // Initialize each key with 0
        }
        return counts;
    }
    
    // Example: Start at 1, end at 10, increment by 2
    const counts = createCountsObject(hours.opening, hours.closing, 100);
    // console.log(counts);


    reservedTables.forEach(row => {
        const value = row[0]
        counts[value] = (counts[value] || 0) + 1;
    })

    // console.log(counts)

    // let unavailableTimes = []
    // for(let time = hours.opening; time < hours.closing; time=time+100){

    // }

    let availableTimes = []
    for(let time = hours.opening; time < hours.closing; time=time+100){
        if(counts[time] < numTables){
            availableTimes.push(time)
        }
    }
    // console.log(availableTimes)


    pool.end()

    if(availableTimes.length > 0){
        return{
            statusCode:200,
            result: {
                "Avaialble Times: " : availableTimes
            }
        }
    }
    else{
        return{
            statusCode: 400,
            body: {
                "error": "No available times"
            }
        }
    }
}