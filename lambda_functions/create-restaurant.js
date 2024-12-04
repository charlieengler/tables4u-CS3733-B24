import mysql from 'mysql'

export const handler = async (event) => {

    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    })



    let CreateUser = (email, username, password) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Employees (username, email, password, access_level) VALUES (?, ?, ?,?);", [username, username, password, "M"], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    let getEID = (username) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT eid FROM Employees WHERE username = ?", [username], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0].eid);
            })
        })
    }
    let getSchedules = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT sid FROM Schedules WHERE day = 7", (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    let CreateSchedule = (day) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO tables4u.Schedules (day, opening, closing) VALUES (?,?,?);", [day, 800,1700], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    let CreateRestaurant = (restaurantName,address, city, state, zipcode,  manager, schedule) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO tables4u.Restaurants (name, address, city, state, zipcode, schedule_monday, schedule_tuesday, schedule_wednesday, schedule_thursday,schedule_friday, schedule_saturday, schedule_sunday, manager, closings) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);", [restaurantName,address, city, state, zipcode, schedule-6,schedule-5,schedule-4, schedule-3,schedule-2,schedule-1,schedule,manager,"[]"], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    let GetRestaurantID = (restaurantName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT uid FROM Restaurants WHERE name = ?",[restaurantName], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }


        await CreateUser(event.email, event.username, event.password);
        let eid = await getEID(event.username)
        for(let i =1; i<=7; i++){
            await CreateSchedule(i)
        }
        let s = await getSchedules()
        s = s[s.length-1]
        await CreateRestaurant(event.restaurantName,event.address, event.city, event.state, event.zipcode, eid, s.sid)
        let uid = await GetRestaurantID(event.restaurantName)
        let response = {
            statusCode: 200,
            body: {
              "eid": eid,
              "username": event.username,
              "restaurantName": event.restaurantName,
              "uid": uid.uid
            }
          }
    pool.end()
    return response
}