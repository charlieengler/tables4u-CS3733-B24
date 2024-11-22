import mysql from 'mysql'

export const handler = async (event) => {

    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    })
    
    let getReservation = (email, confCode) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Reservations WHERE email = ? AND confirmation_code = ?", [email, confCode], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }    

    let getRestaurantName = (restaurant) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT name FROM Restaurants WHERE uid = ?", [restaurant], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let reservation = await getReservation(event.email, event.confCode)
    
    pool.end()

    if(reservation.length > 0){
        let restaurantName = await getRestaurantName(reservation[0].restaurant)
        return{
            statusCode: 200,
            result: {
              "Confirmation Code: " : reservation[0].confirmation_code,
              "Restaurant: " : restaurantName[0].name,
              "Date: ": new Date(reservation[0].date).toISOString().split('T')[0],
              "Time: ": reservation[0].time,
              "Guests": reservation[0].guests
            }
        }
    }
    return {
        statusCode: 400,
        body: {
          "error": "Reservation does not exist"
        }
      }
}