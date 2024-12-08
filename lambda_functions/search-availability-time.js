import mysql from 'mysql'

export const handler = async (event) => {

    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    })

    let getAllRestaurants = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants", (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

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

    let getNumTables = (restaurantID, seats) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Tables WHERE restaurant = ? AND seats >=?", [restaurantID, seats], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }


    let availableRestaurants = await getAllRestaurants()
    for(let i = 0; i < availableRestaurants.length; i++){
        let isActive = await active(availableRestaurants[i].uid)
        if(isActive.isActive == false){
            delete availableRestaurants[i]
            break
        }
        
        let isClosed = await closed(availableRestaurants[i].uid)
        if((isClosed.closings).includes(event.date)){
            delete availableRestaurants[i]
            break
        }

        let d = new Date(event.date)

        let day = d.getDay()

        let schedules= await getSchedules(availableRestaurants[i].uid)
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
            pool.end();
            return{
            statusCode:400,
            body:{
                "error": "No Schedule Found"
            }
            }
        }

        let hours = await getHours(schedule)
        let reservations = await getReservations(availableRestaurants[i].uid, event.date)

        let numTables = (await getNumTables(availableRestaurants[i].uid, event.seats)).length

        let reservedTables = []
        for (const reservation of reservations) {
            reservedTables.push([reservation.time, reservation.table_num])
        }


        function createCountsObject(start, end, increment) {
            const counts = {};
            for (let key = start; key <= end; key += increment) {
                counts[key] = 0; // Initialize each key with 0
            }
            return counts;
        }
        
        const counts = createCountsObject(hours.opening, hours.closing, 100);


        reservedTables.forEach(row => {
            const value = row[0]
            counts[value] = (counts[value] || 0) + 1;
        })

        let availableTimes = []
        for(let time = hours.opening; time < hours.closing; time=time+100){
            if(counts[time] < numTables){
                availableTimes.push(time)
            }
        }

        if(!(availableTimes.includes(parseInt(event.time)))){
            console.log("delete")
            delete availableRestaurants[i]
        }
    }
    

    if(availableRestaurants.length > 0){
        pool.end();
        return{
            statusCode: 200,
            result: {
              "Available Restaurants: " : availableRestaurants
            }
        }
    }

    pool.end();
    return {
        statusCode: 400,
        body: {
          "error": "No available restaurants"
        }
      }
}