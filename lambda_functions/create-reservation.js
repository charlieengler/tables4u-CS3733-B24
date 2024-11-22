import mysql from 'mysql'

export const handler = async (event) => {

    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    })



    
    let getRid = (date, time, email, restaurant, guests) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT rid FROM Reservations WHERE date = ? AND time = ? AND email = ? AND restaurant = ? AND guests = ?", [date, time, email, restaurant, guests], (error, rows) => {
                if (error) { return reject(error) }
                return resolve(rows[0])
            })
        })
    }

    let createReservation = (date, time, email, restaurant, guests) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Reservations (date, time, email, restaurant, guests) VALUES (?,?,?,?,?)", [date, time, email, restaurant, guests], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let setConfCode = (confCode, rid) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Reservations SET confirmation_code = ? WHERE rid = ?", [confCode, rid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    
    let rid = await getRid(event.date, event.time, event.email, event.restaurant, event.guests)
    console.log(rid)
    if (rid == undefined){
        await createReservation(event.date, event.time, event.email, event.restaurant, event.guests)
        let rid = await getRid(event.date, event.time, event.email, event.restaurant, event.guests)
        let confCode = String(rid.rid).padStart(6, '0');
        console.log(confCode, rid.rid)
        await setConfCode(confCode, rid.rid)

        if(confCode > 0){
            return{
                statusCode: 200,
                result: {
                  "Confirmation Code: " : confCode,
                  "Restaurant: " : event.restaurant,
                  "Date: ": event.date,
                  "Time: ": event.time
                }
            }
        }
        return {
            statusCode: 400,
            body: {
              "error": "Invalid information",
            }
        }
    }
    else{
        return{
        statusCode: 400,
        body: {
            "error": "Reservation already exists"
          }
        }
    }
    pool.end()
}